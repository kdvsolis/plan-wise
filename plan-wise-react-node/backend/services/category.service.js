const Sequelize = require("sequelize");
const db = require('./db.service');

class CategoryService {
    constructor() {
        // This is intentional
    }

    async create_category(user_id, category_name) {
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        let category = await db.pw_categories.findOne({ where: { user_id: user_id, category_name: category_name } });
        if (category) {
            return { success: false, message: "Category name already exists" };
        }

        category = await db.pw_categories.create({ user_id: user_id, category_name: category_name });
        return { success: true, message: "Category created successfully", category: category };
    }

    async get_category(user_id, category_id) {
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const category = await db.pw_categories.findOne({ where: { id: category_id, user_id: user_id } });
        if (!category) {
            return { success: false, message: "Category not found or not owned by the user" };
        }

        return { success: true, message: "Category retrieved successfully", category: category };
    }

    async get_categories_by_user(user_id) {
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        let category_expenses = await db.pw_categories.findAll({ 
            where: { user_id: user_id },
            attributes: [
                'id', 
                'category_name', 
                [Sequelize.fn('sum', Sequelize.col('pw_budget_table_expenses.amount')), 'total_amount']
            ],
            include: [{
                model: db.pw_budget_table_expense,
                as: 'pw_budget_table_expenses',
                attributes: [],
            }],
            group: ['pw_categories.id', 'pw_categories.category_name', 'pw_budget_table_expenses.category']
        });

        if (!category_expenses) {
            return { success: false, message: "No categories found for the user" };
        }

        category_expenses = category_expenses.map(category => {
            return {
                id: category.id,
                category_name: category.category_name,
                average_monthly_expense: category.dataValues.total_amount / 12
            };
        });

        return { success: true, message: "Category retrieved successfully", category: category_expenses };
    }


    async update_category(user_id, category_id, new_category_name) {
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        let category = await db.pw_categories.findOne({ where: { id: category_id, user_id: user_id } });
        if (!category) {
            return { success: false, message: "Category not found or not owned by the user" };
        }

        category.category_name = new_category_name;
        await category.save();
        return { success: true, message: "Category updated successfully", category: category };
    }

    async delete_category(user_id, category_id) {
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const category = await db.pw_categories.findOne({ where: { id: category_id, user_id: user_id } });
        if (!category) {
            return { success: false, message: "Category not found or not owned by the user" };
        }

        await db.pw_expenses.update({ category: null }, { where: { category: category_id } });
        await db.pw_categories.destroy({ where: { id: category_id } });
        return { success: true, message: "Category deleted successfully" };
    }

}

module.exports = CategoryService;
