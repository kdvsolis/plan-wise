const ExpenseService = require('../../services/expense.service');

class ExpenseController {
    constructor() {
        this.expenseService = new ExpenseService();
    }

    async create_expense(req, res) {
        const result = await this.expenseService.create_expense(req.user_id, req.body);
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(400).send(result);
        }
    }

    async get_expenses_by_user(req, res) {
        const result = await this.expenseService.get_expenses_by_user(req.user_id);
        if (result.message === "Expense retrieved successfully") {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    async get_expense(req, res) {
        const result = await this.expenseService.get_expense(req.user_id, req.params.expense_id);
        if (result.message === "Expense retrieved successfully") {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    async update_expense(req, res) {
        const result = await this.expenseService.update_expense(req.user_id, req.params.expense_id, req.body);
        if (result.message === "Expense updated successfully") {
            res.status(200).send(result);
        } else {
            res.status(result.message === "Expense not found or not owned by the user" ? 404 : 400).send(result);
        }
    }

    async delete_expense(req, res) {
        const result = await this.expenseService.delete_expense(req.user_id, req.params.expense_id);
        if (result.message === "Expense deleted successfully") {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }
}

module.exports = new ExpenseController();
