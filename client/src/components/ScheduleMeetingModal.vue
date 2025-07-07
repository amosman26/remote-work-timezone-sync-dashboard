<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-dark-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Schedule Meeting
          </h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Meeting Time Summary -->
        <div class="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 mb-6">
          <h3 class="font-medium text-primary-900 dark:text-primary-100 mb-2">
            Selected Time Slot
          </h3>
          <p class="text-primary-700 dark:text-primary-300">
            {{ capitalizeFirst(meetingTime.day) }}, {{ meetingTime.hour }}:00 UTC
          </p>
          <p class="text-sm text-primary-600 dark:text-primary-400 mt-1">
            {{ meetingTime.available_members.length }}/{{ meetingTime.total_members }} members available
          </p>
        </div>

        <!-- Meeting Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Meeting Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meeting Title *
            </label>
            <input
              v-model="formData.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter meeting title"
            />
          </div>

          <!-- Meeting Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter meeting description"
            ></textarea>
          </div>

          <!-- Duration -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duration (minutes)
            </label>
            <select
              v-model="formData.duration"
              class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option :value="30">30 minutes</option>
              <option :value="60">1 hour</option>
              <option :value="90">1.5 hours</option>
              <option :value="120">2 hours</option>
            </select>
          </div>

          <!-- Organizer -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Organizer *
            </label>
            <select
              v-model="formData.organizer"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select organizer...</option>
              <option
                v-for="member in members"
                :key="member.id"
                :value="member.id"
              >
                {{ member.name }}
              </option>
            </select>
          </div>

          <!-- Attendees -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attendees
            </label>
            <div class="space-y-2 max-h-32 overflow-y-auto">
              <label
                v-for="member in members"
                :key="member.id"
                class="flex items-center space-x-3"
              >
                <input
                  type="checkbox"
                  :value="member.id"
                  v-model="formData.attendees"
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

          <!-- Local Times for Attendees -->
          <div v-if="formData.attendees.length > 0" class="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Local Times for Attendees
            </h4>
            <div class="space-y-1">
              <div
                v-for="member in selectedAttendees"
                :key="member.id"
                class="flex justify-between text-sm"
              >
                <span class="text-gray-700 dark:text-gray-300">{{ member.name }}</span>
                <span class="text-gray-900 dark:text-white font-mono">
                  {{ getLocalTimeForMember(member) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 btn-primary"
            >
              Schedule Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  meetingTime: {
    type: Object,
    required: true
  },
  members: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'scheduled'])

const formData = ref({
  title: '',
  description: '',
  duration: 60,
  organizer: '',
  attendees: []
})

const selectedAttendees = computed(() => {
  return props.members.filter(member => formData.value.attendees.includes(member.id))
})

const getLocalTimeForMember = (member) => {
  try {
    // Calculate local time based on UTC meeting time and member's timezone
    const utcDate = new Date()
    utcDate.setUTCHours(props.meetingTime.hour, 0, 0, 0)
    
    return new Intl.DateTimeFormat('en-US', {
      timeZone: member.timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(utcDate)
  } catch (error) {
    return '--:--'
  }
}

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const handleSubmit = () => {
  const meetingData = {
    ...formData.value,
    day: props.meetingTime.day,
    hour: props.meetingTime.hour,
    utc_time: `${props.meetingTime.day} ${props.meetingTime.hour}:00 UTC`
  }
  
  emit('scheduled', meetingData)
}

onMounted(() => {
  // Pre-select all available members as attendees
  formData.value.attendees = props.meetingTime.available_members.map(m => m.id)
  
  // Set first member as default organizer
  if (props.members.length > 0) {
    formData.value.organizer = props.members[0].id
  }
})
</script>
