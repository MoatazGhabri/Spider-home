<template>
     <div>
   
    <div class="sidebar-container">
        
        <transition name="slide">
            <div class="sidebar" v-show="isSidebarVisible">
                <button type="button" class="toggle-sidebar" @click="toggleSidebar">
            <span>◀</span>
          </button>
                <div class="sidebar-header">
                    <router-link :to="{ name: 'home' }" class="sidebar-brand">
                        <div class="logo-container">
                        <supla-logo class="logo"></supla-logo>
                        </div>
                        
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
                        <router-link to="/dash">
                            <i class="pe-7s-key"></i>
                            <span>{{ $t('Dashboard') }}</span>
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

                    <li class="has-children" @click="toggleDropdown('automation')">
                       
                            <a class="menu-title">
                            <i class="pe-7s-config"></i>
                                <span>Automation</span>
                                <i class="arrow"></i>
                            </a>
                            <!-- <a class="dropdown-toggle" @click="toggleDropdown('automation')">
                              
                            </a> -->
                       
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
                  
                    <button type="button" class="logout-button" @click="logout">
                        <i class="pe-7s-power"></i>
                        <span>{{ $t('Sign Out') }}</span>
                    </button>
                </div>
            </div>
        </transition>

        <button type="button" class="toggle-sidebar" @click="toggleSidebar" v-if="!isSidebarVisible">
        <span>▶</span>
      </button>
    </div>
    <div class="body" :class="{ 'sidebar-open': isSidebarVisible }">  </div>
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
            isSidebarVisible: false
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
        toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    }
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
    z-index: 1001;
}

.sidebar {
    width: 210px;
    height: 100vh;
    background-color: #011627;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: all 0.3s ease;

    .sidebar-header {
        padding: 2rem 1.5rem;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        .logo-container {
            width: 90px;
            height: 90px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            background: $supla-grey;
            border-radius: 12px;

            .logo {
                width: 100%;
                height: 100%;
                 padding-left: 10px;
            }
        }
    }

    .sidebar-nav {
        flex: 1;
        padding: 1.5rem 1rem;
        margin: 0;
        list-style: none;

        li {
            margin: 0.5rem 0;

            a, .menu-title {
                display: flex;
                 align-items: left;
                padding: 0.875rem 1.25rem;
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                // transition: all 0.2s ease;
                border-radius: 8px;
                font-size: 1rem;

                i {
                    font-size: 1.5rem;
                    margin-right: 1.25rem;
                    width: 1.5rem;
                    text-align: center;
                }

                span {
                    font-weight: 500;
                }

                &:hover, &.link-active {
                    color: white;
                    background-color: rgba(255, 255, 255, 0.1);
                }
            }

            &.has-children {
                .menu-title {
                    cursor: pointer;
                    text-align: left !important;


                    a.dropdown-toggle {
                   
                    align-items: left !important;
                    
                }
                    .arrow {
                        margin-left: 1rem;
                        font-size: 0.75rem;
                    }
                }

                .submenu {
                    list-style: none;
                    padding: 0.5rem 0;
                    margin: 0.5rem 0;
                    background-color: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;

                    li {
                        margin: 0.25rem 0;

                        a {
                            padding: 0.75rem 1rem 0.75rem 3.5rem;
                            font-size: 0.95rem;

                            i {
                                font-size: 1.25rem;
                                width: 1.25rem;
                                margin-right: 1rem;
                            }
                        }
                    }
                }

                .arrow {
                    transition: transform 0.2s ease;

                    &::after {
                        content: '▼';
                    }
                }

                &.active .arrow {
                    transform: rotate(180deg);
                }
            }
        }
    }

    .sidebar-footer {
        padding: 1.5rem 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-left: 0;

        li {
            margin: 0.5rem 0;
            list-style: none; 

            a, .menu-title {
                display: flex;
                align-items: left;
                padding: 0.875rem 1.25rem;
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                transition: all 0.2s ease;
                border-radius: 8px;
                font-size: 1rem;

                i {
                    font-size: 1.5rem;
                    margin-right: 1.25rem;
                    width: 1.5rem;
                    text-align: center;
                }

                span {
                    font-weight: 500;
                }

                &:hover, &.link-active {
                    color: white;
                    background-color: rgba(255, 255, 255, 0.1);
                }
            }

            &.has-children {
                .menu-title {
                    cursor: pointer;
                    


                    .arrow {
                        margin-left: 1rem;
                        font-size: 0.75rem;
                    }
                }

                .submenu {
                    list-style: none;
                    padding: 0.5rem 0;
                    margin: 0.5rem 0;
                    background-color: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;

                    li {
                        margin: 0.25rem 0;

                        a {
                            padding: 0.75rem 1rem 0.75rem 3.5rem;
                            font-size: 0.95rem;

                            i {
                                font-size: 1.25rem;
                                width: 1.25rem;
                                margin-right: 1rem;
                            }
                        }
                    }
                }

                .arrow {
                    transition: transform 0.2s ease;

                    &::after {
                        content: '▼';
                    }
                }

                &.active .arrow {
                    transform: rotate(180deg);
                }
            }
        }

        .logout-button {
            width: 100%;
            display: flex;
            align-items: center;
            padding: 0.875rem 1.25rem;
            color: rgba(255, 255, 255, 0.8);
            background: none;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            border-radius: 8px;
            font-size: 1rem;

            i {
                font-size: 1.5rem;
                margin-right: 1.25rem;
                width: 1.5rem;
                text-align: center;
            }

            span {
                font-weight: 500;
            }

            &:hover {
                color: white;
                background-color: rgba(255, 255, 255, 0.1);
            }
        }
    }
}

.toggle-sidebar {
    position: absolute;
    right: -36px;
    top: 1rem;
    width: 36px;
    height: 48px;
    background-color: #011627;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0 8px 8px 0;
    transition: all 0.2s ease;

    span {
        font-size: 1.25rem;
    }

    &:hover {
        background-color: lighten(#011627, 10%);
    }
}

.body {
    margin-left: 0;
    transition: margin-left 0.3s ease;

    &.sidebar-open {
        margin-left: 280px;
    }
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}

@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        left: 0;
        top: 0;
    }

    .body.sidebar-open {
        margin-left: 0;
    }
}
</style>
