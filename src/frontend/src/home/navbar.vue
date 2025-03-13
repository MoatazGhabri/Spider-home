<template>
    <div class="sidebar-wrapper" :class="{ 'expanded': !collapsed }">
        <div :class="['sidebar', { 'collapsed': collapsed }]"
        @mouseenter="collapsed = false"
        @mouseleave="collapsed = true">
        <div class="sidebar-header">
            <supla-logo class="logo" v-if="collapsed"></supla-logo>

            <router-link :to="{ name: 'home' }" class="sidebar-brand" v-if="!collapsed">
                <supla-logo class="log"></supla-logo>
            </router-link>
        </div>
        
        <ul class="sidebar-nav">
            <li>
                <router-link :to="{ name: 'me' }" active-class="link-active">
                    <i class="pe-7s-plug"></i>
                    <span v-if="!collapsed">{{ $t('SpiderHome') }}</span>
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

            <li class="has-children" @click="toggleSubmenu('automation')">
                <div class="menu-title">
                <a class="dropdown-toggle" @click="toggleDropdown('automation')">
                    <i class="pe-7s-config"></i>
                    <span v-if="!collapsed">Automation</span>
                    <i class="arrow" v-if="!collapsed"></i>
                </a>
                </div>
                <ul class="submenu" v-show="openDropdown === 'automation'" v-if="!collapsed">
                    <li><router-link :to="{ name: 'schedules' }"><i class="pe-7s-clock mr-1"></i><span v-if="!collapsed"> {{ $t('Schedules') }} </span></router-link></li>
                    <li><router-link :to="{ name: 'channelGroups' }"><i class="pe-7s-keypad mr-1"></i><span v-if="!collapsed">  {{ $t('Channel groups') }}</span></router-link></li>
                    <li><router-link :to="{ name: 'directLinks' }"><i class="pe-7s-link mr-1"></i> <span v-if="!collapsed"> {{ $t('Direct links') }}</span></router-link></li>
                    <li><router-link :to="{ name: 'scenes' }"><i class="supla-icon supla-icon-scene mr-1"></i> <span v-if="!collapsed">{{ $t('Scenes') }}</span></router-link></li>
                    <li><router-link :to="{ name: 'reactions' }"><i class="pe-7s-arc mr-1"></i> <span v-if="!collapsed"> {{ $t('Reactions') }}</span></router-link></li>
                </ul>
            </li>
           
        </ul>

        <div class="sidebar-footer">
            
         
            <ul>
                <li class="has-children" @click="toggleDropdown('informations')">
                    <a class="menu-title">
                        <i class="pe-7s-info"></i>
                        <span v-if="!collapsed">{{ $t('Informations') }}</span>
                        <i class="arrow" v-if="!collapsed"></i>
                    </a>
                    <ul class="submenu" v-show="openDropdown === 'informations'" v-if="!collapsed">
                        <li>
                                <router-link to="/account" class="text-center">
                                    <i class="pe-7s-user"></i>
                                   <span v-if="!collapsed"> {{ $t('Account') }}</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link :to="{name: 'integrations.myOauthApps'}">
                                    <fa icon="puzzle-piece" class="mr-1" />
                                   <span v-if="!collapsed">{{ $t('Integrations') }}</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link :to="{name: 'safety.log'}">
                                    <fa icon="shield-halved" class="mr-1"/>
                                   <span v-if="!collapsed"> {{ $t('Security') }}</span>
                                </router-link>
                            </li>
                        
                    </ul>
                </li>
            </ul>
            <button class="logout-button" @click="logout">
                <i class="pe-7s-power"></i>
                <span v-if="!collapsed">{{ $t('Sign Out') }}</span>
            </button>
        </div>
    </div>
    <div class="page-overlay" v-if="!collapsed" @click="collapsed = true"></div>

</div>
</template>

<script>
import SuplaLogo from "./supla-logo";
import { mapStores } from "pinia";
import { useCurrentUserStore } from "@/stores/current-user-store";

