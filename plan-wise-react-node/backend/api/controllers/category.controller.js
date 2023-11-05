const CategoryService = require('../../services/category.service');

class CategoryController {
    constructor() {
        this.categoryService = new CategoryService();
    }

    async create_category(req, res) {
        const result = await this.categoryService.create_category(req.user_id, req.body.category_name);
        if (result.message === "Category created successfully") {
            res.status(200).send(result);
        } else {
            res.status(400).send(result);
        }
    }

    async get_categories_by_user(req, res) {
        const result = await this.categoryService.get_categories_by_user(req.user_id);
        if (result.message === "Category retrieved successfully") {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    async get_category(req, res) {
        const result = await this.categoryService.get_category(req.user_id, req.params.category_id);
        if (result.message === "Category retrieved successfully") {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    async update_category(req, res) {
        const result = await this.categoryService.update_category(req.user_id, req.params.category_id, req.body.category_name);
        if (result.message === "Category updated successfully") {
            res.status(200).send(result);
        } else {
            res.status(result.message === "Category not found or not owned by the user" ? 404 : 400).send(result);
        }
    }

    async delete_category(req, res) {
        const result = await this.categoryService.delete_category(req.user_id, req.params.category_id);
        if (result.message === "Category deleted successfully") {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }
}

module.exports = new CategoryController();
