const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pw_budget_table_income', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pw_users',
        key: 'id'
      }
    },
    income_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    source: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    frequency: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pw_budget_table_income',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pw_budget_table_income_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
