const express = require('express');
const categoryController = require('../api/controllers/category.controller');
const { validateToken } = require('../middlewares/validate-access-token.middleware');

const apiCategory = express.Router();

apiCategory.post('/categories', validateToken, (req, res) => categoryController.create_category(req, res));
apiCategory.get('/categories', validateToken, (req, res) => categoryController.get_categories_by_user(req, res));
apiCategory.get('/categories/:category_id', validateToken, (req, res) => categoryController.get_category(req, res));
apiCategory.put('/categories/:category_id', validateToken, (req, res) => categoryController.update_category(req, res));
apiCategory.delete('/categories/:category_id', validateToken, (req, res) => categoryController.delete_category(req, res));

module.exports = apiCategory;
