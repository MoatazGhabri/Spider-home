<template>
    <div class="body">
    <div class="container_login">
         <div class="form-box login active">
            <div class="form">
                
                 <h1>Login</h1>
                 <div class="input-box">
                   <input type="email"
                           required
                           autocorrect="off"
                           autocapitalize="none"
                           v-focus="true"
                           :placeholder="$t('Your email')"
                           v-model="username"
                           name="_username"
                           class="form-control">
                           
                     <i class='bx bxs-user'></i>
                 </div>
                 <div class="input-box">
                   <input type="password"
                           :placeholder="$t('Password')"
                           name="_password"
                           v-model="password"
                           class="form-control">
                     <i class='bx bxs-lock-alt' ></i>
                 </div>

                 <transition name="fade">
            <div class="error session-expired"
                v-if="error === 'sessionExpired'">
                <strong>{{ $t('Your session has been expired.') }}</strong>
                {{ $t('Please log in again to proceed.') }}
            </div>
        </transition>
        <transition name="fade">
            <div class="error locked"
                v-if="error === 'locked'">
                <strong>{{ $t('Your account has been locked.') }}</strong>
                {{ $t('Please wait a moment before the next login attempt.') }}
            </div>
        </transition>
        <transition name="fade">
            <div class="error disabled"
                v-if="error === 'disabled'">
                <p><strong>{{ $t('Your account has not been confirmed yet.') }}</strong></p>
                <p>{{ $t('Please click the link we have sent you after the registration to proceed.') }}</p>
                <p>
                    <resend-account-activation-link :username="username"></resend-account-activation-link>
                </p>
            </div>
        </transition>
        <transition name="fade">
            <router-link to="/forgotten-password"
                class="error"
                v-if="error == 'error'">
                <strong>{{ $t('Forgot your password?') }}</strong>
                {{ $t('Don’t worry, you can always reset your password via email. Click here to do so.') }}
            </router-link>
        </transition>
                 <div class="forgot-link">
                    <a @click="showForgotPasswordModal = true">Forgot Password?</a>
                </div>
                 <button type="submit"
                       class="btnn btn-blue btn-lg"
                       @click="$emit('input', {username: username, password: password})"
                       :disabled="authenticating">
                       <span v-if="!authenticating">
                           <span v-if="submitButtonText">{{ submitButtonText }}</span>
                           <span v-else>{{ $t('Sign In') }}</span>
                       </span>
                       <button-loading-dots v-else></button-loading-dots>
                   </button>
                 
                </div>
         </div>

        

         <div class="toggle-box">
             <div class="toggle-panel toggle-left">
                 <img src="../assets/img/logospiderhome.png" alt="logo">
                 
                 <p>Don't have an account?</p>
                 <router-link to="/register">
                 <button type="button" class="btnn register-btn">Register</button>
                </router-link>
             </div>

             <div class="toggle-panel toggle-right">
                <img src="../assets/img/logospiderhome.png" alt="logo">
                 <p>Already have an account?</p>
                 
                 <button type="button" class="btnn login-btn">Login</button>
             </div>
         </div>
     </div>
     <div v-if="showForgotPasswordModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
                <form @submit.prevent="remind()">
                    <button type="button" @click="closeModal" class="btn-close">&times;</button>
                    <h2>{{ $t('Password Reset') }}</h2>
                    <div class="form-group form-group-lg">
                        <input autocomplete="off"
                            class="form-control"
                            required
                            v-focus="true"
                            v-model="email"
                            type="email"
                            :placeholder="$t('Enter your email address')">
                    </div>
                    <div class="form-group text-right">
                        <button type="submit"
                            class="btnn">
                            <span v-if="!loading">{{ $t('RESET') }}</span>
                            <button-loading-dots v-else></button-loading-dots>
                        </button>
                    </div>

                    <p v-if="sent"><strong>{{ $t('Check your email box') }}</strong></p>
                    <p v-else-if="sentProblem"><strong>{{ $t('Could not reset the password. Please try again later.') }}</strong></p>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import ButtonLoadingDots from "../common/gui/loaders/button-loading-dots.vue";
