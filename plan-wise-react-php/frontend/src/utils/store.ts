import account from '../services/account-service';
import { storageHandler } from '../utils/storage_handler';
// @ts-expect-error TS(2307): Cannot find module 'vuex' or its corresponding typ... Remove this comment to see the full error message
import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            token: ''
        }
    },
    mutations: {
        setToken(state: any, payload: any) {
            state.token = payload;
        }
    },
    actions: {
        login({
            commit
        }: any, payload: any) {
            return account.login(payload)
                .then(response => {
                    if (response.success) {
                        storageHandler.localStorageSet('token', response.token);
                        commit('setToken', response.token);
                        return Promise.resolve(response);
                    } else {
                        return Promise.resolve(response);
                    }
                })
                .catch(error => {
                    // @ts-expect-error TS(2552): Cannot find name 'response'. Did you mean 'Respons... Remove this comment to see the full error message
                    return Promise.resolve(response);
                });
        }
    },
    getters: {
        isLoggedIn(state: any) {
            return !!state.token;
        }
    }
});

export default store;