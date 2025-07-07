<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-dark-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ member ? 'Edit Member' : 'Add Team Member' }}
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

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter member name"
            />
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role *
            </label>
            <input
              v-model="formData.role"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Frontend Developer"
            />
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location *
            </label>
            <input
              v-model="formData.location"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., New York, USA"
            />
          </div>

          <!-- Timezone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Timezone *
            </label>
            <select
              v-model="formData.timezone"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select timezone...</option>
              <option v-for="tz in commonTimezones" :key="tz.value" :value="tz.value">
                {{ tz.label }}
              </option>
            </select>
          </div>

          <!-- Coordinates -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Latitude
              </label>
              <input
                v-model.number="formData.coordinates[0]"
                type="number"
                step="any"
                class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="40.7128"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Longitude
              </label>
              <input
                v-model.number="formData.coordinates[1]"
                type="number"
                step="any"
                class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="-74.0060"
              />
            </div>
          </div>

          <!-- Avatar URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Avatar URL
            </label>
            <input
              v-model="formData.avatar"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              v-model="formData.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="offline">Offline</option>
            </select>
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
              {{ member ? 'Update Member' : 'Add Member' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  member: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const formData = ref({
  name: '',
  role: '',
  location: '',
  timezone: '',
  coordinates: [0, 0],
  avatar: '',
  status: 'online'
})

const commonTimezones = [
  { value: 'America/New_York', label: 'Eastern Time (New York)' },
  { value: 'America/Chicago', label: 'Central Time (Chicago)' },
  { value: 'America/Denver', label: 'Mountain Time (Denver)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo Time' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (London)' },
  { value: 'Europe/Berlin', label: 'Central European Time (Berlin)' },
  { value: 'Europe/Moscow', label: 'Moscow Time' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (Dubai)' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (Delhi)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (Shanghai)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (Tokyo)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (Sydney)' },
  { value: 'Pacific/Auckland', label: 'New Zealand Time (Auckland)' }
]

const handleSubmit = () => {
  // Generate a default avatar if none provided
  if (!formData.value.avatar) {
    formData.value.avatar = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000000)}?w=150&h=150&fit=crop&crop=face`
  }

  emit('save', { ...formData.value })
}

onMounted(() => {
  if (props.member) {
    formData.value = {
      name: props.member.name || '',
      role: props.member.role || '',
      location: props.member.location || '',
      timezone: props.member.timezone || '',
      coordinates: props.member.coordinates || [0, 0],
      avatar: props.member.avatar || '',
      status: props.member.status || 'online'
    }
  }
})
</script>
