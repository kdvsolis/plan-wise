import api_fetch from "../utils/api_fetch";
import { storageHandler } from '../utils/storage_handler';
const expense = {
    create: async function(body: any) {
        return (await api_fetch.post("/api/expense", {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "", body)).json();
    },
    get: async function(id: any) {
        return (await api_fetch.get(`/api/expenses/${id}`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "")).json();
    },
    getAll: async function() {
        return (await api_fetch.get("/api/expenses", {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "")).json();
    },
    update: async function(id: any, body: any) {
        return (await api_fetch.put(`/api/expenses/${id}`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "", body)).json();
    },
    delete: async function(id: any) {
        // @ts-expect-error TS(2554): Expected 5 arguments, but got 4.
        return (await api_fetch.delete(`/api/expenses/${id}`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "")).json();
    },
};
export default expense;