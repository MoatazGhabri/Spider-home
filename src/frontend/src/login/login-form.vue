<template>
    <div class="body">
    <div class="container_login">
         <div class="form-box login">
            <div class="form">
                
                 <h1 style="font-weight: bold;">Login</h1>
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
                 <div class="forgot-link">
                    <a @click="showForgotPasswordModal = true">Forgot Password ?</a>
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

         <div class="form-box register">
             <form action="#">
                 <h1 style="font-weight: bold;">Registration</h1>
                 <div class="input-box">
                     <input type="text" placeholder="Username"   class="form-control" required>
                     <i class='bx bxs-user'></i>
                 </div>
                 <div class="input-box">
                     <!-- <input type="email" placeholder="Email" required>
                     <i class='bx bxs-envelope' ></i> -->
                    
                <input type="email"
                    id="email"
                    placeholder="Email"
                    class="form-control"
                    autocorrect="off"
                    v-focus="true"
                    autocapitalize="none"
                    @blur="emailTouched = true"
                    v-model="username">
             
                 </div>
                 <div class="input-box">
                     <!-- <input type="password" placeholder="Password" required> -->
                     <input type="password"
                    @blur="passwordTouched = true"
                    placeholder="Password"
                    id="password"
                    class="form-control"
                    v-model="password">
                     <i class='bx bxs-lock-alt' ></i>
                 </div>

                 <div class="input-box">
                 <input type="password"
                    id="password-confirm"
                    @blur="passwordConfirmTouched = true"
                    placeholder="Confirm your Password"
                    class="form-control"
                    v-model="confirmPassword">
                
                </div>
                 <button type="submit" class="btnn">Register</button>
                
             </form>
         </div>

         <div class="toggle-box">
             <div class="toggle-panel toggle-left">
                 <img src="../assets/img/logospiderhome.png" alt="logo">
                 <p>Don't have an account ?</p>
                 <button type="button" class="btnn register-btn">Register</button>
             </div>

             <div class="toggle-panel toggle-right">
                <img src="../assets/img/logospiderhome.png" alt="logo">
                 <p>Already have an account ?</p>
                 <button type="button" class="btnn login-btn">Login</button>
             </div>
         </div>
     </div>
     <div v-if="showForgotPasswordModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
                <button type="button" @click="closeModal" class="btn-close">&times;</button>
                <h2>Reset Password</h2>
                 <p>Enter your email to receive password reset instructions.</p>
                 <form class="centered-form-container"
                 @submit.prevent="remind()">
                <div style="margin-bottom: 10px;">
                    <!-- <input type="email" v-model="resetEmail" placeholder="Enter your email" class="form-control"> -->
                    <input autocomplete="off"
                    class="form-control"
                    required
                    v-focus="true"
                    v-model="email"
                    type="email"
                    :placeholder="$t('Enter your email address')">
                </div>
                <!-- <button type="button" @click="sendResetEmail" class="btnn">Send Reset Link</button> -->
                <button type="submit"
                    class="btnn">
                    <span v-if="!loading">{{ $t('RESET') }}</span>
                    <button-loading-dots v-else></button-loading-dots>
                </button>
                <p v-if="sent" class="sucess"><strong>{{ $t('Check your email box') }}</strong></p>
                <p v-else-if="sentProblem" class="error"><strong>{{ $t('Could not reset the password. Please try again later.') }}</strong></p>
       
                 </form>
            </div>
             </div>
    </div>
</template>

<script>
import ButtonLoadingDots from "../common/gui/loaders/button-loading-dots.vue";

import {mapState} from "pinia";
import {useFrontendConfigStore} from "@/stores/frontend-config-store";

export default {
   props: ['authenticating', 'oauth', 'error', 'value', 'intitialUsername', 'submitButtonText'],
   components: {ButtonLoadingDots},
   data() {
           return {
               username: '',
               password: '',
               showForgotPasswordModal: false,
               loading: false,
                email: '',
                sent: false,
                sentProblem: false
           };
       },

       
 mounted() {
   this.username = this.intitialUsername || '';
   const container_login = document.querySelector('.container_login');
   const registerBtn = document.querySelector('.register-btn');
   const loginBtn = document.querySelector('.login-btn');

   if (registerBtn && loginBtn && container_login) {
     registerBtn.addEventListener('click', () => {
        container_login.classList.add('active');
     });

     loginBtn.addEventListener('click', () => {
        container_login.classList.remove('active');
     });
   }
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
            }
       
    },
 computed: {
           ...mapState(useFrontendConfigStore, {frontendConfig: 'config'}),
       }
};
</script>
<style lang="scss">
 @import '../styles/mixins';
 @import '../styles/variables';

.error{
    color: $supla-red;
 }
 .succes{
    color: $supla-green;
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

p{
    font-weight: bold;
}
a{
    font-weight: bold;
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
       /* border: 2px solid red; */
       border-radius: 150px;
       z-index: 2;
       transition: 1.8s ease-in-out;
   }

       .container_login.active .toggle-box::before{ left: 50%; }
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
    width: 75px;
    height: 75px;
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

   .toggle-panel h1{font-size: 30px; }
   img{
    width: 75px;
    height: 75px;
   }
   .toggle-panel .btnn{
       width: 100px;
       height: 40px;
   }
}

</style>