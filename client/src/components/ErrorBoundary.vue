<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="text-center max-w-md">
      <!-- Error Icon -->
      <div class="mb-4">
        <ExclamationTriangleIcon class="w-16 h-16 text-red-500 dark:text-red-400 mx-auto" />
      </div>
      
      <!-- Error Title -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ title }}
      </h2>
      
      <!-- Error Message -->
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        {{ message }}
      </p>
      
      <!-- Error Details (collapsible) -->
      <div v-if="details && showDetails" class="mb-6">
        <div class="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 text-left">
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">Error Details:</h4>
          <pre class="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap overflow-x-auto">{{ details }}</pre>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="space-y-3">
        <!-- Primary Action -->
        <button
          v-if="onRetry"
          @click="onRetry"
          class="w-full btn-primary"
          :disabled="isRetrying"
        >
          <ArrowPathIcon v-if="isRetrying" class="w-4 h-4 mr-2 animate-spin" />
          {{ isRetrying ? 'Retrying...' : retryText }}
        </button>
        
        <!-- Secondary Actions -->
        <div class="flex space-x-3">
          <button
            v-if="details"
            @click="showDetails = !showDetails"
            class="flex-1 btn-secondary text-sm"
          >
            {{ showDetails ? 'Hide Details' : 'Show Details' }}
          </button>
          
          <button
            v-if="onGoBack"
            @click="onGoBack"
            class="flex-1 btn-secondary text-sm"
          >
            {{ goBackText }}
          </button>
        </div>
        
        <!-- Help Link -->
        <p v-if="helpLink" class="text-sm text-gray-500 dark:text-gray-400">
          Need help? 
          <a :href="helpLink" class="text-primary-600 dark:text-primary-400 hover:underline" target="_blank">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    default: 'Something went wrong'
  },
  message: {
    type: String,
    default: 'We encountered an unexpected error. Please try again.'
  },
  details: {
    type: String,
    default: ''
  },
  onRetry: {
    type: Function,
    default: null
  },
  onGoBack: {
    type: Function,
    default: null
  },
  retryText: {
    type: String,
    default: 'Try Again'
  },
  goBackText: {
    type: String,
    default: 'Go Back'
  },
  helpLink: {
    type: String,
    default: ''
  },
  fullHeight: {
    type: Boolean,
    default: false
  }
})

const showDetails = ref(false)
const isRetrying = ref(false)

const containerClass = props.fullHeight ? 'min-h-screen' : 'py-12'

const handleRetry = async () => {
  if (props.onRetry && !isRetrying.value) {
    isRetrying.value = true
    try {
      await props.onRetry()
    } finally {
      isRetrying.value = false
    }
  }
}
</script>
