<template>
    <div class="body">
    <div class="container_login active">
         
        
         <div class="form-box register">
      
            <form @submit.prevent="submit()">
                <h1>Register</h1>
            <input type="hidden"
                name="timezone"
                :value="timezone">
            <div :class="['form-group', {'has-error': errorEmail}]">
                <label for="email"></label>
                <input type="email"
                    id="email"
                    class="form-control"
                    autocorrect="off"
                    v-focus="true"
                    autocapitalize="none"
                    @blur="emailTouched = true"
                    :placeholder="$t('Enter your email address')"
                    v-model="username">
                <div class="help-block for-error-only" v-if="errorEmail">
                    {{ $t('Please enter a valid email address') }}
                </div>
            </div>
            <div :class="['form-group', {'has-error': passwordTouched && errorPassword}]">
                <div class="input-box password-input">
  <input :type="showPassword ? 'text' : 'password'"
         @blur="passwordTouched = true"
         id="password"
         class="form-control"
         :placeholder="$t('Enter strong password')"
         v-model="password" />

  <i :class="showPassword ? 'bx bx-show' : 'bx bx-hide'"
     class="toggle-password"
     @click="showPassword = !showPassword"></i>
</div>

                <div class="help-block for-error-only" v-if="passwordTouched && errorPassword">
                    {{ $t('The password should be 8 or more characters.') }}
                </div> 
                <div class="help-block hidden-xs">
    <div class="progress-container">
        <div class="progress-bar" :style="{ width: passwordStrength + '%', backgroundColor: getPasswordStrengthColor() }"></div>
    </div>
    <!-- <div class="strength-text">{{ getPasswordStrengthText() }}</div> -->
</div>

            </div>
            <div :class="['form-group', {'has-error': errorPasswordConfirm}]">
                <input type="password"
                    id="password-confirm"
                    @blur="passwordConfirmTouched = true"
                    class="form-control"
                    :placeholder="$t('Repeat password') "
                    v-model="confirmPassword">
                <div class="help-block for-error-only" v-if="errorPasswordConfirm">
                    {{ $t('The password and its confirm are not the same.') }}
                </div>
            </div>

            <div :class="['form-group', {'has-error': errorRegulations}]">
                <regulations-checkbox v-model="regulationsAgreed"
                    @input="regulationsTouched = true"
                    v-if="regulationsAcceptRequired"/>
                <div class="help-block for-error-only" v-if="errorRegulations">
                    {{ $t('You must accept the regulations to proceed.') }}
                </div>
            </div>
            <transition-expand>
                <div class="alert error"
                    v-if="errorMessage">
                    <p>{{ errorMessage }}</p>
                    <p v-if="resendActivationLinkOption" class="activation-link">
                        <resend-account-activation-link :username="username"></resend-account-activation-link>
                    </p>
                </div>
            </transition-expand>

            <transition-expand>
                <div class="alert success" v-if="successMessage">
                    <p>{{ successMessage }}</p>
                </div>
            </transition-expand>

            <div v-if="captchaEnabled">
                <invisible-recaptcha
                    :sitekey="captchaSiteKey"
                    :callback="checkCaptcha"
                    id="registerRecaptcha"
                    :disabled="isBusy"
                    :form-valid="formIsValid">
                    <template>
                        <span v-if="!isBusy">
                            {{ $t('Create an account') }}
                        </span>
                        <button-loading-dots v-else></button-loading-dots>
                    </template>
                </invisible-recaptcha>
            </div>
            <div v-else>
                <button type="submit"
                    class="btnn">
                    <span v-if="!isBusy">
                        {{ $t('Create an account') }}
                    </span>
                    <button-loading-dots v-else></button-loading-dots>
                </button>
            </div>
        </form>
         </div>

         <div class="toggle-box">

             <div class="toggle-panel toggle-right">
                <img src="../assets/img/logospiderhome.png" alt="logo">
                 <p>Already have an account?</p>
                 <router-link to="/login">
                 <button type="button" class="btnn login-btn">Login</button>
                 </router-link>
             </div>
         </div>
     </div>

    </div>
</template>

<script>
import ButtonLoadingDots from "../common/gui/loaders/button-loading-dots.vue";
import InvisibleRecaptcha from '../register/invisible-recaptcha.vue';
import RegulationsCheckbox from "../common/errors/regulations-checkbox";
import ResendAccountActivationLink from "../register/resend-account-activation-link.vue";

import TransitionExpand from "@/common/gui/transition-expand";
import {DateTime} from "luxon";
import {mapState} from "pinia";
import {useFrontendConfigStore} from "@/stores/frontend-config-store";

