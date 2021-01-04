const { default: axios } = require('axios');
const express = require('express');
const { PermissionMiddlewareCreator, RecordSerializer } = require('forest-express-sequelize');
const models = require('../models');

const MODEL_NAME = 'marqetaUsers';

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(`${MODEL_NAME}`);

// Get a list of Users
router.get(`/${MODEL_NAME}`, permissionMiddlewareCreator.list(), (request, response, next) => {
  next();
});

// Get a User
router.get(`/${MODEL_NAME}/:recordId`, permissionMiddlewareCreator.details(), (request, response, next) => {
  const recordId = request.params.recordId;
  const instance = axios.create({
    baseURL: process.env.MARQETA_BASE_URL,
    //timeout: 1000,
    headers: {'Authorization': 'Basic ' + process.env.MARQETA_TOKEN}
  })

  instance.get(`/users/${recordId}`)
  .then(async result => {
    if (!result.data) return null;
    marqetaUser = result.data;
    marqetaUser.id = marqetaUser.token; // required for FA UI
    const recordSerializer = new RecordSerializer({ name: MODEL_NAME });
    const recordSerialized = await recordSerializer.serialize(marqetaUser);
    response.send(recordSerialized);
  })
  .catch(next);

});


module.exports = router;
