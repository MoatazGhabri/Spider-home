<template class="template">
    <div class="body">
        <div>
            <loading-cover :loading="!devices">
                <div class="dashboard-container">
                    <!-- Feature Cards Section -->
                    <div class="dashboard-highlights">
                        <div class="card-wrapper">
                        <square-link class="feature-card io-devices">
                            <router-link to="/iodevices" class="feature-content">
                                <div class="icon-wrapper">
                                    <i class="pe-7s-plug feature-icon"></i>
                                    <div class="icon-pulse"></div>
                                </div> 
                                <h2 class="feature-title">i/o Devices</h2>
                                <p class="feature-description">Manage all your connected devices</p>
                                <div class="hover-effect"></div>
                            </router-link>
                       
                        </square-link>
                        <div class="border-light"></div>
</div>
<div class="card-wrapper">
                        <square-link class="feature-card channels">
                            <router-link to="/channels" class="feature-content">
                                <div class="icon-wrapper">
                                    <i class="pe-7s-settings feature-icon"></i>
                                    <div class="gear-rotation"></div>
                                </div>
                                <h2 class="feature-title">Channels</h2>
                                <p class="feature-description">Control your automation channels</p>
                                <div class="hover-effect"></div>
                            </router-link>
                        </square-link>
                        <div class="border-light"></div>
                        </div>
                    </div>

                    <!-- Possible Devices Carousel -->
                    <div v-if="filteredDevices && filteredDevices.length || (showPossibleDevices && !devices.length)" class="discovery-section">
                        <h2 class="section-title">Discover More Features</h2>
                        <div class="carousel-container">
                            <div class="carousel-wrapper">
                                <button type="button" class="carousel-button prev" @click="prevSlide">‹</button>
                                <div class="carousel">
                                    <div class="carousel-inner" :style="{ transform: `translateX(-${currentIndex * (100 / itemsPerSlide)}%)`, width: `${chunkedDevices.length * 100}%` }">
                                        <div v-for="(chunk, chunkIndex) in chunkedDevices" 
                                             :key="chunkIndex"
                                             class="carousel-slide">
                                            <div v-for="possibleDevice in chunk" 
                                                 :key="'possible' + possibleDevice.title"
                                                 class="carousel-item">
                                                 <div class="card-wrapper">
                                                <square-link class="discovery-card">
                                                    <a href="https://spiderhome.org/" target="_blank" class="card-content">
                                                        <div class="card-icon">
                                                            <i v-if="possibleDevice.icon" :class="possibleDevice.icon"></i>
                                                            <img v-else :src="'/assets/img/' + possibleDevice.image" :alt="$t(possibleDevice.title)">
                                                        </div>
                                                        <h3 class="card-title">{{ $t(possibleDevice.title) }}</h3>
                                                        <p class="card-description">{{ $t(possibleDevice.description) }}</p>
                                                        <div class="card-hover"></div>
                                                    </a>
                                                </square-link>
                                                <div class="border-light"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" class="carousel-button next" @click="nextSlide">›</button>
                            </div>
                            <div class="carousel-dots">
                                <span v-for="(dot, index) in totalSlides" 
                                      :key="index" 
                                      :class="{ active: currentIndex === index }"
                                      @click="goToSlide(index)"></span>
                            </div>
                        </div>
                    </div>

                    <empty-list-placeholder v-else-if="devices"></empty-list-placeholder>
                </div>
            </loading-cover>
        </div>
    </div>
</template>

