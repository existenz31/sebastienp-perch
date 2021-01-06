const express = require('express');
const { PermissionMiddlewareCreator, RecordSerializer } = require('forest-express-sequelize');

const MarqetaService = require('../services/marqeta-service');
let marqetaService = new MarqetaService(process.env.MARQETA_BASE_URL, process.env.MARQETA_APPLICATION_TOKEN, process.env.MARQETA_ADMIN_ACCESS_TOKEN);

const MODEL_NAME = 'marqetaUsers';

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(`${MODEL_NAME}`);

// Get a list of Users
router.get(`/${MODEL_NAME}`, permissionMiddlewareCreator.list(), (request, response, next) => {

  marqetaService.getUsers(request.query)
  .then(async result => {
    const recordSerializer = new RecordSerializer({ name: MODEL_NAME });
    const recordsSerialized = await recordSerializer.serialize(result.list);
    response.send({ ...recordsSerialized, meta:{ count: result.count }});  
  })
  .catch(next);

});

// Get a User
router.get(`/${MODEL_NAME}/:recordId`, permissionMiddlewareCreator.details(), (request, response, next) => {
  const recordId = request.params.recordId;
  marqetaService.getUser(recordId)
  .then(async marqetaUser => {
    const recordSerializer = new RecordSerializer({ name: MODEL_NAME });
    const recordSerialized = await recordSerializer.serialize(marqetaUser);
    response.send(recordSerialized);
  })
  .catch(next);

});


module.exports = router;
