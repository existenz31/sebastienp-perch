const { collection } = require('forest-express-sequelize');

const MarqetaService = require('../services/marqeta-service');
let marqetaService = new MarqetaService(process.env.MARQETA_BASE_URL, process.env.MARQETA_APPLICATION_TOKEN, process.env.MARQETA_ADMIN_ACCESS_TOKEN);

const DwollaService = require('../services/dwolla-service');
let dwollaService = new DwollaService(process.env.DWOLLA_APP_KEY, process.env.DWOLLA_APP_SECRET, process.env.DWOLLA_ENVIRONMENT);

collection('users', {
  actions: [{
    name: 'Approve',
    type: 'single',
    endpoint: '/forest/actions/approve-user',
  },{
    name: 'Suspend',
    type: 'single',
    endpoint: '/forest/actions/suspend-user',
  }],
  fields: [
    {
      field: 'marqetaUser',
      type: 'String',
      reference: 'marqetaUsers.id',
      get: function (user) {
        return marqetaService.getUserSmartRelationship(user);
      }      
    }, {
      field: 'dwollaCustomer',
      type: 'String',
      reference: 'dwollaCustomers.id',
      get: function (user) {
        return dwollaService.getCustomerSmartRelationship(user);
      }      
    },
  ],
  segments: [],
});
