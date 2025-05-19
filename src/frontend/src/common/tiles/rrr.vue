<template>
    <div :class="['device-card', colorClass]"
        @click="$emit('click')">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: ['index'],
        computed: {
            colorClass() {
                const colors = ['blue', '#33b0df', 'yellow'];
                return colors[this.index % 3];
            }
        }
    };
</script>

<style lang="scss" scoped>
@import "../../styles/variables";

.device-card {
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid #011627; /* Added stroke border */
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    border-color: #33b0df; /* Maintain border color on hover */
  }

  > a, > .valign-center {
    display: block;
    width: 100%;
    height: 100%;
    color: inherit;
    text-decoration: none;
  }

  h2, h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #1e293b;
    font-weight: 600;
  }

  dl {
    margin-bottom: 1.5rem;
    font-size: 0.95em;
    
    dd, dt {
      display: inline;
    }
    
    dt:after {
      display: block;
      content: '';
    }
  }
}

/* Color Variations - Updated with stroke border */
.device-card.blue {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border-top: 4px solid #3b82f6;
  border: 2px solid #33b0df; /* Blue variant gets the stroke */
}

.device-card.purple {
  background: linear-gradient(135deg, #33b0df 0%, #33b0df 100%);
  border-top: 4px solid #8b5cf6;
  border: 2px solid #33b0df; /* Purple variant gets the stroke */
}

.device-card.yellow {
  background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%);
  border-top: 4px solid #f59e0b;
  border: 2px solid #33b0df; /* Yellow variant gets the stroke */
}

.device-card.grey {
  background: #f3f4f6;
  border-top: 4px solid #9ca3af;
  border: 2px solid #33b0df; /* Grey variant gets the stroke */
}

/* Status Label */
.device-status {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: auto;
  align-self: flex-start;

  &.online {
    background-color: rgba(5, 150, 105, 0.15);
    color: #059669;
  }

  &.offline {
    background-color: rgba(100, 116, 139, 0.15);
    color: #64748b;
  }
}

/* Selected State - Updated to work with stroke border */
.device-card.selected {
  border: 3px solid $supla-black; /* Thicker border when selected */
  
  &:after {
    content: '';
    position: absolute;
    width: 50px;
    height: 51px;
    background: url('../../assets/checked-corner.svg') no-repeat;
    top: -1px;
    right: -1px;
    border-top-right-radius: 3px;
    transition: all .5s ease-in-out;
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-name: fadeIn;
  }
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>



<template>
    <square-link :class="{'grey': !model.enabled}" 
                 :index="index"
                 @click="$emit('click')">
        <router-link :to="linkSpec">
            <span>
                <p class="device-location">{{ caption }}</p>
                <dl class="device-details">
                    <div class="detail-item">
                        <dd>ID</dd>
                        <dt>{{ model.id }}</dt>
                    </div>
                    <div class="detail-item" v-if="model.relationsCount?.locations">
                        <dd>{{ $t("No{'.'} of locations") }}</dd>
                        <dt>{{ model.relationsCount.locations }}</dt>
                    </div>
                    <div class="detail-item" v-if="model.relationsCount?.clientApps">
                        <dd>{{ $t("No{'.'} of Client's apps") }}</dd>
                        <dt>{{ model.relationsCount.clientApps }}</dt>
                    </div>
                </dl>
                <span class="device-status" :class="model.enabled ? 'online' : 'offline'">
                    {{ $t(model.enabled ? 'Enabled' : 'Disabled') }}
                </span>
            </span>
        </router-link>
    </square-link>
</template>

<script>
    export default {
        props: ['model', 'noLink', 'index'],
        computed: {
            caption() {
                return this.model.caption || this.$t('Access Identifier') + ' ID' + this.model.id;
            },
            linkSpec() {
                return this.noLink ? {} : {name: 'accessId', params: {id: this.model.id}};
            }
        }
    };
</script>

<style scoped>
/* Device Card Content */
.device-location {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

.device-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.device-details dd {
  color: #475569;
  font-size: 0.85rem;
  margin: 0;
}

.device-details dt {
  color: #1e293b;
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0;
}

/* Status Label */
.device-status {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.device-status.online {
  background-color: rgba(5, 150, 105, 0.15);
  color: #059669;
}

.device-status.offline {
  background-color: rgba(100, 116, 139, 0.15);
  color: #64748b;
}
</style>