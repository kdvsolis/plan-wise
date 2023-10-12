<template>
    <!-- <div class="container d-flex align-items-center justify-content-center">
        <form class="col-md-6 mx-auto">
            <h1>Registration</h1>
            <div class="form-group">
                <label for="name">Name</label>
                <input
                type="text"
                id="name"
                v-model="name"
                required
                class="form-control"
                />
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input
                type="email"
                id="email"
                v-model="email"
                required
                class="form-control"
                />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input
                type="password"
                id="password"
                v-model="password"
                required
                class="form-control"
                />
            </div>
            <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                required
                class="form-control"
                />
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block mt-3">
                Register
                </button>
            </div>
        </form>
    </div> -->
      <div class="container w-container">
    <div class="form-wrapper">
      <h1>Sign Up</h1>
      <div class="w-form">
        <form id="wf-form-signup" @submit.prevent="submitForm">
            <div>
                <div>
                    <label for="signup-name">First Name</label>
                    <input 
                        type="text"
                        class="text-field-3 w-input"
                        maxlength="256"
                        name="signup-name"
                        data-name="signup-name"
                        placeholder="e.g. Howard"
                        id="signup-name"
                        v-model="name"
                        data-ms-member="first-name">
                </div>
            </div>
            <div class="text-field-wrapper">
                <label for="signup-email">Email</label>
                <input 
                    type="email" 
                    class="text-field-4 w-input" 
                    maxlength="256" 
                    name="signup-email" 
                    placeholder="e.g. howard.thurman@gmail.com"
                    v-model="email"
                    required
                >
            </div>
            <div>
                <label for="signup-password">Password</label>
                <input 
                    type="password" 
                    class="text-field-5 w-input" 
                    maxlength="256" 
                    name="signup-password" 
                    id="password"
                    v-model="password"
                    required
                >
            </div>
            <div>
                <label for="signup-password">Confirm Password</label>
                <input 
                    type="password" 
                    class="text-field-5 w-input" 
                    maxlength="256" 
                    name="signup-password" 
                    id="confirm-password"
                    v-model="confirmPassword"
                    required
                >
            </div>
            <button class="uui-button-4 button-width w-button">
                Register
            </button>
        </form>
        <div class="w-form-done">
          <div>Thank you! Your email has been registered. Go to login page to sign in</div>
        </div>
        <div class="w-form-fail">
          <div>Oops! Something went wrong while submitting the form.</div>
        </div>
      </div>
      <div>
        <div>Already have an account? <a href="/login">Log in</a>
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
import account from '../services/account-service';
export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    },
    mount(){
        document.title = "Plan Wise - Register";
    },
    methods: {
        submitForm() {
            if(this.password === this.confirmPassword){
                account.register({
                    name: this.name,
                    username: this.email,
                    password: this.password,
                }).then(response => {
                    if(response.success){
                        document.querySelector('.w-form-fail').style.display = "none";
                        document.querySelector('.w-form-done').style.display = "block";
                    }
                }).catch(error => {
                    console.log(error)
                    document.querySelector('.w-form-done').style.display = "none";
                    document.querySelector('.w-form-fail').style.display = "block";
                });
            } else {
                document.querySelector('.w-form-done').style.display = "none";
                document.querySelector('.w-form-fail').style.display = "block";
            }
        
        }
    }
}
</script>