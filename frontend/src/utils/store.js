import account from '../services/account-service';
import { storageHandler } from '../utils/storage_handler';
import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            token: ''
        }
    },
    mutations: {
        setToken(state, payload) {
            state.token = payload;
        }
    },
    actions: {
        login({
            commit
        }, payload) {
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
                    return Promise.resolve(response);
                });
        }
    },
    getters: {
        isLoggedIn(state) {
            return !!state.token;
        }
    }
});

export default store;