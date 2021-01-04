const { default: axios } = require('axios');
const { collection } = require('forest-express-sequelize');

collection('users', {
  actions: [],
  fields: [
    {
      field: 'marqetaUser',
      type: 'String',
      reference: 'marqetaUsers.token',
      get: function (user) {
        const instance = axios.create({
          baseURL: process.env.MARQETA_BASE_URL,
          //timeout: 1000,
          headers: {'Authorization': 'Basic ' + process.env.MARQETA_TOKEN}
        })

        return instance.post(`/users/lookup`, 
        {
          email: user.email,
        }, {
          params: { fields: 'token,email,gender,first_name,last_name'} // We ask only for the reference field + ID
        })
        .then(response => {
          if (response.data.count !== 1) return null;
          marqetaUser = response.data.data[0];
          marqetaUser.id = marqetaUser.token; // required for FA UI
          return marqetaUser;
        });
      }      
    }
  ],
  segments: [],
});
