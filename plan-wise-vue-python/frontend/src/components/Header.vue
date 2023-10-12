<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
        <a class="uui-navbar07_logo-link w-nav-brand" href="/">
            <div class="uui-logo_component">
            <div class="uui-logo_logomark">
                <img src="/images/logomark-bg.svg" loading="eager" height="" alt="Untitled UI logomark" class="uui-styleguide_logomark-bg">
                <div class="uui-logo_logomark-blur"></div>
                <div class="uui-logo_logomark-dot"></div>
            </div>
            <p class="paragraph">Budget</p>
            <img src="/images/untitled-ui-logo.png" loading="lazy" alt="Logo" class="uui-logo_image">
            </div>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul :style="ulStyle" class="navbar-nav me-auto mb-2 mb-lg-0" id="header-nav-list">
                  <li class="nav-item">
                      <a class="nav-link active" aria-current="page" href="/categories">Categories</a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="/expenses">Expenses</a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="/income">Income</a>
                  </li>
                  <li class="nav-item dropdown">
                      <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Budget </a>
                      <ul class="dropdown-menu">
                      <li>
                          <a class="uui-navbar07_dropdown-link" href="/budget-table">
                          <div class="uui-navbar07_icon-wrapper">
                              <div class="uui-icon-1x1-xsmall-2 w-embed">
                              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M20 19.5V16.5H7C5.34315 16.5 4 17.8431 4 19.5M8.8 22.5H16.8C17.9201 22.5 18.4802 22.5 18.908 22.282C19.2843 22.0903 19.5903 21.7843 19.782 21.408C20 20.9802 20 20.4201 20 19.3V5.7C20 4.57989 20 4.01984 19.782 3.59202C19.5903 3.21569 19.2843 2.90973 18.908 2.71799C18.4802 2.5 17.9201 2.5 16.8 2.5H8.8C7.11984 2.5 6.27976 2.5 5.63803 2.82698C5.07354 3.1146 4.6146 3.57354 4.32698 4.13803C4 4.77976 4 5.61984 4 7.3V17.7C4 19.3802 4 20.2202 4.32698 20.862C4.6146 21.4265 5.07354 21.8854 5.63803 22.173C6.27976 22.5 7.11984 22.5 8.8 22.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                              </svg>
                              </div>
                          </div>
                          <div class="uui-navbar07_item-right">
                              <div class="uui-navbar07_item-heading">Budget Table</div>
                              <div class="uui-text-size-small-2">View your budget in a table</div>
                          </div>
                          </a>
                      </li>
                      <li>
                          <a href="/budget-calendar" class="uui-navbar07_dropdown-link">
                          <div class="uui-navbar07_icon-wrapper">
                              <div class="uui-icon-1x1-xsmall-2 w-embed"><svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M4.5 22.5V17.5M4.5 7.5V2.5M2 5H7M2 20H7M13 3.5L11.2658 8.00886C10.9838 8.74209 10.8428 9.10871 10.6235 9.41709C10.4292 9.6904 10.1904 9.92919 9.91709 10.1235C9.60871 10.3428 9.24209 10.4838 8.50886 10.7658L4 12.5L8.50886 14.2342C9.24209 14.5162 9.60871 14.6572 9.91709 14.8765C10.1904 15.0708 10.4292 15.3096 10.6235 15.5829C10.8428 15.8913 10.9838 16.2579 11.2658 16.9911L13 21.5L14.7342 16.9911C15.0162 16.2579 15.1572 15.8913 15.3765 15.5829C15.5708 15.3096 15.8096 15.0708 16.0829 14.8765C16.3913 14.6572 16.7579 14.5162 17.4911 14.2342L22 12.5L17.4911 10.7658C16.7579 10.4838 16.3913 10.3428 16.0829 10.1235C15.8096 9.92919 15.5708 9.6904 15.3765 9.41709C15.1572 9.10871 15.0162 8.74209 14.7342 8.00886L13 3.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                              </svg></div>
                          </div>
                          <div class="uui-navbar07_item-right">
                              <div class="uui-navbar07_item-heading">Budget Calendar</div>
                              <div class="uui-text-size-small-2">View your budget in a calendar</div>
                          </div>
                          </a>
                      </li>
                      </ul>
                  </li>
              </ul>
            <div class="d-flex right-menu uui-navbar07_button-wrapper" v-if="!token" id="header-login-register">
                <a href="/login" class="uui-button-tertiary-gray">Log in</a>
                <a href="/registration" class="uui-button-4 w-inline-block">Sign up</a>
            </div>
            <div class="d-flex right-menu uui-navbar07_button-wrapper" v-if="token" id="header-login-logout">
                <button class="uui-button-4 w-inline-block" v-on:click="signOut">Sign out</button>
            </div>
        </div>
        </div>
    </nav>