import {DateTime} from "luxon";
import {mapState} from "pinia";
import {useFrontendConfigStore} from "@/stores/frontend-config-store";

export default {
   props: ['authenticating', 'oauth', 'error', 'value', 'intitialUsername', 'submitButtonText'],
   components: { 
         ButtonLoadingDots, 
        },
   data() {
           return {
               username: '',
               password: '',
               showForgotPasswordModal: false,
               loading: false,
               email: '',
               sent: false,
               sentProblem: false,
               confirmPassword: '',
                timezone: DateTime.local().setZone("system").zoneName || 'Europe/Warsaw',
                isBusy: false,
                errorMessage: '',
                captchaToken: null,
                regulationsAgreed: false,
                resendActivationLinkOption: false,
                emailTouched: false,
                passwordTouched: false,
                passwordConfirmTouched: false,
                regulationsTouched: false,
                showPassword: false,

           };
       },
 mounted() {
   this.username = this.intitialUsername || '';

 },
 methods: {
        closeModal() {
            this.showForgotPasswordModal = false;
            // Reset the form state when closing
            this.email = '';
            this.sent = false;
            this.sentProblem = false;
            this.loading = false;
        },
        remind() {
                if (!this.loading) {
                    this.loading = true;
                    this.sent = this.sentProblem = false;
                    this.$http.patch('forgotten-password', {email: this.email}).then(() => {
                        this.email = '';
                        this.sent = true;
                    }).catch(() => this.sentProblem = true)
                        .finally(() => this.loading = false);
                }
            },
            checkCaptcha(recaptchaToken) {
                this.captchaToken = this.captchaEnabled ? recaptchaToken : null;
                this.submit();
            },
    },
 computed: {
    errorEmail() {
                return this.emailTouched && this.username.indexOf('@') === -1;
            },
            errorRegulations() {
                return this.regulationsTouched && !this.regulationsAgreed && this.regulationsAcceptRequired;
            },
            formIsValid() {
                return !this.errorEmail && !this.errorPassword && !this.errorPasswordConfirm && !this.errorRegulations;
            },
            ...mapState(useFrontendConfigStore, {frontendConfig: 'config'}),
            captchaEnabled() {
                return this.frontendConfig.recaptchaEnabled;
            },
            captchaSiteKey() {
                return this.frontendConfig.recaptchaSiteKey;
            },
            regulationsAcceptRequired() {
                return this.frontendConfig.regulationsAcceptRequired;
            },
       }
};
</script>
<style lang="scss">
 @import '../styles/mixins';
 @import '../styles/variables';
 .progress-container {
    width: 100%;
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    margin-top: 5px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    transition: width 0.3s ease-in-out;
    background: linear-gradient(to right, $supla-red, orange, yellow,$supla-green);
}

 .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    position: relative;
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 300px;
    justify-content: space-between;
    z-index: 9999;
    
    .form-control {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    
    .btnn {
        margin-top: 10px;
    }
}

