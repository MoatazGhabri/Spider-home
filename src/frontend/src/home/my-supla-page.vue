<template>
    <div>
        <nav class="navbar" @mouseenter="showNav" @mouseleave="hideNav" :class="{ 'navbar-visible': isNavVisible }">
            <div class="nav-left">
                <div class="img">
                    <img src="./assets/logo.gif" alt="Logo" class="logo" />
                </div>
                <div class="router">
                    <router-link :to="{ name: 'home' }">
                        <h1 v-title>{{ $t('Spider Home') }}</h1>
                    </router-link>
                </div>
            </div> 
            <div class="nav-right">
                <devices-registration-button v-show="!frontendConfig.maintenanceMode"
                    field="ioDevicesRegistrationEnabled"
                    caption-i18n="I/O devices registration"></devices-registration-button> 
            </div>
        </nav>
      
        <div class="content">
            <devices-list-page v-if="listType === 'devices'"/>
            <channel-list-page v-else/>
        </div>
    </div>
</template>

<script>
import DevicesRegistrationButton from "../devices/list/devices-registration-button";
import DevicesListPage from "../devices/list/devices-list-page";
import ChannelListPage from "../channels/channel-list-page";
import { mapState } from "pinia";
import { useFrontendConfigStore } from "@/stores/frontend-config-store";

export default {
    components: {
        ChannelListPage,
        DevicesListPage,
        DevicesRegistrationButton
    },
    data() {
        return {
            listType: 'devices',
            isNavVisible: false
        };
    },
    computed: {
        ...mapState(useFrontendConfigStore, { frontendConfig: 'config' }),
    },
    methods: {
        showNav() {
            this.isNavVisible = true;
        },
        hideNav() {
            this.isNavVisible = false;
        }
    }
};
</script>

<style>
.navbar {
    background-color: white;
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: -100px;
    left: 0;
    width: 100%;
    transition: top 0.3s ease-in-out;
    z-index: 9999;
}
.navbar-visible {
    top: 0;
}

.navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 700px;
    padding: 0 5px;
    left: 5px;
}

.nav-title {
    text-decoration: none;
    color: black;
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.nav-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
}

.nav-right {
    display: flex;
    align-items: center;
}

.content {
    margin-top: 60px; /* Adjust for the fixed nav height */
}

.logo {
    height: 100px;
    width: 100px;
    margin-right: 10px;
}
@media (max-width: 768px) {
    .router {
        display: none;
    }
    
   
    
}

@media (max-width: 480px) {
   
    .router {
        display: none;
    }
   
}
@media (max-width: 360px) {
    
    .router {
        display: none;
    }
   
}
</style>
