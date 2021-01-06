const express = require('express');
const { PermissionMiddlewareCreator, RecordSerializer } = require('forest-express-sequelize');

const DwollaService = require('../services/dwolla-service');
let dwollaService = new DwollaService(process.env.DWOLLA_APP_KEY, process.env.DWOLLA_APP_SECRET, process.env.DWOLLA_ENVIRONMENT);

const MODEL_NAME = 'dwollaTransfers';

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(`${MODEL_NAME}`);

// Get a Transfer
router.get(`/${MODEL_NAME}/:recordId`, permissionMiddlewareCreator.details(), (request, response, next) => {
  const recordId = request.params.recordId;
  dwollaService.getTransfer(recordId)
  .then(async record => {
    const recordSerializer = new RecordSerializer({ name: MODEL_NAME });
    const recordSerialized = await recordSerializer.serialize(record);
    response.send(recordSerialized);
  })
  .catch(next);

});

module.exports = router;
