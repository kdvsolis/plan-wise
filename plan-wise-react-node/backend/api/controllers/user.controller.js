const AccountService = require('../../services/account.service');

class UserController {
    constructor() {
        this.authService = new AccountService();
    }

    async register(req, res) {
        const result = await this.authService.register(req.body.name, req.body.username, req.body.password);
        if (result.message === "Registration successful") {
            res.status(200).send({ success: true, message: result.message });
        } else {
            res.status(400).send(result);
        }
    }

    async login(req, res) {
        const result = await this.authService.login(req.body.username, req.body.password);
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(401).send(result);
        }
    }

    async get_user(req, res) {
        const result = await this.authService.get_user(req.user_id);
        if (result.message === "User updated successfully") {
            res.status(200).send(result);
        } else {
            res.status(result.message === "User not found" ? 404 : 400).send(result);
        }
    }

    async update_user(req, res) {
        const result = await this.authService.update_user(req.user_id, req.body);
        if (result.message === "User updated successfully") {
            res.status(200).send(result);
        } else {
            res.status(result.message === "User not found" ? 404 : 400).send(result);
        }
    }
}

module.exports = new UserController();
