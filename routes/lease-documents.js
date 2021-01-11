const express = require('express');
const { PermissionMiddlewareCreator, RecordsGetter } = require('forest-express-sequelize');
const models = require('../models');
const { Op } = require('sequelize');
const _ = require('lodash');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('leaseDocuments');

// This file contains the logic of every route in Forest Admin for the collection leaseDocuments:
// - Native routes are already generated but can be extended/overriden - Learn how to extend a route here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/extend-a-route
// - Smart action routes will need to be added as you create new Smart Actions - Learn how to create a Smart Action here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/actions/create-and-manage-smart-actions

// Create a Lease Document
router.post('/leaseDocuments', permissionMiddlewareCreator.create(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#create-a-record
  next();
});

// Update a Lease Document
router.put('/leaseDocuments/:recordId', permissionMiddlewareCreator.update(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#update-a-record
  next();
});

// Delete a Lease Document
router.delete('/leaseDocuments/:recordId', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-record
  next();
});

// Get a list of Lease Documents
router.get('/leaseDocuments', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-list-of-records
  next();
});

// Get a number of Lease Documents
router.get('/leaseDocuments/count', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-number-of-records
  next();
});

// Get a Lease Document
router.get('/leaseDocuments/:recordId', permissionMiddlewareCreator.details(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-record
  next();
});

// Export a list of Lease Documents
router.get('/leaseDocuments.csv', permissionMiddlewareCreator.export(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#export-a-list-of-records
  next();
});

// Delete a list of Lease Documents
router.delete('/leaseDocuments', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-list-of-records
  next();
});

let wellickModels = models;

router.post('/actions/approve-lease', permissionMiddlewareCreator.smartAction(), (req, res, next) => {
  const recordId = parseInt(req.body.data.attributes.ids[0]); // I expect the smart action is single

  wellickModels.leaseDocuments.findByPk(recordId)
  .then((leaseDocument) => {
    if (!leaseDocument) {
      res.status(400).send({error: 'Unable to Find Lease Document!'});
      return;
    }
    return leaseDocument.update(
      { status: 'APPROVED' },
    );
  })
  .then ((leaseDocumentUpdated) => {
    return wellickModels.leases.update(
      { status: 'APPROVED' },
      { 
        where: {
          id: leaseDocumentUpdated.leaseIdKey
        }
      },
    );
})
  .then(([numberOfAffectedRows]) => {
    res.send({succes: 'Lease has been approved'});
  })
  .catch(error => {
    console.log(error);
    next(error);
  });
});

router.post('/actions/approve-lease-bulk', permissionMiddlewareCreator.smartAction(), (req, res, next) => {
  const recordsGetter = new RecordsGetter(wellickModels.leaseDocuments);
  return recordsGetter.getIdsFromRequest(req)
  .then((ids) => {
    return wellickModels.leaseDocuments.findAll({
      where: {id: {[Op.in]: ids}},
    });
  })
  .then(async (leaseDocumentsFound) => {
    if (!leaseDocumentsFound || leaseDocumentsFound.length < 1) {
      res.status(400).send({error: 'Unable to Find Lease Document!'});
      return;
    }
    for (let leaseDocument of leaseDocumentsFound) {
      // Update all lease documents found (using await because it is a Promise)
      await leaseDocument.update(
        { status: 'APPROVED' },
      );  
    }
    return _.uniq(leaseDocumentsFound.map(item => item.leaseIdKey));
  })
  .then ((leaseIds) => {
    return wellickModels.leases.update(
      { status: 'APPROVED' },
      { 
        where:  {id: {[Op.in]: leaseIds}},
      }
    );
  })
  .then(([numberOfAffectedRows]) => {
    res.send({succes: 'Lease has been approved'});
  })
  .catch(error => {
    console.log(error);
    next(error);
  });
});

module.exports = router;