</template>

<style scoped>
@media screen and (max-width: 991px) {
  #header-login-register{
    margin-top: 20px;
  }
}
</style>

<script>
import { storageHandler } from '../utils/storage_handler';
import { mapGetters } from 'vuex';

export default {
  name: "main-header",
  data() {
    return {
      token: storageHandler.localStorageGet('token')
    };
  },
  mounted() {
      this.$store.watch(
          (state) => {
              return state.token;
          },
          (newValue, oldValue) => {
            this.token = newValue;
          }
      );
  },
  computed: {
      ulStyle() {
          const mediaQuery = window.matchMedia('(max-width: 992px)').matches;
          if (this.token) {
              return {
                  visibility: 'visible'
              };
          }
          else {
              return mediaQuery? { 
                display: 'none',
                'margin-top': "10px"
              } : {
                  visibility: 'hidden'
              };
          }
      },
  },
  methods: {
    signOut() {
      storageHandler.localStorageDelete('token');
      this.$store.commit('setToken', null);
      this.$router.push('/login');
    }
  }
};
</script>


<style scoped>
.navbar {
  background-color: #FFFFFF !important;
  border-bottom: 1px solid #dee2e6;
  padding-left: 2rem;
  padding-right: 2rem;
}

.container-fluid {
  width: 100%;
  height: 100%;
  max-width: 80rem;
}

.w-nav-brand {
  position: relative;
  float: left;
  text-decoration: none;
  color: #333333;
}

.paragraph {
  margin-bottom: 0;
  margin-left: 5px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Oxygen, Fira Sans, Droid Sans, sans-serif;
  font-size: 20px;
  font-weight: 700;
}

.uui-logo_image {
  width: auto;
  height: 100%;
  flex: none;
  display: none;
}

.uui-logo_logotype {
  width: auto;
  height: 100%;
  flex: none;
}

.uui-logo_logomark-dot {
  z-index: 1;
  width: 50%;
  height: 50%;
  background-image: linear-gradient(26.5deg, #6941c6, #53389e);
  border-radius: 50%;
  position: relative;
}

.uui-logo_logomark-blur {
  z-index: 2;
  width: 100%;
  height: 50%;
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, .2);
  border-bottom-right-radius: .5rem;
  border-bottom-left-radius: .5rem;
  position: absolute;
  top: 50%;
  bottom: 0%;
  left: 0%;
  right: 0%;
  overflow: hidden;
}

.uui-styleguide_logomark-bg {
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  position: absolute;
  top: 0%;
  bottom: 0%;
  left: 0%;
  right: 0%;
}

.uui-logo_logomark {
  width: 2rem;
  height: 2rem;
  border: .1px solid #dae0e8;
  border-radius: .5rem;
  flex: none;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 1px rgba(16, 24, 40, .06), 0 1px 2px rgba(16, 24, 40, .1);
}

.uui-logo_component {
  width: auto;
  height: 2rem;
  flex-flow: row;
  align-items: center;
  display: flex;
}

.uui-navbar07_logo-link {
  padding-left: 0;
}

