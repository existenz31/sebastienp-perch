const { collection } = require('forest-express-sequelize');

collection('dwollaCustomers', {
  isSearchable: true,
  actions: [],
  fields: [
    {
      field: 'id', 
      type: 'String',
    },
    {
      field: 'firstName',
      type: 'String',
      // isSortable: true,
    },
    {
      field: 'lastName',
      type: 'String',
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
    },
    {
      field: 'email',
      type: 'String',
      isFilterable: true,
    },    
    {
      field: 'businessName',
      type: 'String',
      isFilterable: true,
    },    
    {
      field: 'created', //created_at
      type: 'Date',
    },
    {
      field: 'status',
      type: 'Enum',
      enums: ['unverified', 'suspended', 'retry', 'document', 'verified'],
      isFilterable: true,
    },
    {
      field: 'fundingSources',
      type: ['String'],
      reference: 'dwollaFundingSources.id',
    },    
    {
      field: 'transfers',
      type: ['String'],
      reference: 'dwollaTransfers.id',
    },    
  ],
  segments: [],
});
