<template>
    <div class="container">
        <loading-cover :loading="notifications === undefined || user === undefined">
            <div v-if="notifications && Object.keys(notifications).length > 0">
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th>{{ $t('Action') }}</th>
                        <th>{{ $t('Date and time') }}</th>
                        <th>{{ $t('Appareil') }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(notification, id) in sortedNotifications" :key="id">
                        <td>
                            <span :class="getNotificationClass(notification.title)">
                                <fa :icon="getNotificationIcon(notification.title)" fixed-width/>
                                {{ notification.title }}
                            </span>
                        </td>
                        <td>{{ formatDate(notification.date) }}</td>
                        <td>{{ notification.profileName }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div v-else-if="notifications" class="no-notifications">
                <fa icon="bell-slash" class="no-notifications-icon"/>
                <p>{{ $t('No notifications found.') }}</p>
            </div>
        </loading-cover>
    </div>
</template>

<script>
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';

export default {
    data() {
        return {
            notifications: undefined,
            user: undefined,
        };
    },
    mounted() {
        // Fetch current user data
        this.$http.get('users/current').then(response => {
            this.user = response.body;
            // Once we have the user, set up notifications listener
            if (this.user && this.user.email) {
                const emailKey = this.user.email.replace(/[.]/g, '_');
                const notificationsRef = ref(database, `notifications/${emailKey}`);
                
                onValue(notificationsRef, (snapshot) => {
                    this.notifications = snapshot.val();
                }, (error) => {
                    console.error('Error fetching notifications:', error);
                });
            }
        });
    },
    computed: {
        sortedNotifications() {
            if (!this.notifications) return [];
            
            // Convert notifications object to array and sort by date
            return Object.entries(this.notifications)
                .map(([id, notification]) => ({
                    id,
                    ...notification,
                    date: new Date(notification.date)
                }))
                .sort((a, b) => b.date - a.date); // Sort by date descending (newest first)
        }
    },
    methods: {
        formatDate(dateString) {
            return new Date(dateString).toLocaleString();
        },
        getNotificationClass(title) {
            if (!title) return 'text-info';
            
            const lowerTitle = title.toLowerCase();
            if (lowerTitle.includes('ouvert') || lowerTitle.includes('allumé')) {
                return 'text-success';
            } else if (lowerTitle.includes('fermé') || lowerTitle.includes('éteint')) {
                return 'text-danger';
            }
            return 'text-info';
        },
        getNotificationIcon(title) {
            if (!title) return 'bell';
            
            const lowerTitle = title.toLowerCase();
            if (lowerTitle.includes('ouvert') || lowerTitle.includes('allumé')) {
                return 'door-open';
            } else if (lowerTitle.includes('fermé') || lowerTitle.includes('éteint')) {
                return 'door-closed';
            }
            return 'bell';
        }
    }
}
</script>

<style scoped>
.text-success {
    color: #28a745;
}
.text-danger {
    color: #dc3545;
}
.text-info {
    color: #17a2b8;
}

.no-notifications {
    text-align: center;
    padding: 40px;
    color: #6c757d;
}

.no-notifications-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
}
</style>