const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const { users } = require('../models');

const GRAPHQL_URL = 'https://integral-mantis-19.hasura.app/v1/graphql';

/* Dependencies for graphql-request */
const { request, gql } = require('graphql-request');

/* Dependencies for apollo-client */
const {ApolloClient, InMemoryCache, createHttpLink} = require('@apollo/client/core');
const gqlApollo = require('@apollo/client/core').gql;
const {fetch} = require('cross-fetch/polyfill');

/* Init the Apollo Client */
const clientApollo = new ApolloClient({
  link: createHttpLink({
      uri: GRAPHQL_URL,
      fetch: fetch
  }),
  uri: GRAPHQL_URL,
  cache: new InMemoryCache()
});



const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('users');

// This file contains the logic of every route in Forest Admin for the collection users:
// - Native routes are already generated but can be extended/overriden - Learn how to extend a route here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/extend-a-route
// - Smart action routes will need to be added as you create new Smart Actions - Learn how to create a Smart Action here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/actions/create-and-manage-smart-actions

// Create a User
router.post('/users', permissionMiddlewareCreator.create(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#create-a-record
  next();
});

// Update a User
router.put('/users/:recordId', permissionMiddlewareCreator.update(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#update-a-record
  next();
});

// Delete a User
router.delete('/users/:recordId', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-record
  next();
});

// Get a list of Users
router.get('/users', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-list-of-records
  next();
});

// Get a number of Users
router.get('/users/count', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-number-of-records
  next();
});

// Get a User
router.get('/users/:recordId', permissionMiddlewareCreator.details(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-record
  next();
});

// Export a list of Users
router.get('/users.csv', permissionMiddlewareCreator.export(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#export-a-list-of-records
  next();
});

// Delete a list of Users
router.delete('/users', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-list-of-records
  next();
});

router.post('/actions/approve-user-request', permissionMiddlewareCreator.smartAction(), (req, res, next) => {
  const recordId = req.body.data.attributes.ids[0];

   const queryFields = 'status';

  const query = gql`
    mutation activateUser {
      activateUser(id: "${recordId}") {
				${queryFields}
      }
    }`;
    
  request(GRAPHQL_URL, query).then((result) => {
    if (result.activateUser.status === "OK") {
      res.send({success: 'User Approved'});
    }
    else {
      res.status(400).send({error: 'Unable to Approve the User!'});
    }
  })
  .catch(next);    
});

router.post('/actions/suspend-user', permissionMiddlewareCreator.smartAction(), (req, res, next) => {
  const recordId = req.body.data.attributes.ids[0];

   const queryFields = 'status';

  const query = gql`
    mutation suspendUser {
      suspendUser(id: "${recordId}") {
				${queryFields}
      }
    }`;
    
  request(GRAPHQL_URL, query).then((result) => {
    if (result.suspendUser.status === "OK") {
      res.send({success: 'User Suspended'});
    }
    else {
      res.status(400).send({error: 'Unable to Suspend the User!'});
    }
  })
  .catch(next);    
});


router.post('/actions/approve-user', permissionMiddlewareCreator.smartAction(), (req, res, next) => {
  const recordId = req.body.data.attributes.ids[0];

  const queryFields = 'status';

  const query = gqlApollo`
    mutation activateUser {
      activateUser(id: "${recordId}") {
				${queryFields}
      }
    }`;

  clientApollo.mutate({mutation: query})
  .then((result) => {
    if (result.data.activateUser.status === "OK") { // With Apollo Client, result.data.XXXX
      res.send({success: 'User Approved'});
    }
    else {
      res.status(400).send({error: 'Unable to Approve the User!'});
    }
  })
  .catch(next);    
});

module.exports = router;