<script>
    import EmptyListPlaceholder from "../../common/gui/empty-list-placeholder.vue";
    import {mapState, mapStores} from "pinia";
    import {useDevicesStore} from "@/stores/devices-store";
    
    export default {
        components: {
            EmptyListPlaceholder,
        },
        data() {
            return {
                filterFunction: () => true,
                compareFunction: () => -1,
                currentIndex: 0,
                itemsPerSlide: 3, 
                possibleDevices: [
                {
                        icon: 'pe-7s-light',
                        title: 'Lighting',
                        description: 'You can operate the lights in your home or office',
                    },
                    {
                        image: 'thermometer.svg',
                        title: 'Temperature',
                        description: '...you can monitor temperature',
                    },
                    {
                        image: 'gate.svg',
                        title: 'Doors and gates',
                        description: '...open gateways, gates or doors',
                    },
                    {
                        image: 'window-rollers.svg',
                        title: 'Roller shutters',
                        description: '...open and shut roller shutters',
                    },
                    {
                        icon: 'pe-7s-radio',
                        title: 'Home appliances',
                        description: '...or control home appliances',
                    },
                    {
                        icon: 'pe-7s-smile',
                        title: 'And more',
                        description: 'All the above and many more can be done from your phone or tablet',
                    },
                    {
                        icon: 'pe-7s-plane',
                        title: 'From anywhere',
                        description: 'SPIDER HOME is available from anywhere at any time, so do not worry, if you forget to turn the lights off next time',
                    },
                    {
                        icon: 'pe-7s-light',
                        title: 'Lighting',
                        description: 'You can operate the lights in your home or office',
                    },
                    {
                        image: 'thermometer.svg',
                        title: 'Temperature',
                        description: '...you can monitor temperature',
                    },
                ],
            };
        },
        beforeMount() {
            this.devicesStore.fetchAll(true);
        },
        computed: {
            showPossibleDevices() {
                return this.filteredDevices;
            },
            ...mapStores(useDevicesStore),
            ...mapState(useDevicesStore, {devices: 'list'}),
            filteredDevices() {
                const filteredDevices = this.devices ? this.devices.filter(this.filterFunction) : this.devices;
                if (filteredDevices) {
                    filteredDevices.sort(this.compareFunction);
                }
                return filteredDevices;
            },
            chunkedDevices() {
                const chunks = [];
                for (let i = 0; i < this.possibleDevices.length; i += this.itemsPerSlide) {
                    chunks.push(this.possibleDevices.slice(i, i + this.itemsPerSlide));
                }
                return chunks;
            },
            totalSlides() {
                return this.chunkedDevices.length;
            }
        },
        methods: {
            nextSlide() {
                this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
            },
            prevSlide() {
                this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
            },
            goToSlide(index) {
                this.currentIndex = index;
            }
        }
    };
</script>

