const express = require('express');
const userController = require('../api/controllers/user.controller');
const { validateToken } = require('../middlewares/validate-access-token.middleware');

const apiUser = express.Router();

apiUser.post('/register', (req, res) => userController.register(req, res));
apiUser.post('/login', (req, res) => userController.login(req, res));
apiUser.get('/user', validateToken, (req, res) => userController.get_user(req, res));
apiUser.put('/user', validateToken, (req, res) => userController.update_user(req, res));

module.exports = apiUser;
