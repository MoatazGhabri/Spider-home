<template>
    <div class="grid-filters-container">
        <div class="filter-section">
            <div class="filter-title">{{ $t('Sort by') }}</div>
            <div class="square-buttons-grid">
                <button type="button"
                    v-for="filter in filters"
                    :key="filter.value"
                    @click="sort = filter.value; filter()"
                    class="square-btn"
                    :class="{ active: sort === filter.value }"
                    :disabled="filter.visible === false"
                >
                    {{ filter.label }}
                </button>
            </div>
        </div>

        <div class="filter-section">
            <div class="filter-title">{{ $t('Connection status') }}</div>
            <div class="square-buttons-grid">
                <button type="button"
                    v-for="connFilter in connectionFilters"
                    :key="connFilter.value"
                    @click="connected = connFilter.value; filter()"
                    class="square-btn"
                    :class="{ active: connected === connFilter.value }"
                >
                    {{ connFilter.label }}
                </button>
            </div>
        </div>

        <div class="filter-section">
            <div class="filter-title">{{ $t('Functionality') }}</div>
            <div class="custom-dropdown">
                <button type="button"
                    class="dropdown-toggle square-btn"
                    @click="showFunctionalityDropdown = !showFunctionalityDropdown"
                >
                    {{ currentFunctionalityLabel }}
                    <span class="dropdown-arrow">▼</span>
                </button>
                <div class="dropdown-card" v-show="showFunctionalityDropdown">
                    <div 
                        v-for="funcFilter in functionalityFilters"
                        :key="funcFilter.value"
                        @click="functionality = funcFilter.value; showFunctionalityDropdown = false; filter()"
                        class="dropdown-item"
                        :class="{ active: functionality === funcFilter.value }"
                    >
                        {{ funcFilter.label }}
                    </div>
                </div>
            </div>
        </div>

        <div class="filter-section search-section">
            <input
                type="text"
                @input="filter()"
                class="search-input"
                v-model="search"
                :placeholder="$t('Search')"
            >
        </div>
    </div>
</template>

<script>
import latinize from "latinize";
import {DateTime} from "luxon";
import {mapState} from "pinia";
import {useLocationsStore} from "@/stores/locations-store";
import {useDevicesStore} from "@/stores/devices-store";

