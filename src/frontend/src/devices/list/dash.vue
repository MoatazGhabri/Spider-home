<template>
    <div class="dashboard-container">
      <!-- Header -->
      <h1 class="dashboard-header">Tableau de bord</h1>
  
      <!-- Top Stats Cards -->
      <div class="stats-grid">
        <!-- Carte Température -->
        <div class="stat-card">
          <p class="stat-label">Température</p>
          <p class="stat-subtext">Intérieure en temps réel</p>
          <div class="stat-value-container">
            <span class="stat-value">{{ indoorTemp }}°C</span>
            <span class="stat-change" :class="tempTrendClass">
              {{ tempTrend }} depuis hier
            </span>
          </div>
        </div>
  
        <!-- Carte Météo -->
        <div class="stat-card">
          <p class="stat-label">Météo</p>
          <p class="stat-subtext">{{ weatherDescription }}</p>
          <div class="stat-value-container">
            <img 
              :src="weatherIcon" 
              alt="Icône météo" 
              class="weather-icon"
              v-if="weatherIcon"
            >
            <span class="stat-value">{{ outdoorTemp }}°C</span>
          </div>
        </div>
  
        <!-- Carte Appareils -->
        <div class="stat-card">
          <p class="stat-label">Appareils</p>
          <p class="stat-subtext">Status du réseau</p>
          <div class="stat-value-container">
            <span class="stat-value">{{ connectedDevices }}/{{ totalDevices }}</span>
            <span class="stat-change purple">En ligne</span>
          </div>
        </div>
      </div>
  
      <!-- Graphique -->
      <div class="graph-section">
        <h2 class="section-title">Historique température</h2>
        <div class="graph-container">
          <canvas ref="tempChart"></canvas>
        </div>
      </div>
  
      <!-- Appareils actifs -->
      <div class="devices-section">
        <h2 class="section-title">Appareils actifs</h2>
        <div class="devices-grid">
          <div 
            v-for="(room, index) in activeDevices" 
            :key="index" 
            class="device-card" 
            :class="room.color"
          >
            <p class="device-location">{{ room.name }}</p>
            <p class="device-count">{{ room.devices }} appareil(s) actif(s)</p>
            <span class="device-status">En ligne</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import Chart from 'chart.js/auto';
  
  export default {
    name: "Dash-board",
    setup() {
      // Données réactives
      const indoorTemp = ref(0);
      const outdoorTemp = ref(0);
      const tempTrend = ref('+0.0°');
      const tempTrendClass = ref('positive');
      const weatherDescription = ref('Chargement...');
      const weatherIcon = ref('');
      const connectedDevices = ref(0);
      const totalDevices = ref(0);
      const activeDevices = ref([]);
      const tempChart = ref(null);
  
      // Simuler des données de température intérieure
      const fetchIndoorTemperature = () => {
        // En production, vous utiliserez une vraie API
        const baseTemp = 22.5;
        const variation = (Math.random() * 2 - 1); // Variation aléatoire entre -1 et +1
        indoorTemp.value = parseFloat((baseTemp + variation).toFixed(1));
        
        // Simuler une tendance
        const trend = (Math.random() * 1 - 0.5).toFixed(1);
        tempTrend.value = `${trend > 0 ? '+' : ''}${trend}°`;
        tempTrendClass.value = trend > 0 ? 'positive' : 'negative';
        
        // Rafraîchir toutes les 10 secondes
        setTimeout(fetchIndoorTemperature, 10000);
      };
  
      // Récupérer la météo actuelle
      const fetchWeather = async () => {
        try {
          // Remplacez par votre clé API et votre ville
          const apiKey = '6d8c0b55eeffb09974680de7be072190';
          const city = 'sfax';
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${apiKey}`
          );
          
          const data = await response.json();
          outdoorTemp.value = Math.round(data.main.temp);
          weatherDescription.value = data.weather[0].description;
          weatherIcon.value = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        } catch (error) {
          console.error('Erreur météo:', error);
          weatherDescription.value = 'Données indisponibles';
        }
      };
  
      // Simuler des appareils connectés
      const simulateDevices = () => {
        totalDevices.value = 15;
        connectedDevices.value = 12 + Math.floor(Math.random() * 2); // 12 ou 13
        
        activeDevices.value = [
          { name: 'Salon', devices: 3, color: 'blue' },
          { name: 'Cuisine', devices: 2, color: 'purple' },
          { name: 'Chambre', devices: 1, color: 'yellow' }
        ];
      };
  
      // Initialiser le graphique
      const initChart = () => {
        if (tempChart.value) {
          const ctx = tempChart.value.getContext('2d');
          new Chart(ctx, {
            type: 'line',
            data: {
              labels: Array.from({length: 24}, (_, i) => `${i}h`),
              datasets: [{
                label: 'Température (°C)',
                data: Array.from({length: 24}, () => 20 + Math.random() * 5),
                borderColor: '#189ab4',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(24, 154, 180, 0.1)'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: false
                }
              }
            }
          });
        }
      };
  
      // Au montage du composant
      onMounted(() => {
        fetchIndoorTemperature();
        fetchWeather();
        simulateDevices();
        initChart();
        
        // Rafraîchir la météo toutes les heures
        setInterval(fetchWeather, 3600000);
      });
  
      return {
        indoorTemp,
        outdoorTemp,
        tempTrend,
        tempTrendClass,
        weatherDescription,
        weatherIcon,
        connectedDevices,
        totalDevices,
        activeDevices,
        tempChart
      };
    }
  };
  </script>
  
  <style scoped>
/* Base Container */
.dashboard-container {
  padding: 1.5rem;
  background-color: #f8fafc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header */
.dashboard-header {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

/* Stats Cards Container */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Individual Stat Card */
.stat-card {
  background-color: white;
  border-radius: 16px; /* More curved corners */
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); /* Softer shadow */
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05); /* Subtle border */
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12); /* Enhanced shadow on hover */
}

.stat-label {
  color: #334155;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.stat-subtext {
  color: #64748b;
  font-size: 0.85rem;
  opacity: 0.9;
}

.stat-value-container {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-change {
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background-color: rgba(5, 150, 105, 0.1); /* Light background for status */
}

/* Weather Icon */
.weather-icon {
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

/* Forecast Section */
.graph-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
  text-align: left;
}

/* Cities Cards */
.devices-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .devices-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.device-card {
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.device-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.device-location {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.device-count {
  color: #475569;
  font-size: 0.9rem;
  opacity: 0.9;
}

.device-status {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: rgba(5, 150, 105, 0.15);
  color: #059669;
}

/* Color Variants */
.blue {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
}

.purple {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
}

.yellow {
  background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%);
}

.orange {
  background: linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%);
}

.red {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

/* Status Colors */
.positive {
  color: #059669;
  background-color: rgba(5, 150, 105, 0.1);
}

.neutral {
  color: #d97706;
  background-color: rgba(217, 119, 6, 0.1);
}

.negative {
  color: #dc2626;
  background-color: rgba(220, 38, 38, 0.1);
}

/* Forecast Table */
.forecast-table {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.forecast-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.forecast-row:last-child {
  border-bottom: none;
}

.forecast-day {
  font-weight: 500;
  color: #334155;
}

.forecast-temp {
  font-weight: 600;
  color: #1e40af;
}

.forecast-desc {
  color: #64748b;
  font-size: 0.9rem;
}
</style>