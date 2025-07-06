<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Total Teams -->
    <div class="card p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30">
          <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ teams.length }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">Teams</p>
        </div>
      </div>
    </div>

    <!-- Total Members -->
    <div class="card p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
          <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ totalMembers }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">Members</p>
        </div>
      </div>
    </div>

    <!-- Online Members -->
    <div class="card p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </svg>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ onlineMembers }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">Online</p>
        </div>
      </div>
    </div>

    <!-- Timezones -->
    <div class="card p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ uniqueTimezones }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">Timezones</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  teams: {
    type: Array,
    default: () => []
  }
})

const totalMembers = computed(() => {
  return props.teams.reduce((total, team) => total + team.members.length, 0)
})

const onlineMembers = computed(() => {
  return props.teams.reduce((total, team) => {
    return total + team.members.filter(member => member.status === 'online').length
  }, 0)
})

const uniqueTimezones = computed(() => {
  const timezones = new Set()
  props.teams.forEach(team => {
    team.members.forEach(member => {
      timezones.add(member.timezone)
    })
  })
  return timezones.size
})
</script>
