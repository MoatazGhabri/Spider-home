<template>
    <div class="feature-showcase">
      <div class="feature-grid">
        <router-link to="/channels">
          <div
            class="feature-card fade-in"
            :style="{ animationDelay: '0.2s' }"
            @click="() => {}"
          >
            <div class="icon-wrapper">
              <CircuitBoard class="icon"/>
            </div>
            <div class="text-content">
              <h3>Channels</h3>
              <p>Control your automation channels</p> 
            </div>
          </div>
        </router-link>
        <router-link to="/iodevices">
          <div
            class="feature-card fade-in"
            :style="{ animationDelay: '0.4s' }"
            @click="() => {}"
          >
            <div class="icon-wrapper">
              <Cpu class="icon" />
            </div>
            <div class="text-content">
              <h3>I/O Devices</h3>
              <p>Manage all your connected devices</p>
            </div>
          </div>
        </router-link>
      </div>
      
      <h2 class="heading">Discover More Features</h2>
  
      <div class="carousel">
        <div class="carousel-inner">
          <div class="carousel-track" :style="{ transform: `translateX(-${activeIndex * 100}%)` }">
            <div class="carousel-slide" v-for="(slideGroup, index) in slides" :key="index">
              <div class="slide-content">
                <a v-for="(feature, idx) in slideGroup" :key="idx" :href="feature.link" target="_blank" class="feature-link">
                  <FeatureCard
                    :icon="feature.icon"
                    :title="feature.title"
                    :description="feature.description"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
  
        <button type="button" class="nav-button left" @click="goToPrev">
          <ArrowLeft size="24" />
        </button>
        <button type="button" class="nav-button right" @click="goToNext">
          <ArrowRight size="24" />
        </button>
  
        <div class="indicators">
          <button type="button"
            v-for="(_, index) in slides"
            :key="index"
            @click="goToSlide(index)"
            :class="['indicator', { active: index === activeIndex }]"
          ></button>
        </div>
      </div>
      <Dashboard  class="Dashboard"/>
    </div>
     
  </template>
  
  <script>
  import { ref } from 'vue'
  
  import {  ArrowLeft, 
    ArrowRight,  
    Lightbulb, 
    Thermometer, 
    DoorOpen, 
    Sun, 
    Plug, 
    Globe, 
    CircuitBoard,
      Cpu,
    Smartphone} from 'lucide-vue'
    import Dashboard from '../list/dash.vue';
//   import { Channels, HomeIcon, RollerShutter, Smile } from './index'
  
  const FeatureCard = {
    props: ['icon', 'title', 'description'],
    template: `
      <div class="feature-card">
        <div class="icon-wrapper">
          <component :is="icon" class="icon" />
        </div>
        <div class="text-content">
          <h3>{{ title }}</h3>
          <p>{{ description }}</p>
        </div>
      </div>
    `
  }
  
  export default {
    name: 'FeatureShowcase',
    components: {
      Dashboard,
        ArrowLeft,
      ArrowRight,
     
      CircuitBoard,
      Cpu,
    
      FeatureCard
    },
    setup() {
      const activeIndex = ref(0)
  
      const slides = [
        [
          {
            icon: Lightbulb,
            title: 'Lighting',
            description: 'You can operate the lights in your home or office',
            link: 'https://spiderhome.org/produits/controler-leclairage/'
          },
          {
            icon: Thermometer,
            title: 'Temperature ',
            description: '...you can monitor temperature',
            link: 'https://spiderhome.org/produits/'
          }
        ],
        [
          { 
            icon: DoorOpen,
            title: 'Doors and gates',
            description: '...open gateways, gates or doors',
            link: 'https://spiderhome.org/produits/controle-les-portails/'
          },
          {
            icon: Sun,
            title: 'Roller shutters',
            description: '...open and shut roller shutters',
            link: 'https://spiderhome.org/produits/controlez-les-stores/'
          }
        ],
        [
          {
            icon: Plug,
            title: 'Home appliances',
            description:  '...or control home appliances',
            link: 'https://spiderhome.org/produits/electronique-de-commande/'
          },
          {
            icon: Globe,
            title: 'And more',
            description: 'All the above and many more can\n be done from your phone or tablet',
            link: 'https://spiderhome.org/'
          }
        ],
        [
          {
            icon: Smartphone,
            title: 'From anywhere',
            description: 'Is available from anywhere at any time,\n so do not worry,\n if you forget to turn the lights off next time',
            link: 'https://spiderhome.org/ou-acheter/'
          },
          
        ]
      ]
  
      const goToNext = () => {
        activeIndex.value = (activeIndex.value + 1) % slides.length
      }
  
      const goToPrev = () => {
        activeIndex.value = (activeIndex.value - 1 + slides.length) % slides.length
      }
  
      const goToSlide = (index) => {
        activeIndex.value = index
      }
  
      return {
        activeIndex,
        goToNext,
        goToPrev,
        goToSlide,
        slides,
       
      }
    }
  }
  </script>
  
  <style>

.text-content p {
  white-space: pre-line;
}
  /* .feature-showcase {
    height: calc(100vh - 4rem);
    overflow-y: auto;
    padding: 3rem 2rem;
    max-width: 1200px;
    margin: auto;
  } */

  .feature-showcase {
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
}
  
  .feature-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 6rem;
  }
  
  @media (min-width: 768px) {
    .feature-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .feature-card {
    background: #17B1B1;
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .feature-card:hover {
    background: #149999;
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  .icon-wrapper {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .icon {
    color: white;
    width: 50px;
    height: 50px;
  }
  
  .text-content h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
 
  .text-content p {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
  }
  
  
.heading {
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

.heading::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 3px; 
  background: linear-gradient(90deg, transparent 0%, #f7495e 50%, transparent 100%);
}
   
  
  .carousel {
    position: relative;
    width: 100%;
    margin: 2rem 0;
    overflow: hidden;
  }
  
  .carousel-inner {
    width: 100%;
    overflow: hidden;
  }
  
  .carousel-track {
    display: flex;
    transition: transform 0.5s ease-in-out;
    width: 100%;
  }
  
  .carousel-slide {
    min-width: 100%;
    flex-shrink: 0;
    padding: 0 1rem;
    box-sizing: border-box;
  }
  
  .slide-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .feature-link {
    text-decoration: none;
    display: block;
  }
  
  @media (min-width: 768px) {
    .slide-content {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.9);
    color: #17B1B1;
    padding: 0.5rem;
    border-radius: 999px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: background 0.3s;
    border: none;
    cursor: pointer;
    z-index: 10;
  }
  
  .nav-button:hover {
    background: white;
  }
  
  .nav-button.left {
    left: 0;
  }
  
  .nav-button.right {
    right: 0;
  }
  
  .indicators {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
  
  .indicator {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #ccc;
    transition: background 0.3s;
    border: none;
    cursor: pointer;
  }
  
  .indicator.active {
    background: #17B1B1;
  }
  
  .fade-in {
    animation: fadeIn 0.8s ease forwards;
    opacity: 0;
  }
  
  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
  /* Hide scrollbar */
  ::-webkit-scrollbar {
    display: none;
  }
  </style>