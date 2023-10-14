import api_fetch from "/utils/api_fetch.js";
import { storageHandler } from '/utils/storage_handler.js';
const account = {
    register: async function(body){
        return (await (api_fetch.post(`/api/register`, {}, {}, "", body))).json();
    },
    login: async function(body){
        return (await (api_fetch.post(`/api/login`, {}, {}, "", body))).json();
    },
    getUser: async function(body){
        return (await (api_fetch.get(`/api/user`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "", body))).json();
    },
    updateUser: async function(body){
        return (await (api_fetch.put(`/api/user`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "", body))).json();
    }
}
export default account;