const Sequelize = require("sequelize");
const db = require('./db.service');
const { group_by_date } = require('../util/date_data_generator');

class ExpenseService {
    constructor() {
        // This is intentional
    }

    async create_expense(user_id, expenses) {
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        let expense = await db.pw_expenses.create({
            user_id: user_id,
            expenses: expenses.expenses,
            amount: expenses.amount,
            start_date: expenses.start_date,
            frequency: expenses.frequency,
            category: expenses.category
        });

        let expense_id = expense.id;

        let budget_data = group_by_date([{
            expenses: expenses.expenses,
            expense_id: expense_id,
            amount: expenses.amount,
            start_date: expenses.start_date,
            frequency: expenses.frequency,
            category: expenses.category
        }]);

        let budget_expenses = [];
        for (let date in budget_data) {
            for (let exp of budget_data[date]) {
                let budget_expense = await db.pw_budget_table_expense.create({
                    date: date,
                    user_id: user_id,
                    expense_id: expense_id,
                    expenses: exp.expenses,
                    amount: exp.amount,
                    start_date: exp.start_date,
                    category: exp.category,
                    frequency: exp.frequency
                });
                budget_expenses.push(budget_expense);
            }
        }

        return { success: true, message: "Expense created successfully", expense: expense };
    }

    async get_expense(user_id, expense_id) {
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const expense = await db.pw_expenses.findOne({ where: { id: expense_id, user_id: user_id } });
        if (!expense) {
            return { success: false, message: "Expense not found or not owned by the user" };
        }

        return { success: true, message: "Expense retrieved successfully", expense: expense };
    }

    async get_expenses_by_user(user_id) {
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const expenses = await db.pw_expenses.findAll({ where: { user_id: user_id }, order: [['start_date', 'ASC']] });
        if (!expenses) {
            return { success: false, message: "Expense not found or not owned by the user" };
        }

        return { success: true, message: "Expense retrieved successfully", expense: expenses };
    }

    async update_expense(user_id, expense_id, expense_request) {
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        let expense = await db.pw_expenses.findOne({ where: { id: expense_id, user_id: user_id } });
        if (!expense) {
            return { success: false, message: "Expense not found or not owned by the user" };
        }

        expense.expenses = expense_request.expenses !== undefined ? expense_request.expenses : expense.expenses;
        expense.amount = expense_request.amount !== undefined ? expense_request.amount : expense.amount;
        expense.start_date = expense_request.start_date !== undefined ? expense_request.start_date : expense.start_date;
        expense.frequency = expense_request.frequency !== undefined ? expense_request.frequency : expense.frequency;
        expense.category = expense_request.category !== undefined ? expense_request.category : expense.category;
    
        await expense.save();
        
        await db.pw_budget_table_expense.destroy({ 
            where: { 
                date: { [Sequelize.Op.gt]: new Date() },
                expense_id: expense_id, 
                user_id: user_id 
            } 
        });

        let budget_data = group_by_date([{
            expenses: expense_request.expenses,
            expense_id: expense_id,
            amount: expense_request.amount,
            start_date: expense_request.start_date,
            frequency: expense_request.frequency,
            category: expense_request.category
        }]);

        let budget_expenses = [];
        for (let date in budget_data) {
            for (let exp of budget_data[date]) {
                let budget_expense = await db.pw_budget_table_expense.create({
                    date: date,
                    user_id: user_id,
                    expense_id: expense_id,
                    expenses: exp.expenses,
                    amount: exp.amount,
                    start_date: exp.start_date,
                    category: exp.category,
                    frequency: exp.frequency
                });
                budget_expenses.push(budget_expense);
            }
        }

        return { success: true, message: "Expense updated successfully", expense: expense };
    }

    async delete_expense(user_id, expense_id) {
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const expense = await db.pw_expenses.findOne({ where: { id: expense_id, user_id: user_id } });
        if (!expense) {
            return { success: false, message: "Expense not found or not owned by the user" };
        }

        await db.pw_expenses.destroy({ where: { id: expense_id } });

        await db.pw_budget_table_expense.destroy({ 
            where: { 
                date: { [Sequelize.Op.gt]: new Date() },
                expense_id: expense_id, 
                user_id: user_id 
            } 
        });

        return { success: true, message: "Expense deleted successfully" };
    }

}

module.exports = ExpenseService;
