import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap";
import jwt_decode from "jwt-decode";


// Import the components you want to use as pages
import Login from './pages/Login.vue';
import Registration from './pages/Registration.vue';
import Home from './pages/Home.vue';
import Categories from './pages/Categories.vue';
import Expenses from './pages/Expenses.vue';
import Income from './pages/Income.vue';
import BudgetTable from './pages/BudgetTable.vue';
import BudgetCalendar from './pages/BudgetCalendar.vue';

import { storageHandler } from './utils/storage_handler';
import store from './utils/store';

// Create a router instance and define the routes
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', component: Login, name: 'Login' },
        { path: '/registration', component: Registration, name: 'Registration' },
        { path: '/', component: Home, name: 'Home', meta: { requireAuth: true } },
        { path: '/categories', component: Categories, name: 'Categories', meta: { requireAuth: true } },
        { path: '/expenses', component: Expenses, name: 'Expenses', meta: { requireAuth: true } },
        { path: '/income', component: Income, name: 'Income', meta: { requireAuth: true } },
        { path: '/budget-table', component: BudgetTable, name: 'BudgetTable', meta: { requireAuth: true } },
        { path: '/budget-calendar', component: BudgetCalendar, name: 'BudgetCalendar', meta: { requireAuth: true } }
    ]
})

router.beforeEach((to, from) => {
    const token = storageHandler.localStorageGet('token');
    if (to.meta.requireAuth) { 
        if (token) {
            let decoded = jwt_decode(token);
            let isNotExpired = decoded.exp && decoded.exp > Date.now()/1000;
            if(!isNotExpired){
                storageHandler.localStorageDelete('token');
                window.location.href = "/login"
            }
            return isNotExpired;
        } else {
            return {
                path: '/login'
            }
        }
    } else {
        if(to.name === 'Login' && token){
            return {
                path: '/'
            }
        }
        return true
    }
})

createApp(App).use(router).use(store).mount('#app')
