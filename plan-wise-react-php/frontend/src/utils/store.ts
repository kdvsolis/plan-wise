import account from '../services/account-service';
import { storageHandler } from './storage_handler';
import { createStore } from 'vuex';

const store = createStore({
    state(): { token: any } {
        return {
            token: ''
        };
    },
    mutations: {
        setToken(state: any, payload: any): void {
            state.token = payload;
        }
    },
    actions: {
        login({ commit }: any, payload: any): Promise<any> {
            return account.login(payload)
                .then((response: any) => {
                    if (response.success) {
                        storageHandler.localStorageSet('token', response.token);
                        commit('setToken', response.token);
                        return Promise.resolve(response);
                    } else {
                        return Promise.resolve(response);
                    }
                })
                .catch((error: any) => {
                    return Promise.resolve(error);
                });
        }
    },
    getters: {
        isLoggedIn(state: any): boolean {
            return !!state.token;
        }
    }
});

export default store;
