<template>
    <div>
        <h1 v-title class="h1">{{ $t('CHANNELS') }}</h1>
        <div class="clearfix left-right-header">
        
        <loading-cover :loading="!channels">
            <div class="container" v-show="channels && channels.length">
                <channel-filters
                    @filter-function="filterFunction = $event"
                    @compare-function="compareFunction = $event"></channel-filters>
            </div>
            <div v-if="channels && channels.length">
                <div class="channels-grid" v-if="filteredChannels.length"
                    :count="filteredChannels.length">
                    <div class="channel-wrapper" v-for="channel in filteredChannels" :key="channel.id">
                        <!-- <channel-tile :model="channel"></channel-tile> -->

                        <div class="border-light"></div>
                        <channel-tile :model="channel" class="channel-tile"></channel-tile>
                    </div>
                </div>
                <empty-list-placeholder v-else></empty-list-placeholder>
            </div>
            <empty-list-placeholder v-else-if="channels"></empty-list-placeholder>
        </loading-cover>
        </div>
    </div>
</template>

<script>
    import ChannelFilters from "./channel-filters";
    import ChannelTile from "./channel-tile";
    import {mapState} from "pinia";
    import {useChannelsStore} from "@/stores/channels-store";

    export default {
        components: {ChannelTile, ChannelFilters},
        data() {
            return {
                filterFunction: () => true,
                compareFunction: () => -1,
            };
        },
        computed: {
            ...mapState(useChannelsStore, {channels: 'list'}),
            filteredChannels() {
                const filteredChannels = this.channels
                    .filter(this.filterFunction)
                    .filter((channel) => !channel.config.hideInChannelsList);
                filteredChannels.sort(this.compareFunction);
                return filteredChannels;
            },
        },
    };
</script>
<style lang="scss">

@import "../styles/variables.scss";

 .h1{
    text-align: center;
    color: white;
  }
  .left-right-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
}


.channels-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 30px;
        padding: 20px;
        margin: 0 auto;
        max-width: 1400px;
    }
    
    .channel-wrapper {
        position: relative;
        min-height: 200px;
        border-radius: 12px;
        overflow: hidden;
        
       
    }
    
    .channel-tile {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 2;
        background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%);
        backdrop-filter: blur(12px);
        border-radius: 12px;
    }
  </style>
