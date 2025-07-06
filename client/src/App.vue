<script setup>
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
import socketService from './services/socketService.js'
import AppHeader from './components/AppHeader.vue'

onMounted(() => {
  // Connect to WebSocket when app mounts
  socketService.connect()
})

onUnmounted(() => {
  // Disconnect from WebSocket when app unmounts
  socketService.disconnect()
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-dark-900">
    <AppHeader />
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Component-specific styles if needed */
</style>
