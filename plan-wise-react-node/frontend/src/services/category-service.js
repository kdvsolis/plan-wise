import api_fetch from "../utils/api_fetch";
import { storageHandler } from '../utils/storage_handler';
const category = {
    create: async function(body) {
        return (await api_fetch.post("/api/categories", {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "", body)).json();
    },
    get: async function(id) {
        return (await api_fetch.get(`/api/categories/${id}`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "")).json();
    },
    getAll: async function() {
        return (await api_fetch.get("/api/categories", {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "")).json();
    },
    update: async function(id, body) {
        return (await api_fetch.put(`/api/categories/${id}`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "", body)).json();
    },
    delete: async function(id) {
        return (await api_fetch.delete(`/api/categories/${id}`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "")).json();
    },
};
export default category;