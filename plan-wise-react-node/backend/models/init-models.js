var DataTypes = require("sequelize").DataTypes;
var _pw_budget_table_expense = require("./pw_budget_table_expense");
var _pw_budget_table_income = require("./pw_budget_table_income");
var _pw_categories = require("./pw_categories");
var _pw_expenses = require("./pw_expenses");
var _pw_income = require("./pw_income");
var _pw_notes = require("./pw_notes");
var _pw_users = require("./pw_users");

function initModels(sequelize) {
  var pw_budget_table_expense = _pw_budget_table_expense(sequelize, DataTypes);
  var pw_budget_table_income = _pw_budget_table_income(sequelize, DataTypes);
  var pw_categories = _pw_categories(sequelize, DataTypes);
  var pw_expenses = _pw_expenses(sequelize, DataTypes);
  var pw_income = _pw_income(sequelize, DataTypes);
  var pw_notes = _pw_notes(sequelize, DataTypes);
  var pw_users = _pw_users(sequelize, DataTypes);

  pw_budget_table_expense.belongsTo(pw_categories, { as: "category_pw_category", foreignKey: "category"});
  pw_categories.hasMany(pw_budget_table_expense, { as: "pw_budget_table_expenses", foreignKey: "category"});
  pw_expenses.belongsTo(pw_categories, { as: "category_pw_category", foreignKey: "category"});
  pw_categories.hasMany(pw_expenses, { as: "pw_expenses", foreignKey: "category"});
  pw_budget_table_expense.belongsTo(pw_users, { as: "user", foreignKey: "user_id"});
  pw_users.hasMany(pw_budget_table_expense, { as: "pw_budget_table_expenses", foreignKey: "user_id"});
  pw_budget_table_income.belongsTo(pw_users, { as: "user", foreignKey: "user_id"});
  pw_users.hasMany(pw_budget_table_income, { as: "pw_budget_table_incomes", foreignKey: "user_id"});
  pw_categories.belongsTo(pw_users, { as: "user", foreignKey: "user_id"});
  pw_users.hasMany(pw_categories, { as: "pw_categories", foreignKey: "user_id"});
  pw_expenses.belongsTo(pw_users, { as: "user", foreignKey: "user_id"});
  pw_users.hasMany(pw_expenses, { as: "pw_expenses", foreignKey: "user_id"});
  pw_income.belongsTo(pw_users, { as: "user", foreignKey: "user_id"});
  pw_users.hasMany(pw_income, { as: "pw_incomes", foreignKey: "user_id"});
  pw_notes.belongsTo(pw_users, { as: "user", foreignKey: "user_id"});
  pw_users.hasMany(pw_notes, { as: "pw_notes", foreignKey: "user_id"});

  return {
    pw_budget_table_expense,
    pw_budget_table_income,
    pw_categories,
    pw_expenses,
    pw_income,
    pw_notes,
    pw_users
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
