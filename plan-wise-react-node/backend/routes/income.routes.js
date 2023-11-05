const express = require('express');
const incomeController = require('../api/controllers/income.controller');
const { validateToken } = require('../middlewares/validate-access-token.middleware');

const apiIncome = express.Router();

apiIncome.post('/income', validateToken, (req, res) => incomeController.create_income(req, res));
apiIncome.get('/income', validateToken, (req, res) => incomeController.get_income_by_user(req, res));
apiIncome.get('/income/:income_id', validateToken, (req, res) => incomeController.get_income(req, res));
apiIncome.put('/income/:income_id', validateToken, (req, res) => incomeController.update_income(req, res));
apiIncome.delete('/income/:income_id', validateToken, (req, res) => incomeController.delete_income(req, res));

module.exports = apiIncome;
