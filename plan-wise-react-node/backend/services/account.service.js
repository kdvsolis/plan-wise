"use strict"

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db.service');

class Account {

    constructor() {
        //This is intentional
    }

    async register(name, email, password){
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const existingUser = await db.pw_users.findOne({ where: { email: email } });
        if (existingUser) {
            return { "message": "Registration failed: Username already exists" };
        }

        try {
            const user = await db.pw_users.create({ name: name, email: email, password: hashedPassword });
            return { "message": "Registration successful" };
        } catch (e) {
            return { "message": `Registration failed: ${e}` };
        }
    }

    async login(email, password){
        const user = await db.pw_users.findOne({ where: { email: email } });
        if (user && await bcrypt.compare(password, user.password)) {
            const payload = {
                "user_id": user.id,
                "username": user.email,
                "exp": Math.floor(Date.now() / 1000) + (60 * 60)
            };
            const token = jwt.sign(payload, process.env.SECRET_KEY, { algorithm: "HS256" });
            return {
                "success": true,
                "token": token
            };
        } else {
            return {
                "success": false,
                "message": "Invalid username or password"
            };
        }
    }

    async get_user(user_id){
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { "success": false, "message": "User not found" };
        }
        user.balance = parseFloat(user.balance);
        return { "success": true, "message": "User updated successfully", "user": user };
    }

    async update_user(user_id, user_request){
        const user = await db.pw_users.findOne({ where: { id: user_id } });
        if (!user) {
            return { "success": false, "message": "User not found" };
        }

        if (user_request.password) {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(user_request.password, salt);
        }

        user.email = user_request.email ? user_request.email : user.email;
        user.name = user_request.name ? user_request.name : user.name;
        user.balance = user_request.balance ? user_request.balance : user.balance;

        await user.save();
        return { "success": true, "message": "User updated successfully", "user": user };
    }
}

module.exports = Account;
