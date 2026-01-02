<template>
  <div class="flex items-center justify-between px-4 py-3 bg-ctp-mantle border-b border-ctp-surface0">
    <div class="flex items-center gap-4">
      <button
        @click="toggleSidebar"
        class="flex items-center justify-center p-1.5 rounded-md border border-ctp-surface1 text-ctp-subtext0 hover:bg-ctp-surface0 hover:text-ctp-text hover:border-ctp-surface2 transition-all duration-200"
      >
        <Icon icon="octicon:three-bars-16" class="w-5 h-5" />
      </button>
      <div class="flex items-center gap-2 text-ctp-subtext0 text-sm">
        <Icon icon="mdi:book-play-outline" class="w-6 h-6 text-ctp-mauve" />
        <span class="text-ctp-text font-medium">{{ $t(currentTitle) }}</span>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <!-- Theme Toggle -->
      <button
        @click="appStore.toggleTheme()"
        class="p-1.5 rounded-md text-ctp-subtext0 hover:bg-ctp-surface0 hover:text-ctp-text transition-colors"
        :title="appStore.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <Icon :icon="appStore.theme === 'dark' ? 'mdi:weather-night' : 'mdi:weather-sunny'" class="w-5 h-5" />
      </button>

      <!-- Language Toggle -->
      <button
        @click="appStore.toggleLocale()"
        class="p-1.5 rounded-md text-ctp-subtext0 hover:bg-ctp-surface0 hover:text-ctp-text transition-colors"
        :title="appStore.locale === 'en' ? 'Switch to Chinese' : 'Switch to English'"
      >
        <Icon icon="mdi:translate" class="w-5 h-5" />
      </button>

      <div class="w-8 h-8 rounded-full bg-ctp-surface1 flex items-center justify-center text-ctp-text overflow-hidden">
         <Icon icon="mdi:account" class="text-xl" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const appStore = useAppStore()

const currentTitle = computed(() => {
  if (route.meta && route.meta.title) {
    return route.meta.title
  }
  return 'dashboard.title'
})

const toggleSidebar = () => {
  appStore.toggleSidebar(true)
}
</script>
