<template>
    <div class="container w-container">
        <div class="form-wrapper">
            <div class="w-form">
            <form id="wf-form-signup" @submit.prevent="submitForm">
                <h1 class="heading">Login</h1>
                <div>
                <label for="email" class="field-label-2">Email</label>
                <input 
                    type="email" 
                    class="text-field w-input" 
                    maxlength="256" 
                    name="email" 
                    data-name="email" 
                    placeholder="e.g. howard.thurman@gmail.com" 
                    id="username"
                    v-model="username"
                    required
                />
                </div>
                <div>
                <label for="password-2" class="field-label">Password</label>
                <input 
                    type="password" 
                    class="text-field-2 w-input" 
                    maxlength="256" 
                    placeholder="" 
                    id="password-2" 
                    data-ms-member="password"
                    v-model="password"
                    required
                />
                </div>
                <div class="relative w-clearfix">
                    <a href="#" class="forgot-password-link">Forgot password</a>
                </div>
                <button class="uui-button-4 button-width w-button">Login</button>
                <div>
                    <b-alert variant="danger" dismissible :show="error" @dismissed="error = ''">
                        {{ error }}
                    </b-alert>
                </div>
            </form>
            </div>
            <div>
            <div class="text-block-2">Need an account? <a href="/registration">Sign up</a>
            </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '../assets/components.css';
@import '../assets/budgeting-app.css';
</style>

<script>
//import account from '../services/account-service';
import { mapActions, mapGetters } from 'vuex';


export default {
    data() {
        return {
                username: '',
                password: '',
                error: ''
            }
    },
    mount(){
        document.title = "Plan Wise - Login";
    },
    methods: {
        ...mapActions(['login']),
        async submitForm() {
            let response = await this.login({
                username: this.username,
                password: this.password
            });
            if(response.success){

            } else {
                this.error = response.message;
            }
        }
    },
    computed: {
        ...mapGetters(['isLoggedIn'])
    },
    watch: {
        isLoggedIn(value) {
            if (value) {
                this.$router.push({name: 'Home'});
            }
        }
    }

}
</script>