.nav-item{
  padding: .75rem 1rem;
}

.nav-item a {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Oxygen, Fira Sans, Droid Sans, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  transition: all .3s;
}

.uui-navbar07_dropdown-link {
  grid-column-gap: 1rem;
  grid-row-gap: 0px;
  border-radius: .5rem;
  grid-template-rows: auto;
  grid-template-columns: max-content 1fr;
  grid-auto-columns: 1fr;
  align-items: flex-start;
  padding: .75rem;
  text-decoration: none;
  transition: all .3s;
  display: grid;
}

.uui-navbar07_dropdown-link:hover {
  background-color: #f9fafb;
}

.uui-navbar07_item-heading {
  color: #101828;
  margin-top: 0;
  margin-bottom: .25rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Oxygen, Fira Sans, Droid Sans, sans-serif;
  font-weight: 600;
}

.uui-navbar07_item-right {
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-weight: 400;
  display: flex;
}

.uui-text-size-small-2 {
  color: #475467;
  letter-spacing: normal;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Oxygen, Fira Sans, Droid Sans, sans-serif;
  font-size: .875rem;
  line-height: 1.5;
}

.uui-icon-1x1-xsmall-2 {
  width: 1.5rem;
  height: 1.5rem;
}

.uui-navbar07_icon-wrapper {
  color: #7f56d9;
  flex: none;
}

.w-embed:before,
.w-embed:after {
  content: " ";
  display: table;
  grid-column-start: 1;
  grid-row-start: 1;
  grid-column-end: 2;
  grid-row-end: 2;
}

.w-embed:after {
  clear: both;
}

.uui-button-tertiary-gray {
  grid-column-gap: .5rem;
  color: #475467;
  white-space: nowrap;
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: .5rem;
  justify-content: center;
  align-items: center;
  padding: .625rem 1.125rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Oxygen, Fira Sans, Droid Sans, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  text-decoration: none;
  transition: all .3s;
  display: flex;
}

.uui-button-tertiary-gray:hover {
  color: #344054;
  background-color: #f9fafb;
}

.uui-button-4 {
  grid-column-gap: .5rem;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  background-color: #7f56d9;
  border: 1px solid #7f56d9;
  border-radius: .5rem;
  justify-content: center;
  align-items: center;
  padding: .625rem 1.125rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Oxygen, Fira Sans, Droid Sans, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  text-decoration: none;
  transition: all .3s;
  display: flex;
  box-shadow: 0 1px 2px rgba(16, 24, 40, .05);
}

.dropdown-menu.show {
  min-width: 300px;
}

.w-inline-block {
  max-width: 100%;
  display: inline-block;
}

.uui-button-4:hover {
  background-color: #6941c6;
  border-color: #6941c6;
}

.uui-button-4:focus {
  background-color: #7f56d9;
  box-shadow: 0 1px 2px rgba(16, 24, 40, .05), 0 0 0 4px #f4ebff;
}

.right-menu {
  column-gap: 10px;
}

.uui-navbar07_button-wrapper {
  grid-column-gap: .75rem;
  grid-row-gap: .75rem;
  align-items: center;
  display: flex;
}

@media screen and (max-width: 991px) {
  .uui-button-4 {
    font-size: 1rem;
  }

  .uui-button-4:hover {
    background-color: #7f56d9;
    border-color: #7f56d9;
  }

  .uui-button-tertiary-gray:hover {
    color: #475467;
    background-color: rgba(0, 0, 0, 0);
  }
  
  .uui-navbar07_button-wrapper {
    flex-direction: column-reverse;
    align-items: stretch;
    display: flex;
  }
}

@media screen and (max-width: 767px) {
  .w-nav[data-collapse="small"] .w-nav-menu {
    display: none;
  }
  .w-nav[data-collapse="small"] .w-nav-button {
    display: block;
  }
  .w-nav-brand {
    padding-left: 10px;
  }
  .dropdown-menu.show {
    min-width: 250px;
  }
}

</style>