export default {
    props: {
        hasDevice: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            connected: 'all',
            functionality: '*',
            search: '',
            sort: 'caption',
            showFunctionalityDropdown: false,
            connectionFilters: [
                {label: this.$t('All'), value: 'all'},
                {label: this.$t('Connected'), value: 'connected'},
                {label: this.$t('Disconnected'), value: 'disconnected'},
                {label: this.$t('Not available'), value: 'notAvailable'}
            ],
        };
    },
    computed: {
        filters() {
            return [
                {label: this.$t('As in device'), value: 'channelNumber', visible: this.hasDevice},
                {label: this.$t('A-Z'), value: 'caption'},
                {label: this.$t('Registered'), value: 'regDate', visible: !this.hasDevice},
                {label: this.$t('Last access'), value: 'lastAccess', visible: !this.hasDevice},
                {label: this.$t('Location'), value: 'location'}
            ];
        },
        functionalityFilters() {
            return [
                {label: this.$t('All'), value: '*'},
                {label: this.$t('With function'), value: 'withFunction'},
                {label: this.$t('Electric'), value: '130,140,180,190,200,300,310,315'},
                {label: this.$t('Doors, Gates, Windows'), value: '10,20,30,50,60,70,90,100,115,125,230,800,810,950'},
                {label: this.$t('Roller shutters'), value: '110,120,900,910,930,940'},
                {label: this.$t('Liquid, Temp'), value: '40,42,45,80,500,510,980,981,982'},
                {label: this.$t('Sensors'), value: '50,60,70,80,100,120,210,220,230,235,236,240,250,260,270,280,990,1000'},
                {label: this.$t('Meters'), value: '310,315,320,330,340,520,530'},
                {label: this.$t('HVAC'), value: '400,410,420,422,423,424,425,426,960,970'},
                {label: this.$t('Other'), value: '290,700,920'},
                {label: this.$t('No function'), value: '0,-1'}
            ];
        },
        currentFunctionalityLabel() {
            const selected = this.functionalityFilters.find(f => f.value === this.functionality);
            return selected ? selected.label : this.$t('Select functionality');
        },
        ...mapState(useLocationsStore, {locations: 'all'}),
        ...mapState(useDevicesStore, {devices: 'all'}),
    },
    mounted() {
        this.filter();
    },
    methods: {
        filter() {
            this.$emit('filter-function', (device) => this.matches(device));
            this.$emit('compare-function', (a, b) => this.compare(a, b));
        },
        matches(channel) {
            const connectedFilters = {
                all: true,
                disconnected: !channel.connected,
                connected: channel.connected,
                notAvailable: channel.state?.connectedCode === 2,
            };
            if (!connectedFilters[this.connected]) {
                return false;
            }
            if (this.functionality && this.functionality !== '*') {
                if (this.functionality === 'withFunction') {
                    if (!channel.functionId) {
                        return false;
                    }
                } else if (this.functionality.split(',').indexOf('' + channel.functionId) === -1) {
                    return false;
                }
            }
            if (this.search) {
                const location = this.locations[channel.locationId] || {};
                const device = this.devices[channel.iodeviceId] || {};
                const searchString = latinize([channel.id, channel.caption, device.name, this.$t(channel.type.caption),
                    location.id, location.caption, this.$t(channel.function.caption)].join(' '))
                    .toLowerCase();
                return searchString.indexOf(latinize(this.search).toLowerCase()) >= 0;
            }
            return true;
        },
        compare(a, b) {
            if (this.sort === 'channelNumber') {
                return a.channelNumber - b.channelNumber;
            } else if (this.sort === 'lastAccess') {
                const deviceA = this.devices[a.iodeviceId] || {};
                const deviceB = this.devices[b.iodeviceId] || {};
                return DateTime.fromISO(deviceB.lastConnected).diff(DateTime.fromISO(deviceA.lastConnected)).milliseconds;
            } else if (this.sort === 'caption') {
                return this.captionForSort(a) < this.captionForSort(b) ? -1 : 1;
            } else if (this.sort === 'regDate') {
                const deviceA = this.devices[a.iodeviceId] || {};
                const deviceB = this.devices[b.iodeviceId] || {};
                return DateTime.fromISO(deviceB.regDate).diff(DateTime.fromISO(deviceA.regDate)).milliseconds;
            } else {
                const locationA = this.locations[a.locationId] || {};
                const locationB = this.locations[b.locationId] || {};
                return this.captionForSort(locationA) < this.captionForSort(locationB) ? -1 : 1;
            }
        },
        captionForSort(channel) {
            return latinize(channel.caption || (channel.function && this.$t(channel.function.caption)) || '').toLowerCase().trim();
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.grid-filters-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    margin-bottom: 20px;
}

.filter-section {
    flex: 1;
    min-width: 250px;
}

.filter-title {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
}

.square-buttons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
}

.square-btn {
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-1px);
    }

    &.active {
        background: $supla-green;
        border-color: $supla-green;
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.custom-dropdown {
    position: relative;
    width: 100%;
}

.dropdown-toggle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dropdown-arrow {
    font-size: 10px;
    margin-left: 8px;
}

.dropdown-card {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(40, 44, 52, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    z-index: 100;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin-top: 4px;
}

.dropdown-item {
    padding: 10px 15px;
    color: white;
    cursor: pointer;
    transition: background 0.2s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    &.active {
        background: rgba($supla-green, 0.2);
        color: $supla-green;
    }

    &:last-child {
        border-bottom: none;
    }
}

.search-section {
    display: flex;
    flex-direction: column;
}

.search-input {
    padding: 10px 15px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 4px;
    width: 100%;
    margin-top: auto;

    &::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    &:focus {
        outline: none;
        border-color: $supla-green;
    }
}

@media (max-width: 768px) {
    .grid-filters-container {
        flex-direction: column;
        gap: 15px;
    }
    
    .filter-section {
        min-width: 100%;
    }
}
</style>