.btn-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
}
.body{
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.container_login{
   position: relative;
   width: 850px;
   height: 450px;
   background: #fff;
   margin: 20px;
   border-radius: 30px;
   box-shadow: 0 0 30px rgba(0, 0, 0, .2);
   overflow: hidden;
}

   .container_login h1{
       font-size: 36px;
       margin: -10px 0;
   }

   .container_login p{
       font-size: 14.5px;
       margin: 15px 0;
   }

.form{ width: 100%; }

.form-box{
   position: absolute;
   right: 0;
   width: 50%;
   height: 100%;
   background: #fff;
   display: flex;
   align-items: center;
   color: #333;
   text-align: center;
   padding: 40px;
   z-index: 1;
   transition: .6s ease-in-out 1.2s, visibility 0s 1s;
}

   .container_login.active .form-box{ right: 50%; }

   .form-box.register{ visibility: hidden; }
       .container_login.active .form-box.register{ visibility: visible; }

.input-box{
   position: relative;
   margin: 30px 0;
}

   .input-box input{
       width: 100%;
       padding: 13px 50px 13px 20px;
       background: #eee;
       border-radius: 8px;
       border: none;
       outline: none;
       font-size: 16px;
       color: #333;
       font-weight: 500;
   }

       .input-box input::placeholder{
           color: #888;
           font-weight: 400;
       }
   
   .input-box i{
       position: absolute;
       right: 20px;
       top: 50%;
       transform: translateY(-50%);
       font-size: 20px;
   }

.forgot-link{ margin: -15px 0 15px; }
   .forgot-link a{
       font-size: 14.5px;
       color: #333;
       cursor: pointer;
   }
img{
    width: 170px;
    height: 170px;
}
.btnn{
   width: 100%;
   height: 48px;
   background: $supla-green;
   border-radius: 8px;
   box-shadow: 0 0 10px rgba(0, 0, 0, .1);
   border: none;
   cursor: pointer;
   font-size: 16px;
   color: #fff;
   font-weight: 600;
}

.social-icons{
   display: flex;
   justify-content: center;
}

   .social-icons a{
       display: inline-flex;
       padding: 10px;
       border: 2px solid #ccc;
       border-radius: 8px;
       font-size: 24px;
       color: #333;
       margin: 0 8px;
   }

.toggle-box{
   position: absolute;
   width: 100%;
   height: 100%;
}

   .toggle-box::before{
       content: '';
       position: absolute;
       left: -250%;
       width: 300%;
       height: 100%;
       background: $supla-green;
       /* border: 2px solid red; */
       border-radius: 150px;
       z-index: 2;
       transition: 1.8s ease-in-out;
   }

       .container_login.active .toggle-box::before{ left: 50%; }

.toggle-panel{
   position: absolute;
   width: 50%;
   height: 100%;
   /* background: seagreen; */
   color: #fff;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   z-index: 2;
   transition: .6s ease-in-out;
}

   .toggle-panel.toggle-left{ 
       left: 0;
       transition-delay: 1.2s; 
   }
       .container_login.active .toggle-panel.toggle-left{
           left: -50%;
           transition-delay: .6s;
       }

   .toggle-panel.toggle-right{ 
       right: -50%;
       transition-delay: .6s;
   }
       .container_login.active .toggle-panel.toggle-right{
           right: 0;
           transition-delay: 1.2s;
       }

   .toggle-panel p{ margin-bottom: 20px; }

   .toggle-panel .btnn{
       width: 160px;
       height: 46px;
       background: transparent;
       border: 2px solid #fff;
       box-shadow: none;
   }

@media screen and (max-width: 650px){
   .container_login{ height: calc(100vh - 40px); }
   img{
    width: 100px;
    height: 100px;
}
   .form-box{
       bottom: 0;
       width: 100%;
       height: 70%;
   }

       .container_login.active .form-box{
           right: 0;
           bottom: 30%;
       }

   .toggle-box::before{
       left: 0;
       top: -270%;
       width: 100%;
       height: 300%;
       border-radius: 20vw;
   }

       .container_login.active .toggle-box::before{
           left: 0;
           top: 70%;
       }

       .container_login.active .toggle-panel.toggle-left{
           left: 0;
           top: -30%;
       }

   .toggle-panel{ 
       width: 100%;
       height: 30%;
   }
       .toggle-panel.toggle-left{ top: 0; }
       .toggle-panel.toggle-right{
           right: 0;
           bottom: -30%;
       }

           .container_login.active .toggle-panel.toggle-right{ bottom: 0; }
}

@media screen and (max-width: 400px){
   .form-box { padding: 20px; }
   img{
    width: 70px;
    height: 70px;
}
   .toggle-panel h1{font-size: 30px; }
}

.error {
            display: inline-block;
            background: $supla-yellow;
            padding: 12px 20px;
            margin-top: 15px;
            border-radius: 3px;
            color: $supla-black;
            margin-bottom: 20px;

            p a {
                color: darken($supla-green, 10%);
            }

            &.locked {
                background: $supla-red;
                color: $supla-white;
            }
        }

    i {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    color: #333;

    &.bx-show,
    &.bx-hide {
      right: 50px; 
      cursor: pointer;
    }

    &.bxs-lock-alt {
      right: 20px; // icône cadenas
    }
  }
    
</style>