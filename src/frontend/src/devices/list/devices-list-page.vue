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
                            <div class="border-light"></div>
                        </square-link>
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
                            <div class="border-light"></div>
                        </square-link>
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
                                                            <i v-if="possibleDevice.icon" :class="possibleDevice.icon">{{ possibleDevice.icon }}</i>
                                                            <img v-if="possibleDevice.image" :src="require(`@/assets/img/${possibleDevice.image}`)" :alt="possibleDevice.title">

                                                        </div>
                                                        <h3 class="card-title">{{ $t(possibleDevice.title) }}</h3>
                                                        <p class="card-description">{{ $t(possibleDevice.description) }}</p>
                                                        <div class="card-hover"></div>
                                                    </a>
                                                    <div class="border-light"></div>
                                                </square-link>
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
        icon: '💡', // Light bulb emoji
        title: 'Lighting',
        description: 'You can operate the lights in your home or office',
        link:'ttps://spiderhome.org/produits/controler-leclairage/',
    },
    {
        icon: '🌡️', // Thermometer emoji
        title: 'Temperature',
        description: '...you can monitor temperature',
        link:'https://spiderhome.org/produits/',
    },
    {
        icon: '🚪', // Door emoji
        title: 'Doors and gates',
        description: '...open gateways, gates or doors',
        link:'https://spiderhome.org/produits/controle-les-portails/',
    },
    {
        image: 'volet.png', // Window emoji
        title: 'Roller shutters',
        description: '...open and shut roller shutters',
        link:'https://spiderhome.org/produits/controlez-les-stores/',
    },
    {
        image: 'radio.png', // Plug emoji
        title: 'Home appliances',
        description: '...or control home appliances',
        link:'https://spiderhome.org/produits/electronique-de-commande/',
    },
    {
        icon: '😊', // Smile emoji
        title: 'And more',
        description: 'All the above and many more can be done from your phone or tablet',
        link:'https://spiderhome.org/',
    },
    {
        icon: '✈️', // Airplane emoji
        title: 'From anywhere',
        description: 'SPIDER HOME is available from anywhere at any time, so do not worry, if you forget to turn the lights off next time',
        link:'https://spiderhome.org/ou-acheter/',
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
        background: rgba(51, 176, 223, 0.05);
        min-height: 100vh;
        padding: 20px 0;
    }

    .dashboard-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 20px;
    }

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

    .feature-card {
        position: relative;
        border: none;
        height: 100%;
        width: 100%;
        
        .border-light {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 16px;
            padding: 4px; /* Increased stroke size */
            pointer-events: none;
            animation: borderRotate 10s linear infinite;
            background: linear-gradient(90deg, $supla-red, $supla-blue, $supla-red, $supla-red);
            background-size: 400% 400%;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 1;
            
            @supports (-webkit-mask: none) or (mask: none) {
                -webkit-mask: 
                    linear-gradient(#fff 0 0) content-box, 
                    linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
            }
        }
        
        &:hover {
            .border-light {
                opacity: 1;
            }
        }
    }
    .discovery-card {
        position: relative;
        border: none;
        height: 100%;
        width: 100%;
        
        .border-light {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 16px;
            padding: 4px; /* Increased stroke size */
            pointer-events: none;
            animation: borderRotate 10s linear infinite;
            background: linear-gradient(90deg, $supla-red, $supla-blue, $supla-red, $supla-red);
            background-size: 400% 400%;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 1;
            
            @supports (-webkit-mask: none) or (mask: none) {
                -webkit-mask: 
                    linear-gradient(#fff 0 0) content-box, 
                    linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
            }
        }
        
        &:hover {
            .border-light {
                opacity: 1;
            }
        }
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

    @media (max-width: 768px) {
        .card-wrapper {
            width: 100%;
            max-width: 350px;
            height: 350px;
        }
    }

    .feature-card {
        background: linear-gradient(135deg, #218fb8 0%, #1a7a9d 100%);
        color: white;
        padding: 3.5rem 2.5rem;
        border-radius: 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.25rem;
        min-height: 200px;
        transition: all 0.4s ease;
        box-shadow: 0 10px 40px rgba(33, 143, 184, 0.25);
        position: relative;
        overflow: hidden;
    }
    
    .feature-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, transparent 70%);
        pointer-events: none;
    }

    .feature-card:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 20px 50px rgba(33, 143, 184, 0.35);
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
  color: #0c103d;
  margin: 0 0 3rem;
  font-size: 2.25rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, #f7495e 50%, transparent 100%);
}
   

    .carousel-container {
        position: relative;
        padding: 0 100px;
    }

    .carousel-wrapper {
        display: flex;
        align-items: center;
    }

    .carousel {
        overflow: hidden;
        width: 100%;
        margin: 3 15px;
    }

    .carousel-inner {
        display: flex;
        transition: transform 0.5s ease;
    }

    
    .carousel-slide {
    display: flex;
    width: 100%;
    padding: 10px 0; /* Add some vertical padding */
}

    .carousel-item {
        flex: 0 0 calc(100% / 3);
        padding: 0 15px;
        box-sizing: border-box;
    }

    .discovery-card {
        background: linear-gradient(135deg, #33b0df 0%, #218fb8 100%);
        color: white;
        padding: 2.5rem 2rem; 
        margin: 10px 0;
        border-radius: 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.25rem;
        min-height: 250px;
        transition: all 0.3s ease;
        box-shadow: 0 8px 30px rgba(51, 176, 223, 0.2);
        position: relative;
        overflow: hidden;
    }
    
    .discovery-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%);
        pointer-events: none;
    }

    .discovery-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 40px rgba(51, 176, 223, 0.3);
    }
    
    .card-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px 20px;
        text-decoration: none;
        color: $supla-blue;
        height: 100%;
        box-sizing: border-box;
        position: relative;
        z-index: 2;
    }

    .card-icon {
    margin-bottom: 20px;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    i {
        font-size: 50px;
        line-height: 1;
        font-style: normal;
    }
    
    img {
        width: 50px;
        height: 50px;
        object-fit: contain;
       
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
        background: $supla-blue;
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
            background: $supla-blue-li;
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
            background: $supla-blue-li;
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
       .discovery-card{
            width: 50%;
            height: 50%;
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
        .discovery-card{
            width: 50%;
            height: 50%;
        }
    }
    
</style>