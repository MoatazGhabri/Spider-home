<template>
    <div class="acc-container">
        <div class="account-box">
            <span class="top"></span>
            <span class="right"></span>
            <span class="bottom"></span>
            <span class="left"></span>
            <div class="account-left">

                <div class="logo">
                    <img src="./assets/logospiderhome.png" alt="logo">
                </div>
                <div class="delete-button">
                    <a class="btn btn-red-outline btn-xs" @click="deletingAccount = true">
                        {{ $t('Delete my account') }}
                    </a>
                </div>

            </div>

            <div class="account-right">
                <h2>Your E-mail: {{ user.email }}</h2>
                <dl>
                    <dt class="black">{{ $t('Server address') }}</dt>
                    <dd>{{ suplaServerHost }}</dd>
                </dl>
                <dl>
                    <dt class="black">{{ $t('Timezone') }}</dt>
                    <dd><timezone-picker :timezone="user.timezone"></timezone-picker></dd>
                </dl>
                <div class="form-group">
                    <a class="btn btn-default" @click="changingNotifications = true">{{ $t('E-mail notifications') }}</a>
                    <a class="btn btn-default" @click="showingLimits = true">{{ $t('Show my limits') }}</a>
                </div>
            </div>
        </div>
        
        <div v-if="user">
            <account-opt-out-notifications-modal v-if="changingNotifications" @cancel="closeOptOutNotificationsModal()" :user="user"></account-opt-out-notifications-modal>
            <account-limits-modal v-if="showingLimits" @confirm="showingLimits = false" :user="user"></account-limits-modal>
            <account-delete-modal v-if="deletingAccount" @cancel="deletingAccount = false" :user="user"></account-delete-modal>
        </div>
    </div>
</template>

<script>
    import TimezonePicker from "./timezone-picker";
    import AccountOptOutNotificationsModal from "./account-opt-out-notifications-modal";
    import AccountDeleteModal from "./account-delete-modal";
    import AccountLimitsModal from "./account-limits-modal";
    import {mapState} from "pinia";
    import {useFrontendConfigStore} from "@/stores/frontend-config-store";

    export default {
        components: {
            AccountLimitsModal,
            AccountDeleteModal,
            TimezonePicker,
            AccountOptOutNotificationsModal,
        },
        data() {
            return {
                user: undefined,
                deletingAccount: false,
                showingLimits: false,
                changingNotifications: false,
            };
        },
        mounted() {
            this.$http.get('users/current').then(response => {
                this.user = response.body;
            });
        },
        methods: {
            closeOptOutNotificationsModal() {
                this.changingNotifications = false;
                if (this.$route.query.optOutNotification) {
                    this.$router.push({optOutNotification: undefined});
                }
            }
        },
        computed: {
            suplaServerHost() {
                return this.frontendConfig.suplaUrl.replace(/https?:\/\//, '');
            },
            ...mapState(useFrontendConfigStore, {frontendConfig: 'config', 'frontendVersion': 'frontendVersion'}),
        },
    };
</script>

<style lang="scss">
    @import '../styles/variables';
    @import '../styles/mixins';

    .acc-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
   
        position: relative;
        
    }

    .supla-version {
        
        background: $supla-black;
        color: white;
        padding: 2px 8px;
        border-radius: 5px;
        font-size: 0.9em;
    }

    .account-box {
    display: flex;
    width: 800px;
    height: 400px; /* Adjust height as needed */
    background: #fff;
    border-radius: 50px; /* High border radius for the curved effect */
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
}

.account-left,
.account-right {
    padding: 20px;
    height: 100%;
    overflow: hidden;
}


    .account-left {
        width: 35%;
        background-color: $supla-green;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        border-radius: 50px;
    }

    .account-left .logo img {
        width: 120px;
        height: auto;
        margin-bottom: 20px;
    }

    .delete-button {
        margin-top: 20px;
    }

    .account-right {
        width: 65%;
        padding: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .account-right h2 {
        margin-bottom: 20px;
        font-size: 2em;
        text-align: center;
        color: $supla-green;
    }

    .form-group {
        margin-top: 20px;
        display: flex;
        justify-content: space-around;
    }

    dt {
        float: left;
        clear: left;
        width: 170px;
        line-height: 25px;
        font-weight: 400;
    }
    dd {
         margin: 0 0 0 180px;
        line-height: 25px;
        color: $supla-green
    }
    .black{
        
        color: black;
    }
</style>