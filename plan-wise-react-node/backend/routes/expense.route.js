const express = require('express');
const expenseController = require('../api/controllers/expense.controller');
const { validateToken } = require('../middlewares/validate-access-token.middleware');

const apiExpense = express.Router();

apiExpense.post('/expense', validateToken, (req, res) => expenseController.create_expense(req, res));
apiExpense.get('/expenses', validateToken, (req, res) => expenseController.get_expenses_by_user(req, res));
apiExpense.get('/expenses/:expense_id', validateToken, (req, res) => expenseController.get_expense(req, res));
apiExpense.put('/expenses/:expense_id', validateToken, (req, res) => expenseController.update_expense(req, res));
apiExpense.delete('/expenses/:expense_id', validateToken, (req, res) => expenseController.delete_expense(req, res));

module.exports = apiExpense;
