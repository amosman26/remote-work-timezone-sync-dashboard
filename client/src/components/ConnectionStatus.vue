<template>
  <div class="flex items-center space-x-2">
    <!-- Connection Status Dot -->
    <div
      :class="[
        'w-2 h-2 rounded-full transition-colors',
        statusColor
      ]"
      :title="statusMessage"
    ></div>
    
    <!-- Status Text -->
    <span class="text-sm text-gray-600 dark:text-gray-300">
      {{ statusText }}
    </span>

    <!-- Reconnect Button (shown when disconnected) -->
    <button
      v-if="connectionStatus === 'error' || connectionStatus === 'disconnected'"
      @click="reconnect"
      class="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
      :disabled="isReconnecting"
    >
      {{ isReconnecting ? 'Reconnecting...' : 'Reconnect' }}
    </button>

    <!-- Online Members Count -->
    <div v-if="isConnected && onlineMembersCount > 0" class="flex items-center space-x-1">
      <div class="w-1 h-1 bg-gray-400 rounded-full"></div>
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ onlineMembersCount }} online
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRealtimeStore } from '../stores/realtime.js'
import socketService from '../services/socketService.js'

const realtimeStore = useRealtimeStore()
const isReconnecting = ref(false)

const isConnected = computed(() => realtimeStore.isConnected)
const connectionStatus = computed(() => realtimeStore.connectionStatus)
const onlineMembersCount = computed(() => realtimeStore.onlineMembersCount)

const statusColor = computed(() => {
  const colors = {
    connected: 'bg-green-500',
    reconnected: 'bg-green-500',
    disconnected: 'bg-red-500',
    error: 'bg-red-500',
    connecting: 'bg-yellow-500',
    reconnecting: 'bg-yellow-500'
  }
  return colors[connectionStatus.value] || 'bg-gray-400'
})

const statusText = computed(() => {
  const texts = {
    connected: 'Connected',
    reconnected: 'Reconnected',
    disconnected: 'Disconnected',
    error: 'Connection Error',
    connecting: 'Connecting...',
    reconnecting: 'Reconnecting...'
  }
  return texts[connectionStatus.value] || 'Unknown'
})

const statusMessage = computed(() => {
  const messages = {
    connected: 'Real-time connection is active',
    reconnected: 'Successfully reconnected to server',
    disconnected: 'Not connected to server',
    error: 'Failed to connect to server',
    connecting: 'Establishing connection...',
    reconnecting: 'Attempting to reconnect...'
  }
  return messages[connectionStatus.value] || 'Connection status unknown'
})

const reconnect = async () => {
  isReconnecting.value = true
  try {
    socketService.forceReconnect()
    // Wait a bit before removing the reconnecting state
    setTimeout(() => {
      isReconnecting.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to reconnect:', error)
    isReconnecting.value = false
  }
}
</script>
