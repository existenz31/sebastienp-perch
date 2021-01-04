// This model was generated by Lumber. However, you remain in control of your models.
// Learn how here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models
module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  // This section contains the fields of your model, mapped to your table's columns.
  // Learn more here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models#declaring-a-new-field-in-a-model
  const Leases = sequelize.define('leases', {
    monthlyPayments: {
      type: DataTypes.DOUBLE,
    },
    cost: {
      type: DataTypes.DOUBLE,
    },
    status: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'leases',
    underscored: true,
    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });

  // This section contains the relationships for this model. See: https://docs.forestadmin.com/documentation/v/v6/reference-guide/relationships#adding-relationships.
  Leases.associate = (models) => {
    Leases.belongsTo(models.users, {
      foreignKey: {
        name: 'userIdKey',
        field: 'user_id',
      },
      as: 'user',
    });
    Leases.hasMany(models.leaseDocuments, {
      foreignKey: {
        name: 'leaseIdKey',
        field: 'lease_id',
      },
      as: 'leaseDocuments',
    });
  };

  return Leases;
};
