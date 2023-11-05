const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pw_budget_table_expense', {
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
    expense_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    expenses: {
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
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pw_categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'pw_budget_table_expense',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pw_budget_table_expense_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
