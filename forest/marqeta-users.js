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
      isSortable: true,
    },
    {
      field: 'gender',
      type: 'Enum',
      enums: ['M', 'F'],
      isSortable: true,
    },
    {
      field: 'first_name',
      type: 'String',
      isFilterable: true,
      isSortable: true,
    },
    {
      field: 'middle_name',
      type: 'String',
      isSortable: true,
    },
    {
      field: 'last_name',
      type: 'String',
      isFilterable: true,
      isSortable: true,
    },
    {
      field: 'birth_date',
      type: 'Dateonly',
      isSortable: true,
    },
    {
      field: 'phone',
      type: 'String',
      isFilterable: true,
      isSortable: true,
    },
    {
      field: 'email',
      type: 'String',
      isFilterable: true,
      isSortable: true,
    },    
    {
      field: 'address1',
      type: 'String',
      isSortable: true,
    },    
    {
      field: 'address2',
      type: 'String',
      isSortable: true,
    },    
    {
      field: 'city',
      type: 'String',
      isSortable: true,
    },    
    {
      field: 'state',
      type: 'String',
      isSortable: true,
    },    
    {
      field: 'postal_code',
      type: 'String',
      isSortable: true,
    },    
    {
      field: 'country',
      type: 'String',
      isSortable: true,
    },    
    {
      field: 'nationality',
      type: 'String',
      isSortable: true,
    },    
    {
      field: 'company',
      type: 'String',
      isSortable: true,
    },    
    {
      field: 'ssn',
      type: 'String',
      isFilterable: true,
      isSortable: true,
    },
    {
      field: 'dda',
      type: 'String',
      isFilterable: true,
      isSortable: true,
    },
    {
      field: 'direct_deposit_account',
      type: 'String',
      isFilterable: true,
      isSortable: true,
    },
    {
      field: 'use_parent_account',
      type: 'Boolean',
      isSortable: true,
    },
    {
      field: 'parent_token',
      type: 'String',
      isSortable: true,
    },
    {
      field: 'notes',
      type: 'String',
      isSortable: true,
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
      isSortable: true,
    },
    {
      field: 'last_modified_time', //updated_at
      type: 'Date',
      isSortable: true,
    },
    {
      field: 'active',
      type: 'Boolean',
      isSortable: true,
    },
    {
      field: 'status',
      type: 'String',
      isSortable: true,
    },
  ],
  segments: [],
});
