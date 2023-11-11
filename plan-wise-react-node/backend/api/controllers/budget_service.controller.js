const BudgetService = require('../../services/budget_table.service');

class BudgetController {
    constructor() {
        this.budgetService = new BudgetService();
    }

    async create_note(req, res) {
        const result = await this.budgetService.create_note(req.user_id, req.body.date, req.body.notes);
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(400).send(result);
        }
    }

    async get_note(req, res) {
        const result = await this.budgetService.get_note(req.user_id, req.params.note_id);
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(400).send(result);
        }
    }

    async get_notes_by_date(req, res) {
        const result = await this.budgetService.get_notes_by_date(req.user_id, req.query.date);
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(400).send(result);
        }
    }

    async update_note(req, res) {
        const result = await this.budgetService.update_note(req.user_id, req.params.note_id, req.body.new_notes);
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(400).send(result);
        }
    }

    async update_notes_by_date(req, res) {
        const result = await this.budgetService.update_notes_by_date(req.user_id, req.query.date, req.body);
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(400).send(result);
        }
    }

    async delete_note(req, res) {
        const result = await this.budgetService.delete_note(req.user_id, req.params.note_id);
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(400).send(result);
        }
    }

    async update_budgets(req, res) {
        try {
            const budget = req.body;
            const user_id = req.user_id;

            // Update income
            for (let income of budget.income) {
                const result = await this.budgetService.update_income(income);
                if (!result) {
                    return res.status(400).send({ "success": false, "message": "Invalid Request" });
                }
            }

            // Update expenses
            for (let expense of budget.expense) {
                const result = await this.budgetService.update_expense(expense);
                if (!result) {
                    return res.status(400).send({ "success": false, "message": "Invalid Request" });
                }
            }

            return res.status(200).send({ "success": true, "message": "Budgets updated successfully" });
        } catch (e) {
            return res.status(400).send({ "success": false, "message": e.message });
        }
    }

    async get_budgets_in_date_range(req, res) {
        const start_date_str = req.query.start_date_str;
        const user_id = req.user_id;

        const result = await this.budgetService.get_budgets_in_date_range(user_id, start_date_str);
        if (result.message === "Retrieved budgets in date range") {
            return res.status(200).send(result);
        } else {
            return res.status(400).send(result);
        }
    }
}

module.exports = new BudgetController();
