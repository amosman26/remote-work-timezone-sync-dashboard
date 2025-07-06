<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="text-center">
      <!-- Spinner -->
      <div class="relative">
        <div
          :class="[
            'animate-spin rounded-full border-4 border-gray-200 dark:border-dark-600',
            spinnerSize,
            'border-t-primary-600 dark:border-t-primary-400'
          ]"
        ></div>
        
        <!-- Optional icon in center -->
        <div v-if="icon" class="absolute inset-0 flex items-center justify-center">
          <component :is="icon" :class="iconSize" class="text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      
      <!-- Loading text -->
      <div v-if="text" class="mt-4">
        <p :class="textSize" class="text-gray-600 dark:text-gray-300">
          {{ text }}
        </p>
        <p v-if="subtext" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ subtext }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  subtext: {
    type: String,
    default: ''
  },
  icon: {
    type: Object,
    default: null
  },
  fullHeight: {
    type: Boolean,
    default: false
  },
  overlay: {
    type: Boolean,
    default: false
  }
})

const spinnerSize = computed(() => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  return sizes[props.size]
})

const iconSize = computed(() => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  }
  return sizes[props.size]
})

const textSize = computed(() => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  return sizes[props.size]
})

const containerClass = computed(() => {
  const classes = []
  
  if (props.fullHeight) {
    classes.push('min-h-screen')
  } else {
    classes.push('py-12')
  }
  
  if (props.overlay) {
    classes.push('fixed', 'inset-0', 'bg-white', 'dark:bg-dark-900', 'bg-opacity-80', 'dark:bg-opacity-80', 'z-50', 'backdrop-blur-sm')
  }
  
  return classes.join(' ')
})
</script>
