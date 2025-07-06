<template>
  <div class="relative">
    <!-- Notification Bell -->
    <button
      @click="showNotifications = !showNotifications"
      class="relative p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
      :class="{ 'bg-gray-100 dark:bg-dark-700': showNotifications }"
    >
      <BellIcon class="w-5 h-5" />
      
      <!-- Notification Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Notifications Dropdown -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showNotifications"
        class="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 z-50"
      >
        <!-- Header -->
        <div class="p-4 border-b border-gray-200 dark:border-dark-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            <div class="flex space-x-2">
              <button
                v-if="unreadCount > 0"
                @click="markAllAsRead"
                class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Mark all read
              </button>
              <button
                @click="clearAll"
                class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="notifications.length === 0" class="p-8 text-center">
            <BellSlashIcon class="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400">No notifications yet</p>
          </div>

          <div v-else class="space-y-1 p-2">
            <div
              v-for="notification in notifications.slice(0, 10)"
              :key="notification.id"
              @click="markAsRead(notification.id)"
              class="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer transition-colors"
              :class="{
                'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500': !notification.read,
                'opacity-75': notification.read
              }"
            >
              <div class="flex items-start space-x-3">
                <!-- Notification Icon -->
                <div class="flex-shrink-0 mt-1">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="getNotificationColor(notification.type)"
                  ></div>
                </div>

                <!-- Notification Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ notification.title }}
                    </p>
                    <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      {{ formatTime(notification.timestamp) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {{ notification.message }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="notifications.length > 10" class="p-3 border-t border-gray-200 dark:border-dark-700 text-center">
          <button class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            View all notifications
          </button>
        </div>
      </div>
    </transition>

    <!-- Click outside to close -->
    <div
      v-if="showNotifications"
      @click="showNotifications = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { BellIcon, BellSlashIcon } from '@heroicons/vue/24/outline'
import { useRealtimeStore } from '../stores/realtime.js'
import { formatDistanceToNow } from 'date-fns'

const realtimeStore = useRealtimeStore()
const showNotifications = ref(false)

const notifications = computed(() => realtimeStore.notifications)
const unreadCount = computed(() => realtimeStore.unreadNotifications)

const markAsRead = (notificationId) => {
  realtimeStore.markNotificationAsRead(notificationId)
}

const markAllAsRead = () => {
  realtimeStore.markAllNotificationsAsRead()
}

const clearAll = () => {
  realtimeStore.clearNotifications()
  showNotifications.value = false
}

const getNotificationColor = (type) => {
  const colors = {
    'member-joined': 'bg-green-500',
    'member-left': 'bg-red-500',
    'status-change': 'bg-yellow-500',
    'location-update': 'bg-blue-500',
    'meeting': 'bg-purple-500',
    'default': 'bg-gray-500'
  }
  return colors[type] || colors.default
}

const formatTime = (timestamp) => {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  } catch (error) {
    return 'just now'
  }
}

// Close notifications when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.notification-container')) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
