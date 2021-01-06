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
    const limit = parseInt(query.page.size) || 20;
    const offset = (parseInt(query.page.number) - 1) * limit;
    const sortBy = query.sort; // Not Supported?
    let fields = query.fields.dwollaCustomers.split(',');
    if (fields && !fields.includes('id')) {
      fields.push('id'); // id is required to get the ID
    }

    let opts = {
      search: query.search,
      limit,
      offset,
    };
    if (query.filters) {
      const filters = JSON.parse(query.filters);
      if (filters.aggregator) {
        for (const filter of filters.conditions) {
          opts[filter.field] = filter.value;
        }
      }
      else {
        opts[filters.field] = filters.value;
      }
    } 

    return this.client.auth.client()
    .then(appToken => appToken.get('customers', opts))
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

  getCustomerFundingSources (recordId, query) {
    // No Pagingation available for this endpoint
    // const limit = parseInt(query.page.size) || 20;
    // const offset = (parseInt(query.page.number) - 1) * limit;

    let fields = query.fields.dwollaFundingSources.split(',');
    if (fields && !fields.includes('id')) {
      fields.push('id'); // id is required to get the ID
    }
    return this.client.auth.client()
    .then(appToken => appToken.get(`customers/${recordId}/funding-sources`))
    .then(result => {
      if (!result.body && !result.body._embedded) return null;
      let fundingSources = [];
      // Only populate the fields required by the UI
      for (const fundingSource of result.body._embedded['funding-sources']) {
        const clonePicked = _.pick(fundingSource, fields);
        fundingSources.push(clonePicked);
      }
      const count = fundingSources.length;
      return { list: fundingSources, count }
    });

  };

  getCustomerTransfers (recordId, query) {
    const limit = parseInt(query.page.size) || 20;
    const offset = (parseInt(query.page.number) - 1) * limit;
    // Sorting not supported yet on related data (hasMany)
    // const sortBy = query.sort; 
    let fields = query.fields.dwollaTransfers.split(',');
    if (fields && !fields.includes('id')) {
      fields.push('id'); // id is required to get the ID
    }

    // Filtering not supported yet on related data (hasMany)
    // if (query.filters) {
    //   const filters = JSON.parse(query.filters);
    //   if (filters.aggregator) {
    //     for (const filter of filters.conditions) {
    //       opts[filter.field] = filter.value;
    //     }
    //   }
    //   else {
    //     opts[filters.field] = filters.value;
    //   }
    // } 

    let opts = {
      search: query.search,
      limit,
      offset,
    };

    return this.client.auth.client()
    .then(appToken => appToken.get(`customers/${recordId}/transfers`, opts))
    .then(result => {
      if (!result.body && !result.body._embedded) return null;
      let transfers = [];
      // Only populate the fields required by the UI
      for (const fundingSource of result.body._embedded['transfers']) {
        const clonePicked = _.pick(fundingSource, fields);
        transfers.push(clonePicked);
      }
      const count = transfers.length;
      return { list: transfers, count }
    });

  };

}

module.exports = DwollaService;
