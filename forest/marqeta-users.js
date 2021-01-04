const { collection } = require('forest-express-sequelize');

collection('marqetaUsers', {
  actions: [],
  fields: [
    {
      field: 'id', // populated using token => required by Forest UI
      type: 'String',
    },
    {
      field: 'token', //id
      type: 'String',
    },
    {
      field: 'honorific',
      type: 'String',
    },
    {
      field: 'gender',
      type: 'enum',
      enums: ['M', 'F'],
    },
    {
      field: 'first_name',
      type: 'String',
    },
    {
      field: 'middle_name',
      type: 'String',
    },
    {
      field: 'last_name',
      type: 'String',
    },
    {
      field: 'birth_date',
      type: 'Dateonly',
    },
    {
      field: 'phone',
      type: 'String',
    },
    {
      field: 'email',
      type: 'String',
    },    
    {
      field: 'address1',
      type: 'String',
    },    
    {
      field: 'address2',
      type: 'String',
    },    
    {
      field: 'city',
      type: 'String',
    },    
    {
      field: 'state',
      type: 'String',
    },    
    {
      field: 'postal_code',
      type: 'String',
    },    
    {
      field: 'country',
      type: 'String',
    },    
    {
      field: 'nationality',
      type: 'String',
    },    
    {
      field: 'company',
      type: 'String',
    },    
    {
      field: 'ssn',
      type: 'String',
    },
    {
      field: 'dda',
      type: 'String',
    },
    {
      field: 'direct_deposit_account',
      type: 'String',
    },
    {
      field: 'use_parent_account',
      type: 'Boolean',
    },
    {
      field: 'parent_token',
      type: 'String',
    },
    {
      field: 'notes',
      type: 'String',
    },
    {
      field: 'metadata',
      type: 'Json',
    },
    {
      field: 'password',
      type: 'String',
    },
    {
      field: 'created_time', //created_at
      type: 'Date',
    },
    {
      field: 'last_modified_time', //updated_at
      type: 'Date',
    },
    {
      field: 'active',
      type: 'Boolean',
    },
    {
      field: 'status',
      type: 'String',
    },
  ],
  segments: [],
});
