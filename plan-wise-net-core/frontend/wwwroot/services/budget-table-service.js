import api_fetch from "/utils/api_fetch.js";
import { storageHandler } from '/utils/storage_handler.js';

const budget_table = {
    create: async function(body) {
        return (await api_fetch.post("/api/budgets", {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "", body)).json();
    },
    get: async function(id) {
        return (await api_fetch.get(`/api/budgets/${id}`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "")).json();
    },
    update: async function(id, body) {
        return (await api_fetch.put(`/api/budgets/${id}`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "", body)).json();
    },
    delete: async function(id) {
        return (await api_fetch.delete(`/api/budgets/${id}`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "")).json();
    },
    bulkCreate: async function(body) {
        return (await api_fetch.post("/api/bulk_create_budgets", {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "", body)).json();
    },
    getStartDates: async function() {
        return (await api_fetch.get(`/api/budgets_start_dates`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "")).json();
    },
    getBudgetsInDateRange: async function(start_date_str) {
        return (await api_fetch.get(`/api/get_budgets_in_date_range`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, start_date_str? {
            start_date_str: start_date_str
        } : {}, "")).json();
    },
    updateBudgets: async function(body) {
        return (await api_fetch.put(`/api/update_budgets`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "", body)).json();
    },
};

export default budget_table;