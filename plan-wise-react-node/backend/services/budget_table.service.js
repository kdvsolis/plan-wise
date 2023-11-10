"use strict"

const db = require('./db.service');
const { Op } = require('sequelize');

class BudgetService {
    constructor() {
        //This is intentional
    }

    async get_budgets_in_date_range(user_id, start_date_str){
        const earliest_date = await db.pw_budget_table_income.min('date');
        const start_date = start_date_str ? new Date(start_date_str) : new Date(earliest_date);

        const end_date = new Date(start_date.getFullYear(), start_date.getMonth() + 1, 0);
        const incomes_in_range = await db.pw_budget_table_income.findAll({ 
            where: { 
                date: { [Op.between]: [start_date, end_date] },
                user_id: user_id 
            },
            order: [['date', 'ASC']]
        });

        const expenses_in_range = await db.pw_budget_table_expense.findAll({ 
            where: { 
                date: { [Op.between]: [start_date, end_date] },
                user_id: user_id 
            },
            order: [['date', 'ASC']]
        });

        let formatted_data = {};
        for (let item of incomes_in_range) {
            if (!formatted_data[item.date]) {
                formatted_data[item.date] = { "user_id": user_id, "income": [], "expense": [], "notes": "" };
            }
            item.amount = parseFloat(item.amount);
            formatted_data[item.date]["income"].push(item);
        }

        for (let item of expenses_in_range) {
            if (!formatted_data[item.date]) {
                formatted_data[item.date] = { "user_id": user_id, "income": [], "expense": [], "notes": "" };
            }
            item.amount = parseFloat(item.amount);
            formatted_data[item.date]["expense"].push(item);
        }

        return { "success": true, "message": "Retrieved budgets in date range", "budgets": formatted_data };
    }

    async update_income(income){
        const record = await db.pw_budget_table_income.findOne({ where: { id: income.id } });
        if (!record) {
            return null;
        }

        for (let key in income) {
            record[key] = income[key];
        }
        await record.save();
        return record;
    }

    async update_expense(expense){
        const record = await db.pw_budget_table_expense.findOne({ where: { id: expense.id } });
        if (!record) {
            return null;
        }

        for (let key in expense) {
            record[key] = expense[key];
        }
        await record.save();
        return record;
    }

    async create_note(user_id, date, notes){
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { "success": false, "message": "User not found" };
        }

        const note = await db.pw_notes.create({ user_id: user_id, date: date, notes: notes });
        return { "success": true, "message": "Note created successfully", "note": note };
    }

    async get_note(user_id, note_id){
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { "success": false, "message": "User not found" };
        }

        const note = await db.pw_notes.findOne({ where: { id: note_id, user_id: user_id } });
        if (!note) {
            return { "success": false, "message": "Note not found or not owned by the user" };
        }

        return { "success": true, "message": "Note retrieved successfully", "note": note };
    }

    async get_notes_by_date(user_id, date){
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { "success": false, "message": "User not found" };
        }

        const notes = await db.pw_notes.findOne({ where: { user_id: user_id, date: date } });
        if (!notes) {
            return { "success": false, "message": "Notes not found or not owned by the user" };
        }

        return { "success": true, "message": "Notes retrieved successfully", "notes": notes };
    }

    async update_note(user_id, note_id, new_notes){
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { "success": false, "message": "User not found" };
        }

        const note = await db.pw_notes.findOne({ where: { id: note_id, user_id: user_id } });
        if (!note) {
            return { "success": false, "message": "Note not found or not owned by the user" };
        }

        note.notes = new_notes;
        await note.save();
        return { "success": true, "message": "Note updated successfully", "note": note };
    }

    async update_notes_by_date(user_id, date, new_notes){
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { "success": false, "message": "User not found" };
        }

        const notes = await db.pw_notes.findAll({ where: { user_id: user_id, date: date } });
        if (!notes) {
            return { "success": false, "message": "Notes not found or not owned by the user" };
        }

        for (let note of notes) {
            note.notes = new_notes;
            await note.save();
        }
        return { "success": True, "message": "Notes updated successfully", "notes": notes };
    }

    async delete_note(user_id, note_id){
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { "success": false, "message": "User not found" };
        }

        const note = await db.pw_notes.findOne({ where: { id: note_id, user_id: user_id } });
        if (!note) {
            return { "success": false, "message": "Note not found or not owned by the user" };
        }

        await note.destroy();
        return { "success": true, "message": "Note deleted successfully" };
    }
}

module.exports = BudgetService;
