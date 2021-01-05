const { collection } = require('forest-express-sequelize');

const MarqetaService = require('../services/marqeta-service');
let marqetaService = new MarqetaService(process.env.MARQETA_BASE_URL, process.env.MARQETA_TOKEN);

collection('users', {
  actions: [{
    name: 'Approve',
    type: 'single',
    endpoint: '/forest/actions/approve-user',
  }],
  fields: [
    {
      field: 'marqetaUser',
      type: 'String',
      reference: 'marqetaUsers.token',
      get: function (user) {
        return marqetaService.getUserSmartRelationship(user);
      }      
    }
  ],
  segments: [],
});