export default {
   props: ['authenticating', 'oauth', 'error', 'value', 'intitialUsername', 'submitButtonText'],
   components: { TransitionExpand,
         ResendAccountActivationLink, RegulationsCheckbox, ButtonLoadingDots, InvisibleRecaptcha
        },
   data() {
           return {
            showPassword: false,
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
                successMessage: '',
                captchaToken: null,
                regulationsAgreed: false,
                resendActivationLinkOption: false,
                emailTouched: false,
                passwordTouched: false,
                passwordConfirmTouched: false,
                regulationsTouched: false,
           };
       },
 mounted() {
   this.username = this.intitialUsername || '';
 },
 methods: {
        closeModal() {
            this.showForgotPasswordModal = false;
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
            submit() {
                this.resendActivationLinkOption = false;
                this.errorMessage = '';
                this.successMessage = '';
                this.emailTouched = true;
                this.passwordTouched = true;
                this.passwordConfirmTouched = true;
                this.regulationsTouched = true;
                
                if (!this.formIsValid) {
                    return;
                }
                
                const data = {
                    email: this.username,
                    password: this.password,
                    timezone: this.timezone,
                    locale: this.$i18n.locale,
                    regulationsAgreed: this.regulationsAgreed
                };
                
                if (this.captchaEnabled) {
                    data.captcha = this.captchaToken;
                }

                this.isBusy = true;
                this.$http.post('register-account', data, {skipErrorHandler: [400, 409]})
                    .then(({body}) => {
                        this.successMessage = this.$t('Registration successful! Please check your email to activate your account.');
                        this.$emit('registered', body.email);
                        // Clear form fields
                        this.username = '';
                        this.password = '';
                        this.confirmPassword = '';
                        this.regulationsAgreed = false;
                        this.emailTouched = false;
                        this.passwordTouched = false;
                        this.passwordConfirmTouched = false;
                        this.regulationsTouched = false;
                    })
                    .catch(({body}) => {
                        this.resendActivationLinkOption = body.accountEnabled === false;
                        this.errorMessage = this.$t(body.message);
                    })
                    .finally(() => this.isBusy = false);
            },
            getPasswordStrengthColor() {
                if (this.passwordStrength < 40) return '#ff4757'; // red
                if (this.passwordStrength < 70) return '#ffa502'; // orange
                if (this.passwordStrength < 90) return '#2ed573'; // green
                return '#1e90ff'; // blue
            },
            getPasswordStrengthText() {
                if (this.password.length === 0) return '';
                if (this.passwordStrength < 40) return this.$t('Weak');
                if (this.passwordStrength < 70) return this.$t('Moderate');
                if (this.passwordStrength < 90) return this.$t('Strong');
                return this.$t('Very Strong');
            }
    },
 computed: {
    errorEmail() {
                return this.emailTouched && this.username.indexOf('@') === -1;
            },
            errorPassword() {
                return this.passwordTouched && this.password.length < 8;
            },
            errorPasswordConfirm() {
                return this.passwordConfirmTouched && this.password !== this.confirmPassword;
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
            passwordStrength() {
                let strength = 0;
                if (this.password.length >= 8) strength += 25;
                if (this.password.length >= 12) strength += 25;
                if (/[A-Z]/.test(this.password) && /[a-z]/.test(this.password)) strength += 20;
                if (/\d/.test(this.password)) strength += 15;
                if (/[^0-9a-zA-Z]/.test(this.password)) strength += 15;
                return strength;
            }
       }
};
</script>
<style lang="scss">
 @import '../styles/mixins';
 @import '../styles/variables';

 .password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 22px;
  color: #888;
  cursor: pointer;
}

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
}

.strength-text {
    font-size: 12px;
    margin-top: 3px;
    text-align: right;
    color: #666;
}

.alert {
    padding: 5px 8px;
    border-radius: 8px;
    margin: 10px 0;
    font-size: 14px;
    
    &.error {
        background-color: #ffebee;
        border-left: 4px solid #f44336;
        color: #d32f2f;
    }
    
    &.success {
        background-color: #e8f5e9;
        border-left: 4px solid #1976d2;
        color: #f5f6f7;
    }
    
    p {
        margin: 5px 0;
    }
}

.activation-link {
    margin-top: 5px;
    a {
        color: #1976d2;
        text-decoration: none;
        font-weight: 500;
        
        &:hover {
            text-decoration: underline;
        }
    }
}

.form-group {
    margin-bottom: 20px;
    
    &.has-error {
        input {
            border: 1px solid #f44336 !important;
            background-color: #fff9f9 !important;
        }
        
        .help-block {
            color: #f44336;
            font-size: 13px;
            margin-top: 5px;
            text-align: left;
        }
    }
}

.help-block {
    &.for-error-only {
        display: none;
    }
}

.has-error .help-block.for-error-only {
    display: block;
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
   width: 880px;
   height: 500px;
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
       border-radius: 150px;
       z-index: 2;
       transition: 1.8s ease-in-out;
   }

       .container_login.active .toggle-box::before{ left: 50%; }

.toggle-panel{
   position: absolute;
   width: 50%;
   height: 100%;
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
</style>