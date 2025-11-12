<template>
  <div class="app-container">
    <component :is="currentView" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from './stores/app'
import ApiKeySetup from './views/ApiKeySetup.vue'
import MainEditor from './views/MainEditor.vue'

const appStore = useAppStore()

const currentView = computed(() => {
  return appStore.isConfigured ? MainEditor : ApiKeySetup
})
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
}
</style>
