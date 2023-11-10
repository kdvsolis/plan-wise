const express = require('express');
const budgetController = require('../api/controllers/budget_service.controller');
const { validateToken } = require('../middlewares/validate-access-token.middleware');

const apiBudget = express.Router();

apiBudget.post('/notes', validateToken, (req, res) => budgetController.create_note(req, res));
apiBudget.get('/notes/:note_id', validateToken, (req, res) => budgetController.get_note(req, res));
apiBudget.get('/notes', validateToken, (req, res) => budgetController.get_notes_by_date(req, res));
apiBudget.put('/notes/:note_id', validateToken, (req, res) => budgetController.update_note(req, res));
apiBudget.put('/notes', validateToken, (req, res) => budgetController.update_notes_by_date(req, res));
apiBudget.delete('/notes/:note_id', validateToken, (req, res) => budgetController.delete_note(req, res));
apiBudget.put('/update_budgets', validateToken, (req, res) => budgetController.update_budgets(req, res));
apiBudget.get('/get_budgets_in_date_range', validateToken, (req, res) => budgetController.get_budgets_in_date_range(req, res));

module.exports = apiBudget;
