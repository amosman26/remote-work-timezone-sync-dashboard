<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

// The real-time connection is now managed in AppHeader component
// through the realtime store, so we don't need to handle it here
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
