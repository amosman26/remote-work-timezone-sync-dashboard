<template>
  <div class="card p-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      Live Time Zones
    </h2>
    
    <div class="space-y-4">
      <div
        v-for="member in allMembers"
        :key="member.id"
        class="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <div class="relative">
            <img
              :src="member.avatar"
              :alt="member.name"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div
              :class="[
                'absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-dark-700',
                `status-${member.status}`
              ]"
            ></div>
          </div>
          
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">
              {{ member.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ member.location }}
            </p>
          </div>
        </div>

        <div class="text-right">
          <div class="text-lg font-mono font-semibold text-gray-900 dark:text-white">
            {{ getLocalTime(member.timezone) }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ getLocalDate(member.timezone) }}
          </div>
        </div>
      </div>

      <div v-if="allMembers.length === 0" class="text-center py-8">
        <svg class="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-gray-500 dark:text-gray-400">
          No team members to display
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { format } from 'date-fns'

const props = defineProps({
  teams: {
    type: Array,
    default: () => []
  }
})

const currentTime = ref(new Date())
let timeInterval = null

const allMembers = computed(() => {
  return props.teams.reduce((members, team) => {
    return members.concat(team.members)
  }, [])
})

const getLocalTime = (timezone) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(currentTime.value)
  } catch (error) {
    console.error('Invalid timezone:', timezone, error)
    return '--:--:--'
  }
}

const getLocalDate = (timezone) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(currentTime.value)
  } catch (error) {
    console.error('Invalid timezone:', timezone, error)
    return 'Invalid Date'
  }
}

onMounted(() => {
  // Update time every second
  timeInterval = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>
