<template>
    <div class="sidebar" :class="{'collapsed': collapsed}">
        <div class="sidebar-header">
            <button @click="collapsed = !collapsed" class="toggle-btn">
                <i class="icon" :class="collapsed ? 'pe-7s-angle-right' : 'pe-7s-angle-left'"></i>
            </button>
           
        </div>
        <ul class="nav-links">
            <li>
                <router-link :to="{name: 'me'}">
                    <i class="pe-7s-plug"></i>
                    <span v-if="!collapsed">{{ $t('Spider Home') }}</span>
                </router-link>
            </li>
            <li>
                <router-link to="/smartphones">
                    <i class="pe-7s-phone"></i>
                    <span v-if="!collapsed">{{ $t('Smartphones') }}</span>
                </router-link>
            </li>
            <li>
                <router-link to="/locations">
                    <i class="pe-7s-home"></i>
                    <span v-if="!collapsed">{{ $t('Locations') }}</span>
                </router-link>
            </li>
            <li>
                <router-link to="/access-identifiers">
                    <i class="pe-7s-key"></i>
                    <span v-if="!collapsed">{{ $t('Access Identifiers') }}</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapStores } from "pinia";
import { useCurrentUserStore } from "@/stores/current-user-store";

export default {
    data() {
        return {
            collapsed: false,
        };
    },
    computed: {
        ...mapStores(useCurrentUserStore),
    }
};
</script>

<style scoped lang="scss">
.sidebar {
    width: 250px;
    height: 100vh;
    background: #fff;
    border-right: 1px solid #ddd;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    transition: width 0.3s;
}

.sidebar.collapsed {
    width: 60px;
}

.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
}

.toggle-btn {
    background: none;
    border: none;
    cursor: pointer;
}

.nav-links {
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav-links li {
    padding: 10px 15px;
}

.nav-links li a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #333;
}

.nav-links li a i {
    margin-right: 10px;
}

.sidebar.collapsed .nav-links li a span {
    display: none;
}
</style>
