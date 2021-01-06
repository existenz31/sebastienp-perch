const express = require('express');
const { PermissionMiddlewareCreator, RecordSerializer } = require('forest-express-sequelize');

const DwollaService = require('../services/dwolla-service');
let dwollaService = new DwollaService(process.env.DWOLLA_APP_KEY, process.env.DWOLLA_APP_SECRET, process.env.DWOLLA_ENVIRONMENT);

const MODEL_NAME = 'dwollaCustomers';

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(`${MODEL_NAME}`);

// Get a list of Customers
router.get(`/${MODEL_NAME}`, permissionMiddlewareCreator.list(), (request, response, next) => {

  dwollaService.getCustomers(request.query)
  .then(async result => {
    const recordSerializer = new RecordSerializer({ name: MODEL_NAME });
    const recordsSerialized = await recordSerializer.serialize(result.list);
    response.send({ ...recordsSerialized, meta:{ count: result.count }});  
  })
  .catch(next);

});

// Get a Customer
router.get(`/${MODEL_NAME}/:recordId`, permissionMiddlewareCreator.details(), (request, response, next) => {
  const recordId = request.params.recordId;
  dwollaService.getCustomer(recordId)
  .then(async dwollaCustomer => {
    const recordSerializer = new RecordSerializer({ name: MODEL_NAME });
    const recordSerialized = await recordSerializer.serialize(dwollaCustomer);
    response.send(recordSerialized);
  })
  .catch(next);

});

router.get(`/${MODEL_NAME}/:recordId/relationships/fundingSources`, (request, response, next) => {
  const recordId = request.params.recordId;
  dwollaService.getCustomerFundingSources(recordId, request.query)
  .then(async result => {
    const recordSerializer = new RecordSerializer({ name: 'dwollaFundingSources' });
    const recordsSerialized = await recordSerializer.serialize(result.list);
    response.send({ ...recordsSerialized, meta:{ count: result.count }});  
  })
  .catch(next);
});

router.get(`/${MODEL_NAME}/:recordId/relationships/transfers`, (request, response, next) => {
  const recordId = request.params.recordId;
  dwollaService.getCustomerTransfers(recordId, request.query)
  .then(async result => {
    const recordSerializer = new RecordSerializer({ name: 'dwollaTransfers' });
    const recordsSerialized = await recordSerializer.serialize(result.list);
    response.send({ ...recordsSerialized, meta:{ count: result.count }});  
  })
  .catch(next);
});

module.exports = router;
