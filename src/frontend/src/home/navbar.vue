<template>
    <div class="sidebar-container">
        <div class="sidebar-trigger" @mouseenter="showSidebar = true"></div>
        
        <transition name="slide">
            <div class="sidebar" 
                 v-show="showSidebar"
                 @mouseleave="showSidebar = false">
                
                <div class="sidebar-header">
                    <router-link :to="{ name: 'home' }" class="sidebar-brand">
                        <supla-logo class="logo"></supla-logo>
                    </router-link>
                </div>

                <ul class="sidebar-nav">
                    <li>
                        <router-link :to="{ name: 'me' }" active-class="link-active">
                            <i class="pe-7s-plug"></i>
                            <span>{{ $t('SpiderHome') }}</span>
                        </router-link>
                    </li>

                    <li>
                        <router-link to="/smartphones">
                            <i class="pe-7s-phone"></i>
                            <span>{{ $t('Smartphones') }}</span>
                        </router-link>
                    </li>
                   
                    <li>
                        <router-link to="/locations">
                            <i class="pe-7s-home"></i>
                            <span>{{ $t('Locations') }}</span>
                        </router-link>
                    </li>

                    <li>
                        <router-link to="/access-identifiers">
                            <i class="pe-7s-key"></i>
                            <span>{{ $t('Access Identifiers') }}</span>
                        </router-link>
                    </li>

                    <li class="has-children" @click="toggleSubmenu('automation')">
                        <div class="menu-title">
                            <a class="dropdown-toggle" @click="toggleDropdown('automation')">
                                <i class="pe-7s-config"></i>
                                <span>Automation</span>
                                <i class="arrow"></i>
                            </a>
                        </div>
                        <ul class="submenu" v-show="openDropdown === 'automation'">
                            <li><router-link :to="{ name: 'schedules' }"><i class="pe-7s-clock mr-1"></i><span> {{ $t('Schedules') }} </span></router-link></li>
                            <li><router-link :to="{ name: 'channelGroups' }"><i class="pe-7s-keypad mr-1"></i><span> {{ $t('Channel groups') }}</span></router-link></li>
                            <li><router-link :to="{ name: 'directLinks' }"><i class="pe-7s-link mr-1"></i><span> {{ $t('Direct links') }}</span></router-link></li>
                            <li><router-link :to="{ name: 'scenes' }"><i class="supla-icon supla-icon-scene mr-1"></i><span>{{ $t('Scenes') }}</span></router-link></li>
                            <li><router-link :to="{ name: 'reactions' }"><i class="pe-7s-arc mr-1"></i><span> {{ $t('Reactions') }}</span></router-link></li>
                        </ul>
                    </li>
                </ul>

                <div class="sidebar-footer">
                    <ul>
                        <li class="has-children" @click="toggleDropdown('account')">
                            <a class="menu-title">
                                <i class="pe-7s-user"></i>
                                <span>{{ $t('Account') }}</span>
                                <i class="arrow"></i>
                            </a>
                            <ul class="submenu" v-show="openDropdown === 'account'">
                                <li>
                                    <router-link to="/account" class="text-center">
                                        <i class="pe-7s-user"></i>
                                        <span>{{ $t('Account') }}</span>
                                    </router-link>
                                </li>

                                <li>
                                    <router-link :to="{name: 'integrations.myOauthApps'}">
                                        <fa icon="puzzle-piece" class="mr-1" />
                                        <span>{{ $t('Integrations') }}</span>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :to="{name: 'safety.log'}">
                                        <fa icon="shield-halved" class="mr-1"/>
                                        <span>{{ $t('Security') }}</span>
                                    </router-link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <button type="button" class="logout-button" @click="logout">
                        <i class="pe-7s-power"></i>
                        <span>{{ $t('Sign Out') }}</span>
                    </button>
                </div>
            </div>
        </transition>
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
            showSidebar: false,
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
            this.openDropdown = null;
        }
    }
};
</script>

<style lang="scss">
@import '../styles/mixins.scss';
@import '../styles/variables.scss';

.sidebar-container {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
}

.sidebar-trigger {
    position: absolute;
    left: 0;
    top: 0;
    width: 10px;
    height: 100vh;
    z-index: 1001;
    transition: width 0.2s;
    
    &:hover {
        width: 15px;
        background: rgba($supla-green, 0.1);
    }
}

.sidebar {
    width: 250px;
    height: 100vh;
    background: rgba($supla-white, 0.98);
    backdrop-filter: blur(5px);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    z-index: 1002;
    
    .sidebar-header {
        padding: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        text-align: center;
        
        .logo {
            height: 100px;
            width: 100px;
        }
    }
    
    .sidebar-nav {
        flex: 1;
        padding: 20px 0;
        margin: 0;
        overflow-y: auto;
        
        li {
            a {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                color: $supla-black;
                text-decoration: none;
                transition: all 0.2s ease;
                
                
                i {
                    font-size: 20px;
                    min-width: 30px;
                    text-align: center;
                    text-decoration: none;
                }
                
                span {
                    margin-left: 10px;
                    white-space: nowrap;
                }
                
                &:hover {
                    background: rgba($supla-green, 0.1);
                }
                
                &.link-active {
                    background: rgba($supla-green, 0.15);
                    border-left: 3px solid $supla-green;
                }
            }
        }
        
        .submenu {
            background: rgba($supla-black, 0.02);
            padding-left: 15px;
            
            li a {
                padding: 10px 20px;
                font-size: 14px;
                text-decoration: none;
                &:hover {
            text-decoration: none; /* Assurance pour les états hover */
        }
            }
        }
    }
    
    .sidebar-footer {
        padding: 15px;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
        
        .logout-button {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            width: 100%;
            background: none;
            border: none;
            color: $supla-red;
            cursor: pointer;
            transition: all 0.2s;
            
            &:hover {
                background: rgba($supla-red, 0.1);
            }
            
            i {
                margin-right: 10px;
            }
        }
    }
    .submenu {
    background: rgba($supla-black, 0.02);
    padding-left: 15px;
    list-style: none;
    
    a {
        text-decoration: none !important;
        display: flex;
        align-items: center;
        color: inherit;
        
        &:hover, &:focus {
            text-decoration: none !important;
        }
        
        i {
            margin-right: 10px;
        }
    }
}
.sidebar-footer {
    padding: 15px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    
    .menu-title {
        display: flex;
        align-items: center;
        padding: 12px 20px;
        color: $supla-black;
        text-decoration: none !important;  // Add this line
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
            background: rgba($supla-green, 0.1);
            text-decoration: none !important;  // Ensure no underline on hover
        }
        
        i {
            font-size: 20px;
            min-width: 30px;
            text-align: center;
        }
        
        span {
            margin-left: 10px;
            white-space: nowrap;
        }
    }
    
    // ... rest of your existing footer styles
}
}

/* Animation */
.slide-enter-active, .slide-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
    .sidebar-trigger {
        display: none;
    }
    
    .sidebar {
        box-shadow: 2px 0 20px rgba(0, 0, 0, 0.2);
    }
}
</style>