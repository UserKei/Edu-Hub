<template>
  <div class="flex items-center justify-between px-4 py-3 bg-ctp-mantle border-b border-ctp-surface0">
    <div class="flex items-center gap-4">
      <button @click="toggleSidebar" class="text-ctp-text hover:text-ctp-blue transition-colors">
        <Icon icon="mdi:menu" class="text-2xl" />
      </button>
      <div class="flex items-center gap-2 text-ctp-subtext0 text-sm">
        <Icon icon="mdi:home" />
        <span>/</span>
        <span class="text-ctp-text font-medium">{{ $t('dashboard.title') }}</span>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-ctp-surface1 flex items-center justify-center text-ctp-text overflow-hidden">
         <Icon icon="mdi:account" class="text-xl" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const toggleSidebar = () => {
  appStore.toggleSidebar(true)
}
</script>
