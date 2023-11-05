const IncomeService = require('../../services/income.service');

class IncomeController {
    constructor() {
        this.incomeService = new IncomeService();
    }

    async create_income(req, res) {
        const result = await this.incomeService.create_income(req.user_id, req.body);
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(400).send(result);
        }
    }

    async get_income_by_user(req, res) {
        const result = await this.incomeService.get_income_by_user(req.user_id);
        if (result.message === "Income retrieved successfully") {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    async get_income(req, res) {
        const result = await this.incomeService.get_income(req.user_id, req.params.income_id);
        if (result.message === "Income retrieved successfully") {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    async update_income(req, res) {
        const result = await this.incomeService.update_income(req.user_id, req.params.income_id, req.body);
        if (result.message === "Income updated successfully") {
            res.status(200).send(result);
        } else {
            res.status(result.message === "Income not found or not owned by the user" ? 404 : 400).send(result);
        }
    }

    async delete_income(req, res) {
        const result = await this.incomeService.delete_income(req.user_id, req.params.income_id);
        if (result.message === "Income deleted successfully") {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }
}

module.exports = new IncomeController();
