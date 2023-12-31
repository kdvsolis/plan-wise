import api_fetch from "../utils/api_fetch";
import { storageHandler } from '../utils/storage_handler';
const note = {
    create: async function(body) {
        return (await api_fetch.post("/api/notes", {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "", body)).json();
    },
    get: async function(id) {
        return (await api_fetch.get(`/api/notes/${id}`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "")).json();
    },
    getByDate: async function(date) {
        return (await api_fetch.get(`/api/notes?date=${date}`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "")).json();
    },
    updateByDate: async function(date, body) {
        return (await api_fetch.put(`/api/notes?date=${date}`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "", body)).json();
    },
    delete: async function(id) {
        return (await api_fetch.delete(`/api/notes/${id}`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "")).json();
    },
};
export default note;
