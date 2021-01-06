"use strict";

const { default: axios } = require('axios');

class MarqetaService {
  constructor(baseURL, appToken, adminAccessToken) {
    this.baseURL = baseURL;
    this.instance = axios.create({
      baseURL: this.baseURL,
      //timeout: 1000,
      //headers: {'Authorization': 'Basic ' + this.token},
      auth : {
        username: appToken,
        password: adminAccessToken,
      },
    });
  } 

  toCamelCase(field){
    let order = '';
    let fieldName = field;
    if (field.startsWith('-')) {
      order = '-';
      fieldName = field.substring(1);
    }
    const result = fieldName.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    return `${order}${result}`;
  }

  async getUsers (query) {
    const pageSize= parseInt(query.page.size) || 20;
    const pageNumber= parseInt(query.page.number)-1;
    const sortBy = query.sort ? this.toCamelCase(query.sort) : null;
    let fields = query.fields.marqetaUsers.split(',');
    if (fields && !fields.includes('token')) {
      fields.push('token'); // token is required to get the ID
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
    const result = await this.instance.post(`/users/lookup`,
      body,
      {
        params: { count: pageSize, start_index: pageNumber, fields: null, sort_by: sortBy }
      });
    if (!result.data)
      return null;
    let marqetaUsers = result.data.data;
    const count = result.data.count;
    for (let marqetaUser of marqetaUsers) {
      marqetaUser.id = marqetaUser.token; // required for FA UI
    }
    return await { list: marqetaUsers, count };
  
  };

  async getUser (recordId) {
    const result = await this.instance.get(`/users/${recordId}`);
    if (!result.data)
      return null;
    let marqetaUser = result.data;
    marqetaUser.id = marqetaUser.token; // required for FA UI
    return marqetaUser;
  }

  async getUserSmartRelationship (user) {

    const response = await this.instance.post(`/users/lookup`,
      {
        email: user.email,
      }, {
      params: { fields: 'token,email,gender,first_name,last_name' } // We ask only for the reference field + ID
    });
    if (response.data.count !== 1)
      return null;
    let marqetaUser = response.data.data[0];
    marqetaUser.id = marqetaUser.token; // required for FA UI
    return marqetaUser;
}
}

module.exports = MarqetaService;
