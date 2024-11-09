import api_fetch  from "../utils/api_fetch"
import { storageHandler } from '../utils/storage_handler';
const account = {
    register: async function(body: any){
        return (await (api_fetch.post(`/api/register`, {}, {}, "", body))).json();
    },
    login: async function(body: any){
        return (await (api_fetch.post(`/api/login`, {}, {}, "", body))).json();
    },
    getUser: async function(body: any){
        return (await (api_fetch.get(`/api/user`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        // @ts-expect-error TS(2554): Expected 4 arguments, but got 5.
        }, {}, "", body))).json();
    },
    updateUser: async function(body: any){
        return (await (api_fetch.put(`/api/user`, {
            "Authorization": `Bearer ${storageHandler.localStorageGet('token')}`
        }, {}, "", body))).json();
    }
}
export default account;