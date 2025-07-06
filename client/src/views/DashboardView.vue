<script setup>
import { ref, onMounted } from 'vue'
import { teamService } from '../services/teamService.js'
import DashboardStats from '../components/DashboardStats.vue'
import TeamMap from '../components/TeamMap.vue'
import TimezoneClocks from '../components/TimezoneClocks.vue'

const teams = ref([])
const loading = ref(true)
const error = ref(null)

const fetchTeams = async () => {
  try {
    loading.value = true
    error.value = null
    teams.value = await teamService.getAllTeams()
  } catch (err) {
    error.value = 'Failed to load teams. Please check if the server is running.'
    console.error('Error fetching teams:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTeams()
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Remote Work Dashboard
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Monitor your global team, track time zones, and find the perfect meeting slots for seamless collaboration.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-300">Loading team data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
        <p class="text-red-700 dark:text-red-400">{{ error }}</p>
        <button 
          @click="fetchTeams"
          class="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-8">
      <!-- Stats Overview -->
      <DashboardStats :teams="teams" />

      <!-- Main Dashboard Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Team Map -->
        <div class="xl:col-span-2">
          <TeamMap :teams="teams" />
        </div>

        <!-- Timezone Clocks -->
        <div class="xl:col-span-1">
          <TimezoneClocks :teams="teams" />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RouterLink
            to="/teams"
            class="p-4 border border-gray-200 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors group"
          >
            <div class="text-primary-600 dark:text-primary-400 mb-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <h3 class="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Manage Teams
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Add or update team members
            </p>
          </RouterLink>

          <RouterLink
            to="/meetings"
            class="p-4 border border-gray-200 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors group"
          >
            <div class="text-primary-600 dark:text-primary-400 mb-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Schedule Meeting
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Find optimal meeting times
            </p>
          </RouterLink>

          <button
            @click="fetchTeams"
            class="p-4 border border-gray-200 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors group"
          >
            <div class="text-primary-600 dark:text-primary-400 mb-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <h3 class="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Refresh Data
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Update team information
            </p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
