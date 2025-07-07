<template>
  <header class="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Title -->
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              🌍 Remote Work Dashboard
            </h1>
          </div>
          
          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <RouterLink
              to="/"
              class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-primary-600 dark:text-primary-400"
            >
              Dashboard
            </RouterLink>
            <RouterLink
              to="/teams"
              class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-primary-600 dark:text-primary-400"
            >
              Teams
            </RouterLink>
            <RouterLink
              to="/meetings"
              class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-primary-600 dark:text-primary-400"
            >
              Meetings
            </RouterLink>
          </nav>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4">
          <!-- Connection Status -->
<<<<<<< HEAD
          <ConnectionStatus />

          <!-- Notifications -->
          <NotificationCenter />
=======
          <div class="flex items-center space-x-2">
            <div
              :class="[
                'w-2 h-2 rounded-full',
                connectionStatus ? 'bg-green-500' : 'bg-red-500'
              ]"
            ></div>
            <span class="text-sm text-gray-600 dark:text-gray-300">
              {{ connectionStatus ? 'Connected' : 'Disconnected' }}
            </span>
          </div>
>>>>>>> feature/project-setup

          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <SunIcon v-if="isDark" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>

          <!-- Mobile menu button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <Bars3Icon v-if="!mobileMenuOpen" class="w-5 h-5" />
            <XMarkIcon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-dark-700">
          <RouterLink
            to="/"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            active-class="text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-dark-700"
          >
            Dashboard
          </RouterLink>
          <RouterLink
            to="/teams"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            active-class="text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-dark-700"
          >
            Teams
          </RouterLink>
          <RouterLink
            to="/meetings"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            active-class="text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-dark-700"
          >
            Meetings
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
<<<<<<< HEAD
import { useRealtimeStore } from '../stores/realtime.js'
import ConnectionStatus from './ConnectionStatus.vue'
import NotificationCenter from './NotificationCenter.vue'

const realtimeStore = useRealtimeStore()
const mobileMenuOpen = ref(false)
=======
import socketService from '../services/socketService.js'

const mobileMenuOpen = ref(false)
const connectionStatus = ref(false)
>>>>>>> feature/project-setup
const isDark = ref(false)

// Theme management
const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Initialize theme
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  isDark.value = savedTheme === 'dark' || (savedTheme === null && prefersDark)
  
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

<<<<<<< HEAD
onMounted(() => {
  initTheme()
  
  // Connect to real-time services
  const userId = 'user-' + Math.random().toString(36).substr(2, 9)
  const userName = 'Current User'
  realtimeStore.connect(userId, userName)
})

onUnmounted(() => {
  realtimeStore.disconnect()
=======
// Check connection status
const checkConnection = () => {
  connectionStatus.value = socketService.getConnectionStatus()
}

onMounted(() => {
  initTheme()
  checkConnection()
  
  // Check connection status periodically
  const connectionInterval = setInterval(checkConnection, 1000)
  
  onUnmounted(() => {
    clearInterval(connectionInterval)
  })
>>>>>>> feature/project-setup
})
</script>
