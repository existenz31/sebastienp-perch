const { collection } = require('forest-express-sequelize');

collection('dwollaTransfers', {
  onlyForRelationships: true,
  isSearchable: true,
  actions: [],
  fields: [
    {
      field: 'id', 
      type: 'String',
      isSortable: true,
    },
    {
      field: 'status',
      type: 'Enum',
      enums: ['processed', 'pending', 'cancelled', 'failed'],
      isFilterable: true,
    },
    {
      field: 'amount',
      type: 'Json', 
    },
    {
      field: 'amountReadable',
      type: 'String',
      get: (transfer) =>{
        if (!transfer.amount) return null;
        var formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: transfer.amount.currency,        
          // These options are needed to round to whole numbers if that's what you want.
          //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
          //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });
        return formatter.format(transfer.amount.value);
      }
    },
    {
      field: 'metadata',
      type: 'Json',        
    },    
    {
      field: 'clearing',
      type: 'Json',        
    },
    {
      field: 'clearing',
      type: 'Json',        
    },
    {
      field: 'achDetails',
      type: 'Json',
    },
    {
      field: 'correlationId',
      type: 'String',
      isFilterable: true,
    },    
    {
      field: 'individualAchId',
      type: 'String',
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
