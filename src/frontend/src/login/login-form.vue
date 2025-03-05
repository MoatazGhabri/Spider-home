<template>
    <div class="login-container">
        <div class="login-box">

            <div class="login-left">
                <div class="logo">
                    <img src="../assets/img/logospiderhome.png" alt="logo">
                </div>
                <div class="additional-buttons">
                    <router-link to="/register" class="btn">
                        <span class="icon"><i class="pe-7s-user"></i></span>
                        {{ $t('Create an account') }}
                    </router-link>
                    <router-link to="/forgotten-password" class="btn">
                        <span class="icon"><i class="pe-7s-help1"></i></span>
                        {{ $t('Forgot your password?') }}
                    </router-link>
                    
                </div>
            </div>

            <div class="login-right">
                <h2>{{ $t('Login to your Spider Home') }}</h2>
                <div class="error-container">
                    <transition name="fade">
                        <div v-if="error === 'sessionExpired'" class="error-message error-session">
                            {{ $t('Your session has expired. Please log in again.') }}
                        </div>
                    </transition>

                    <transition name="fade">
                        <div v-if="error === 'locked'" class="error-message error-locked">
                            {{ $t('Your account has been locked. Please wait before retrying.') }}
                        </div>
                    </transition>

                    <transition name="fade">
                        <div v-if="error === 'disabled'" class="error-message error-disabled">
                            {{ $t('Your account is not confirmed. Please check your email.') }}
                        </div>
                    </transition>
                    <transition name="fade">
                        <div v-if="error === 'incorrectCredentials'" class="error-message error-incorrect">
                            {{ $t('Incorrect email or password. Please try again.') }}
                        </div>
                    </transition>
                </div>
                <div class="form-group form-group-lg">
                    <span class="input-group">
                        <span class="input-group-addon">
                            <span class="pe-7s-user"></span>
                        </span>
                        <input type="email"
                            required
                            autocorrect="off"
                            autocapitalize="none"
                            v-focus="true"
                            :placeholder="$t('Your email')"
                            v-model="username"
                            name="_username"
                            class="form-control">
                    </span>
                </div>
                <div class="form-group form-group-lg login-password">
                    <span class="input-group">
                        <span class="input-group-addon">
                            <span class="pe-7s-lock"></span>
                        </span>
                        <input type="password"
                            :placeholder="$t('Password')"
                            name="_password"
                            v-model="password"
                            class="form-control">
                    </span>
                </div>
                <div class="form-group text-right">
                    <button type="submit"
                        class="btn btn-blue btn-lg"
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
        </div>
    </div>
</template>


<script>
    import ButtonLoadingDots from "../common/gui/loaders/button-loading-dots.vue";
    import ResendAccountActivationLink from "../register/resend-account-activation-link";
    import MaintenanceWarning from "../common/errors/maintenance-warning";
    import {mapState} from "pinia";
    import {useFrontendConfigStore} from "@/stores/frontend-config-store";

    export default {
        props: ['authenticating', 'oauth', 'error', 'value', 'intitialUsername', 'submitButtonText'],
        components: {ResendAccountActivationLink, ButtonLoadingDots, MaintenanceWarning},
        data() {
            return {
                username: '',
                password: '',
            };
        },
        mounted() {
            this.username = this.intitialUsername || '';
        },
        computed: {
            ...mapState(useFrontendConfigStore, {frontendConfig: 'config'}),
        }
    };
</script>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/mixins";

    .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5; 
}

.login-box {
    display: flex;
    width: 800px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.login-left {
    width: 35%;
    background-color: $supla-green; 
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.login-left .logo img {
    width: 120px;
    height: auto;
    margin-bottom: 20px;
}

.login-left .additional-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
}

.login-left .additional-buttons .btn {
    display: flex;
    align-items: center;
    background: transparent;
    border: 1px solid white;
    color: white;
    text-align: center;
    padding: 10px;
    border-radius: 5px;
    text-decoration: none;
    transition: 0.3s;
    font-size: 1em;
    justify-content: center;
}

.login-left .additional-buttons .btn .icon {
    margin-right: 8px;
    font-size: 1.2em;
}

.login-left .additional-buttons .btn:hover {
    background: white;
    color: #2c3e50;
}

.login-right {
    width: 65%;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.login-right h2 {
    margin-bottom: 20px;
    font-size: 2.5em;
    text-align: center;
    color: $supla-green;
}

.form-group {
    margin-bottom: 15px;
}

.input-group {
    display: flex;
    align-items: center;
    border-bottom: 1px solid white;
    padding: 5px;
}

.input-group-addon {
    margin-right: 10px;
    color: #666;
    font-size: 1.2em;
}

input.form-control {
    width: 100%;
    border: none;
    outline: none;
    padding: 8px;
}

.btn-blue {
    background: $supla-green;
    width: 100%;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 5pc;
    cursor: pointer;
    transition: 0.3s;
}

.btn-blue:hover {
    background: $supla-blue;
}

.error {
            display: inline-block;
            background: $supla-yellow;
            padding: 12px 20px;
            margin-top: 15px;
            border-radius: 3px;
            color: $supla-black;
            margin-bottom: 20px;
}
.error-container {
    margin-top: 10px;
    text-align: center;
}

.error-message {
    display: block;
    padding: 12px;
    border-radius: 5px;
    font-size: 0.9em;
    font-weight: bold;
    margin-bottom: 10px;
}

.error-session {
    background: #f39c12;
    color: white;
}

.error-locked {
    background: #e74c3c;
    color: white;
}

.error-disabled {
    background: #c0392b;
    color: white;
}
.error-incorrect {
    background: #e67e22;
    color: white;
}
</style>
