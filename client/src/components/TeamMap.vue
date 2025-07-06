<template>
  <div class="card p-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      Team Locations
    </h2>
    
    <!-- Map Container -->
    <div ref="mapContainer" class="h-96 bg-gray-100 dark:bg-dark-700 rounded-lg overflow-hidden">
      <div v-if="!mapLoaded" class="h-full flex items-center justify-center">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-300">Loading map...</p>
        </div>
      </div>
    </div>

    <!-- Map Legend -->
    <div v-if="mapLoaded" class="mt-4 flex flex-wrap gap-4 text-sm">
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
        <span class="text-gray-600 dark:text-gray-300">Online</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <span class="text-gray-600 dark:text-gray-300">Away</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
        <span class="text-gray-600 dark:text-gray-300">Offline</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  teams: {
    type: Array,
    default: () => []
  }
})

const mapContainer = ref(null)
const map = ref(null)
const mapLoaded = ref(false)
const markers = ref([])

// Fix for default Leaflet markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const createCustomIcon = (status) => {
  const colors = {
    online: '#10B981',
    away: '#F59E0B',
    offline: '#6B7280'
  }
  
  const color = colors[status] || colors.offline
  
  return L.divIcon({
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>
    `,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  })
}

const initializeMap = () => {
  if (mapContainer.value && !map.value) {
    map.value = L.map(mapContainer.value, {
      zoomControl: true,
      attributionControl: true,
    }).setView([20, 0], 2)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map.value)

    mapLoaded.value = true
    addMarkersToMap()
  }
}

const addMarkersToMap = () => {
  if (!map.value) return

  // Clear existing markers
  markers.value.forEach(marker => map.value.removeLayer(marker))
  markers.value = []

  // Add markers for each team member
  props.teams.forEach(team => {
    team.members.forEach(member => {
      if (member.coordinates && member.coordinates.length === 2) {
        const [lat, lng] = member.coordinates
        
        const marker = L.marker([lat, lng], {
          icon: createCustomIcon(member.status)
        })
        .bindPopup(`
          <div class="p-2">
            <div class="flex items-center space-x-2 mb-2">
              <img src="${member.avatar}" alt="${member.name}" class="w-8 h-8 rounded-full object-cover" />
              <div>
                <h4 class="font-medium text-gray-900">${member.name}</h4>
                <p class="text-sm text-gray-600">${member.role}</p>
              </div>
            </div>
            <div class="text-sm text-gray-600">
              <p><strong>Location:</strong> ${member.location}</p>
              <p><strong>Timezone:</strong> ${member.timezone}</p>
              <p><strong>Status:</strong> <span class="capitalize">${member.status}</span></p>
            </div>
          </div>
        `)
        
        marker.addTo(map.value)
        markers.value.push(marker)
      }
    })
  })

  // Fit map to show all markers if there are any
  if (markers.value.length > 0) {
    const group = new L.featureGroup(markers.value)
    map.value.fitBounds(group.getBounds().pad(0.1))
  }
}

// Watch for changes in teams data
watch(() => props.teams, () => {
  if (mapLoaded.value) {
    addMarkersToMap()
  }
}, { deep: true })

onMounted(() => {
  // Small delay to ensure DOM is ready
  setTimeout(initializeMap, 100)
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
    map.value = null
  }
})
</script>

<style scoped>
/* Override Leaflet popup styles for dark mode */
:global(.leaflet-popup-content-wrapper) {
  background: white;
  border-radius: 8px;
}

:global(.leaflet-popup-tip) {
  background: white;
}

/* Custom marker styles */
:global(.custom-marker) {
  background: none !important;
  border: none !important;
}
</style>