<style lang="scss">
    @import "../../styles/variables";
   
    body {
        // background: linear-gradient(135deg, #1a2a4a 0%, #0d1a2f 100%);
        background-image: url('../assets/backgroundspiderhome.jpg');
        min-height: 100vh;
        padding: 20px 0;
    }

    .dashboard-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 20px;
    }

    /* Feature Cards Section */
    .dashboard-highlights {
        display: flex;
        justify-content: center;
        gap: 30px;
        margin: 40px 0;
        perspective: 1000px;
    }


    .card-wrapper {
        position: relative;
        flex: 1;
        min-width: 280px;
        max-width: 400px;
        height: 300px;
        
    }

    .border-light {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 16px;
        padding: 2px; 
        @supports (-webkit-mask: linear-gradient(white, white)) or (mask: linear-gradient(white, white)) {
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
  }
        pointer-events: none;
        animation: borderRotate 10s linear infinite;
        background: linear-gradient(90deg, $supla-red, $supla-blue, $supla-green, $supla-yellow);
        background-size: 400% 400%;
    }



    @keyframes borderRotate {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    .feature-card, .discovery-card {
        border: none; 
    }

    


    @media (max-width: 768px) {
        .card-wrapper {
            width: 100%;
            max-width: 350px;
            height: 350px;
        }
    }



    .feature-card {
        flex: 1;
        min-width: 280px;
        max-width: 400px;
        height: 300px;
        border-radius: 16px;
        overflow: hidden;
        position: relative;
        transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        // box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255,255,255,0.08);
        
        &:hover {
            //  transform: translateY(-8px) scale(1.03);
            //  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
            
            .hover-effect {
                opacity: 1;
            }
        } 
        
        &.io-devices {
            background: linear-gradient(135deg, rgba(74, 144, 226, 0.25) 0%, rgba(24, 100, 189, 0.25) 100%);
        }
        
        &.channels {
            background: linear-gradient(135deg, rgba(74, 144, 226, 0.25) 0%, rgba(24, 100, 189, 0.25) 100%);
        }
    }

    .feature-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 30px;
        text-decoration: none;
        color: white;
        position: relative;
        z-index: 2;
    }

    .icon-wrapper {
        position: relative;
        margin-bottom: 25px;
    }

    .feature-icon {
        font-size: 70px;
        color: white;
        position: relative;
        z-index: 2;
    }

   

    .feature-title {
        font-size: 24px;
        margin: 0 0 12px 0;
        font-weight: 600;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .feature-description {
        font-size: 16px;
        opacity: 0.85;
        margin: 0;
        text-align: center;
        max-width: 80%;
        line-height: 1.5;
    }

    .hover-effect {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.4s ease;
        z-index: 1;
    }

   
    .discovery-section {
        margin: 60px auto;
        max-width: 1200px;
    }

    .section-title {
        text-align: center;
        color: white;
        margin-bottom: 30px;
        font-size: 28px;
        font-weight: 500;
        position: relative;
        
        &::after {
            content: '';
            display: block;
            width: 80px;
            height: 3px;
            background: $supla-red;
            margin: 15px auto 0;
            border-radius: 3px;
        }
    }

    .carousel-container {
        position: relative;
        padding: 0 40px;
    }

    .carousel-wrapper {
        display: flex;
        align-items: center;
    }

    .carousel {
        overflow: hidden;
        width: 100%;
        margin: 0 15px;
    }

    .carousel-inner {
        display: flex;
        transition: transform 0.5s ease;
    }

    .carousel-slide {
        display: flex;
        width: 100%;
    }

    .carousel-item {
        flex: 0 0 calc(100% / 3);
        padding: 0 15px;
        box-sizing: border-box;
    }

    .discovery-card {
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
        border-radius: 12px;
        backdrop-filter: blur(10px);
        height: 100%;
        width: 100%;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        border: 1px  $supla-blue;
        
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            
            .card-hover {
                opacity: 1;
            }
        }
    }

    .card-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px 20px;
        text-decoration: none;
        color: white;
        height: 100%;
        box-sizing: border-box;
        position: relative;
        z-index: 2;
    }

    .card-icon {
        margin-bottom: 20px;
        
        i {
            font-size: 50px;
            color: rgba(255,255,255,0.9);
        }
        
        img {
            width: 50px;
            height: auto;
            filter: brightness(0) invert(1);
            opacity: 0.9;
        }
    }

    .card-title {
        font-size: 18px;
        margin: 0 0 10px 0;
        font-weight: 500;
        text-align: center;
    }

    .card-description {
        font-size: 14px;
        opacity: 0.85;
        margin: 0;
        text-align: center;
        line-height: 1.5;
    }

    .card-hover {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1;
    }

    /* Carousel Navigation */
    .carousel-button {
        background: rgba(255, 255, 255, 0.15);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        color: white;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 1;
        backdrop-filter: blur(5px);
        
        &:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: scale(1.1);
        }
    }

    .carousel-dots {
        display: flex;
        justify-content: center;
        margin-top: 25px;
        
        span {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            margin: 0 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            
            &.active {
                background: $supla-red;
                transform: scale(1.3);
            }
        }
    }

    /* Animations */
    @keyframes pulse {
        0% { transform: scale(0.95); opacity: 0.7; }
        50% { transform: scale(1.05); opacity: 0.9; }
        100% { transform: scale(0.95); opacity: 0.7; }
    }

    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes rotateReverse {
        from { transform: rotate(0deg); }
        to { transform: rotate(-360deg); }
    }

   
    @media (max-width: 1024px) {
        .carousel-item {
            flex: 0 0 50%;
        }
    }

    @media (max-width: 768px) {
        .dashboard-highlights {
            flex-direction: column;
            align-items: center;
        }
        
        .feature-card {
            width: 100%;
            max-width: 350px;
            margin-bottom: 20px;
            max-height: 350px;
        }
        
        .carousel-item {
            flex: 0 0 100%;
        }
    }

    @media (max-width: 480px) {
        .feature-title {
            font-size: 22px;
        }
        
        .feature-description {
            font-size: 15px;
        }
        
        .section-title {
            font-size: 24px;
        }
        
        .carousel-container {
            padding: 0 20px;
        }
    }
</style>