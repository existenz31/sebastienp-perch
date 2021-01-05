// This model was generated by Lumber. However, you remain in control of your models.
// Learn how here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models
module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  // This section contains the fields of your model, mapped to your table's columns.
  // Learn more here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models#declaring-a-new-field-in-a-model
  const Users = sequelize.define('users', {
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },    
    status: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });

  // This section contains the relationships for this model. See: https://docs.forestadmin.com/documentation/v/v6/reference-guide/relationships#adding-relationships.
  Users.associate = (models) => {
    Users.hasMany(models.identityEvaluations, {
      foreignKey: {
        name: 'userIdKey',
        field: 'user_id',
      },
      as: 'identityEvaluations',
    });
    Users.hasMany(models.leases, {
      foreignKey: {
        name: 'userIdKey',
        field: 'user_id',
      },
      as: 'leases',
    });
    Users.hasMany(models.bankAccounts, {
      foreignKey: {
        name: 'userIdKey',
        field: 'user_id',
      },
      as: 'bankAccounts',
    });
  };

  return Users;
};