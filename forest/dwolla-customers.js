const { collection } = require('forest-express-sequelize');

collection('dwollaCustomers', {
  actions: [],
  fields: [
    {
      field: 'id', 
      type: 'String',
    },
    {
      field: 'firstName',
      type: 'String',
      // isFilterable: true,
      // isSortable: true,
    },
    {
      field: 'lastName',
      type: 'String',
      // isFilterable: true,
      // isSortable: true,
    },
    {
      field: 'fullName',
      type: 'String',
      get: (customer) => {
        return customer.firstName + ' ' + customer.lastName;
      },
    },
    {
      field: 'type',
      type: 'Enum',
      enums: ['unverified', 'personal', 'business', 'receive-only'],
      // isFilterable: true,
      // isSortable: true,
    },
    {
      field: 'email',
      type: 'String',
      // isFilterable: true,
      // isSortable: true,
    },    
    {
      field: 'businessName',
      type: 'String',
    },    
    {
      field: 'created', //created_at
      type: 'Date',
      // isSortable: true,
    },
    {
      field: 'status',
      type: 'Enum',
      enums: ['unverified', 'suspended', 'retry', 'document', 'verified'],
      // isSortable: true,
    },
  ],
  segments: [],
});
