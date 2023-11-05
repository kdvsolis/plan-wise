const db = require('./db.service');
const { group_by_date } = require('../util/date_data_generator');
const Sequelize = require("sequelize");

class IncomeService {
    constructor() {
        // This is intentional
    }

    async create_income(user_id, income_request) {
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        let income = await db.pw_income.create({
            user_id: user_id,
            source: income_request.source,
            amount: income_request.amount,
            start_date: income_request.start_date,
            frequency: income_request.frequency
        });

        let income_id = income.id;

        let budget_data = group_by_date([{
            source: income_request.source,
            income_id: income_id,
            amount: income_request.amount,
            start_date: income_request.start_date,
            frequency: income_request.frequency
        }]);

        let budget_incomes = [];
        for (let date in budget_data) {
            for (let inc of budget_data[date]) {
                let budget_income = await db.pw_budget_table_income.create({
                    date: date,
                    user_id: user_id,
                    income_id: income_id,
                    source: inc.source,
                    amount: inc.amount,
                    start_date: inc.start_date,
                    frequency: inc.frequency
                });
                budget_incomes.push(budget_income);
            }
        }

        return { success: true, message: "Income and budget incomes created successfully", income: income };
    }

    async get_income(user_id, income_id) {
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const income = await db.pw_income.findOne({ where: { id: income_id, user_id: user_id } });
        if (!income) {
            return { success: false, message: "Income not found or not owned by the user" };
        }

        return { success: true, message: "Income retrieved successfully", income: income };
    }

    async get_income_by_user(user_id) {
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const incomes = await db.pw_income.findAll({ where: { user_id: user_id }, order: [['start_date', 'ASC']] });
        if (!incomes) {
            return { success: false, message: "Income not found or not owned by the user" };
        }

        return { success: true, message: "Income retrieved successfully", income: incomes };
    }

    async update_income(user_id, income_id, income_request) {
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        let income = await db.pw_income.findOne({ where: { id: income_id, user_id: user_id } });
        if (!income) {
            return { success: false, message: "Income not found or not owned by the user" };
        }

        income.source = income_request.source !== undefined ? income_request.source : income.source;
        income.amount = income_request.amount !== undefined ? income_request.amount : income.amount;
        income.start_date = income_request.start_date !== undefined ? income_request.start_date : income.start_date;
        income.frequency = income_request.frequency !== undefined ? income_request.frequency : income.frequency;

        await income.save();

        await db.pw_budget_table_income.destroy({ 
            where: { 
                date: { [Sequelize.Op.gt]: new Date() },
                income_id: income_id, 
                user_id: user_id 
            } 
        });

        let budget_data = group_by_date([{
            source: income_request.source,
            income_id: income_id,
            amount: income_request.amount,
            start_date: income_request.start_date,
            frequency: income_request.frequency
        }]);

        let budget_incomes = [];
        for (let date in budget_data) {
            if (new Date() > new Date(date)) {
                continue;
            }
            for (let inc of budget_data[date]) {
                let budget_income = await db.pw_budget_table_income.create({
                    date: date,
                    user_id: user_id,
                    income_id: income_id,
                    source: inc.source,
                    amount: inc.amount,
                    start_date: inc.start_date,
                    frequency: inc.frequency
                });
                budget_incomes.push(budget_income);
            }
        }

        return { success: true, message: "Income updated successfully", income: income };
    }

    async delete_income(user_id, income_id) {
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const income = await db.pw_income.findOne({ where: { id: income_id, user_id: user_id } });
        if (!income) {
            return { success: false, message: "Income not found or not owned by the user" };
        }

        await db.pw_income.destroy({ where: { id: income_id } });

        await db.pw_budget_table_income.destroy({ 
            where: { 
                date: { [Sequelize.Op.gt]: new Date() },
                income_id: income_id, 
                user_id: user_id 
            } 
        });

        return { success: true, message: "Income deleted successfully" };
    }

}

module.exports = IncomeService;
