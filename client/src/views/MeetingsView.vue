<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Meeting Scheduler</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-1">
        Find optimal meeting times across different time zones
      </p>
    </div>

    <!-- Meeting Time Finder -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Configuration Panel -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Meeting Configuration
        </h2>
        
        <div class="space-y-4">
          <!-- Team Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Team
            </label>
            <select
              v-model="selectedTeamId"
              @change="onTeamChange"
              class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Choose a team...</option>
              <option v-for="team in teams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>

          <!-- Member Selection -->
          <div v-if="selectedTeam">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Members
            </label>
            <div class="space-y-2 max-h-32 overflow-y-auto">
              <label
                v-for="member in selectedTeam.members"
                :key="member.id"
                class="flex items-center space-x-3"
              >
                <input
                  type="checkbox"
                  :value="member.id"
                  v-model="selectedMemberIds"
                  class="rounded border-gray-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500"
                />
                <div class="flex items-center space-x-2 flex-1">
                  <img
                    :src="member.avatar"
                    :alt="member.name"
                    class="w-6 h-6 rounded-full object-cover"
                  />
                  <span class="text-sm text-gray-900 dark:text-white">{{ member.name }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">({{ member.timezone }})</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Meeting Duration -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration (minutes)
            </label>
            <select
              v-model="meetingDuration"
              class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option :value="30">30 minutes</option>
              <option :value="60">1 hour</option>
              <option :value="90">1.5 hours</option>
              <option :value="120">2 hours</option>
            </select>
          </div>

          <!-- Find Meeting Times Button -->
          <button
            @click="findMeetingTimes"
            :disabled="!canFindMeetings"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="searchingMeetings" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {{ searchingMeetings ? 'Finding Times...' : 'Find Meeting Times' }}
          </button>
        </div>
      </div>

      <!-- Results Panel -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Meeting Suggestions
        </h2>

        <div v-if="!meetingSuggestions.length && !searchingMeetings" class="text-center py-8">
          <svg class="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p class="text-gray-500 dark:text-gray-400">
            Configure your meeting and click "Find Meeting Times" to see suggestions
          </p>
        </div>

        <div v-else-if="searchingMeetings" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-300">Finding optimal meeting times...</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="(suggestion, index) in meetingSuggestions.slice(0, 5)"
            :key="index"
            class="p-4 border border-gray-200 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer"
            @click="selectMeetingTime(suggestion)"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">
                  {{ capitalizeFirst(suggestion.day) }}, {{ suggestion.hour }}:00 UTC
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {{ suggestion.available_members.length }}/{{ suggestion.total_members }} members available
                </p>
              </div>
              <div class="text-right">
                <div
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    suggestion.availability_percentage >= 80
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : suggestion.availability_percentage >= 60
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  ]"
                >
                  {{ Math.round(suggestion.availability_percentage) }}% available
                </div>
              </div>
            </div>

            <div class="mt-3">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="member in suggestion.available_members"
                  :key="member.id"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300"
                >
                  {{ member.name }} ({{ member.local_time }})
                </span>
              </div>
            </div>
          </div>

          <div v-if="meetingSuggestions.length === 0" class="text-center py-4">
            <p class="text-gray-500 dark:text-gray-400">
              No suitable meeting times found. Try adjusting your criteria.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule Meeting Modal -->
    <ScheduleMeetingModal
      v-if="selectedMeetingTime"
      :meeting-time="selectedMeetingTime"
      :members="selectedMembers"
      @close="selectedMeetingTime = null"
      @scheduled="onMeetingScheduled"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { teamService, meetingService } from '../services/teamService.js'
import ScheduleMeetingModal from '../components/ScheduleMeetingModal.vue'

const teams = ref([])
const selectedTeamId = ref('')
const selectedMemberIds = ref([])
const meetingDuration = ref(60)
const meetingSuggestions = ref([])
const searchingMeetings = ref(false)
const selectedMeetingTime = ref(null)

const selectedTeam = computed(() => {
  return teams.value.find(team => team.id === selectedTeamId.value)
})

const selectedMembers = computed(() => {
  if (!selectedTeam.value) return []
  return selectedTeam.value.members.filter(member => selectedMemberIds.value.includes(member.id))
})

const canFindMeetings = computed(() => {
  return selectedMembers.value.length >= 2
})

const fetchTeams = async () => {
  try {
    teams.value = await teamService.getAllTeams()
  } catch (error) {
    console.error('Error fetching teams:', error)
  }
}

const onTeamChange = () => {
  selectedMemberIds.value = []
  meetingSuggestions.value = []
}

const findMeetingTimes = async () => {
  if (!canFindMeetings.value) return

  try {
    searchingMeetings.value = true
    const response = await meetingService.getMeetingSuggestions(
      selectedMembers.value,
      meetingDuration.value
    )
    meetingSuggestions.value = response.suggestions || []
  } catch (error) {
    console.error('Error finding meeting times:', error)
    meetingSuggestions.value = []
  } finally {
    searchingMeetings.value = false
  }
}

const selectMeetingTime = (suggestion) => {
  selectedMeetingTime.value = suggestion
}

const onMeetingScheduled = (meetingData) => {
  console.log('Meeting scheduled:', meetingData)
  selectedMeetingTime.value = null
  // You could show a success notification here
}

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

onMounted(() => {
  fetchTeams()
})
</script>
