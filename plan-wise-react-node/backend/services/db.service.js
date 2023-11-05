const Sequelize = require("sequelize");
const initModels = require("./../models/init-models");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

const db = initModels(sequelize);
(async () => {
  await db.pw_users.sync({ force: false });
  await db.pw_budget_table_expense.sync({ force: false });
  await db.pw_budget_table_income.sync({ force: false });
  await db.pw_categories.sync({ force: false });
  await db.pw_expenses.sync({ force: false });
  await db.pw_income.sync({ force: false });
  await db.pw_notes.sync({ force: false });
})();

module.exports = db;