export default {
    components: { SuplaLogo },
    data() {
        return {
            collapsed: true,
            openDropdown: null, 
        };
    },
    methods: {
        subIsActive(input) {
            const paths = Array.isArray(input) ? input : [input];
            return paths.some(path => {
                return this.$route.path.indexOf(path) === 0;
            });
        },
        logout() {
            this.$http.post('logout', undefined, { skipErrorHandler: true });
            this.currentUserStore.forget();
            this.$router.push({ name: 'login' });
        },
        toggleDropdown(dropdown) {
          
            if (this.openDropdown !== dropdown) {
                this.openDropdown = dropdown;
            } else {
                this.openDropdown = null; 
            }
        },
    },
    computed: {
        ...mapStores(useCurrentUserStore),
    },
    watch: {
        $route() {
            this.collapsed = true;
            this.openDropdown = null; 
        }
    }
};
</script>

<style lang="scss">
@import '../styles/mixins.scss';
@import '../styles/variables.scss';
.sidebar-wrapper {
    position: relative;

    .page-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 99;
        transition: opacity 0.3s;
    }
}
.sidebar {
    width: 200px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background: $supla-white;
    border-right: 1px solid #ddd;
    transition: width 0.3s;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    overflow-x:auto;
    
    
    transition: width 0.3s;

    &.collapsed {
        width: 60px;

        .sidebar-nav span,
        .sidebar-footer span {
            display: none;
        }
    }

    .sidebar-header {
        padding: 15px;
        border-bottom: 1px solid #ddd;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .logo{
            height: 30px;
            width: 30px;
        }
    }
    
    .sidebar-nav {
        flex: 1;
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            position: relative;
            a {
                display: flex;
                align-items: center;
                padding: 10px 15px;
                color: $supla-black;
                text-decoration: none;
                cursor: pointer;
                transition: background 0.3s;
                gap: 10px;

                i {
                font-size: 18px; 
                min-width: 24px;  
                text-align: center;
            }

                &:hover,
                &:focus {
                    background: $supla-green;
                    color: $supla-white;
                }
            }
            &.has-children .menu-title {
                justify-content: space-between;
            }
            &.active > a {
                background: $supla-green;
                color: $supla-white;
            }
        }
        .submenu {
                background-color: rgba(255, 255, 255, 0.1);
                list-style: none;
                padding-left: 30px;
                li {
                    padding: 5px 0;
                    a {
                        font-size: 14px;
                    }
                }
            }
            .arrow::after {
                content: '▼';
                font-size: 10px;
            }
        
    }


    .sidebar-footer {
        padding: 10px 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;

        .logout-button{
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            background: none;
            border: none;
            color: red;
            text-decoration: none;

            i {
                font-size: 18px;
            }

            &:hover {
                color: $supla-red;
            }
        }
        li {
            position: relative;
            a,.menu-title {
                display: flex;
                align-items: center;
                padding: 10px 15px;
                color: $supla-black;
                text-decoration: none;
                cursor: pointer;
                transition: background 0.3s;
                gap: 10px;

            

                &:hover,
                &:focus {
                    background: $supla-green;
                    color: $supla-white;
                }
            }
            &.has-children .menu-title {
                justify-content: space-between;
            }
            &.active > a {
                background: $supla-green;
                color: $supla-white;
            }
        }
        .submenu {
                background-color: rgba(255, 255, 255, 0.1);
                list-style: none;
                padding-left: 30px;
                li {
                    padding: 5px 0;
                    a {
                        font-size: 14px;
                    }
                }
            }
            .arrow::after {
                content: '▼';
                font-size: 10px;
            }
   }
   

.sidebar-footer ul {
    list-style: none;   
    padding: 0;      
    margin: 0; 
}
.sidebar-nav ul{
    list-style: none;   
    padding: 0;      
    margin: 0;
}


}
.page-content {
    margin-left: 50px;
    transition: margin-left 0.3s;

    .sidebar.collapsed ~ & {
        margin-left: 60px;
    }
}


</style>