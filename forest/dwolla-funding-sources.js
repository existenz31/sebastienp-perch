const { collection } = require('forest-express-sequelize');

collection('dwollaFundingSources', {
  onlyForRelationships: true,
  actions: [],
  fields: [
    {
      field: 'id', 
      type: 'String',
    },
    {
      field: 'status',
      type: 'Enum',
      enums: ['unverified', 'verified']
    },
    {
      field: 'type',
      type: 'Enum',
      enums: ['bank', 'balance']
    },
    {
      field: 'bankAccountType',
      type: 'Enum',
      enums: ['checking', 'savings', 'general-ledger', 'loan']
    },
    {
      field: 'name',
      type: 'String',
    },
    {
      field: 'balance',
      type: 'Json',        
    },
    {
      field: 'balanceReadable',
      type: 'String',
      get: (fundingSource) =>{
        if (!fundingSource.balance) return null;
        var formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: fundingSource.balance.currency,        
          // These options are needed to round to whole numbers if that's what you want.
          //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
          //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });
        return formatter.format(fundingSource.balance.value);
      }
    },
    {
      field: 'removed',
      type: 'Boolean',
    },
    {
      field: 'channels',
      type: ['String'],
    },    
    {
      field: 'bankName',
      type: 'String',
    },    
    {
      field: 'fingerprint',
      type: 'String',
    },    
    {
      field: 'created', //created_at
      type: 'Date',
    },
  ],
  segments: [],
});
