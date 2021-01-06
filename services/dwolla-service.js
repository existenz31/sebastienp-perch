"use strict";

const dwolla = require('dwolla-v2');
var _ = require('lodash');

class DwollaService {
  constructor(appKey, appSecret, environment) {
    this.client = new dwolla.Client({
      key: appKey,
      secret: appSecret,
      environment: environment // optional - defaults to production
    });
  } 

  getCustomers (query) {
    const pageSize= parseInt(query.page.size) || 20;
    const pageNumber= parseInt(query.page.number)-1;
    const sortBy = query.sort;
    let fields = query.fields.dwollaCustomers.split(',');
    if (fields && !fields.includes('id')) {
      fields.push('id'); // id is required to get the ID
    }

    let body = {};
    if (query.filters) {
      const filters = JSON.parse(query.filters);
      if (filters.aggregator) {
        for (const filter of filters.conditions) {
          body[filter.field] = filter.value;
        }
      }
      else {
        body[filters.field] = filters.value;
      }
    } 
    return this.client.auth.client()
    .then(appToken => appToken.get('customers', { limit: pageSize }))
    .then(result => {
      if (!result.body && !result.body._embedded) return null;
      let dwollaCustomers = [];
      // Only populate the fields required by the UI
      for (const customer of result.body._embedded.customers) {
        const clonePicked = _.pick(customer, fields);
        dwollaCustomers.push(clonePicked);
      }
      //let dwollaCustomers = result.body._embedded.customers;
      const count = result.body.total;
      return { list: dwollaCustomers, count }
    });

  };

  async getCustomer (recordId) {

    return this.client.auth.client()
    .then(appToken => appToken.get(`customers/${recordId}`))
    .then(result => {
      if (!result.body) return null;
      let dwollaCustomer = result.body;
      return dwollaCustomer;
    });    
  }

  async getCustomerSmartRelationship (user) {
    return this.client.auth.client()
    .then(appToken => appToken.get('customers', { email: user.email })) // filter on email
    .then(result => {
      if (!result.body && !result.body._embedded && result.body._embedded.customers.length !== 1 ) return null;
      let dwollaCustomer = result.body._embedded.customers[0];
      // Only populate the fields required by the UI
      const clonePicked = _.pick(dwollaCustomer, ['id', 'email', 'firstName', 'lastName' ]); // We ask only for the reference field + ID
      return clonePicked;
    });
  }
}

module.exports = DwollaService;
