const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pw_income', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pw_users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'pw_income',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pw_income_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
