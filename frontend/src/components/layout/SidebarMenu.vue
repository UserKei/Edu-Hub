<template>
  <div>
    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 z-40 transition-opacity"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <div
      class="fixed top-0 left-0 h-full w-64 bg-ctp-mantle z-50 transform transition-transform duration-300 ease-in-out shadow-lg flex flex-col"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="p-4 flex justify-between items-center border-b border-ctp-surface0">
        <h2 class="text-xl font-bold text-ctp-blue">Edu-Hub</h2>
        <button @click="closeSidebar" class="text-ctp-overlay1 hover:text-ctp-red transition-colors">
          <Icon icon="mdi:close" class="text-2xl" />
        </button>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <router-link
          to="/dashboard"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-ctp-text hover:bg-ctp-surface0 transition-colors"
          @click="closeSidebar"
        >
          <Icon icon="mdi:home" class="text-xl" />
          <span>{{ $t('nav.home') }}</span>
        </router-link>

        <router-link
          to="/courses"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-ctp-text hover:bg-ctp-surface0 transition-colors"
          @click="closeSidebar"
        >
          <Icon icon="mdi:book-open-variant" class="text-xl" />
          <span>{{ $t('nav.course') }}</span>
        </router-link>

        <router-link
          to="/forum"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-ctp-text hover:bg-ctp-surface0 transition-colors"
          @click="closeSidebar"
        >
          <Icon icon="mdi:forum" class="text-xl" />
          <span>{{ $t('nav.forum') }}</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const isOpen = computed(() => appStore.isSidebarOpen)

const closeSidebar = () => {
  appStore.toggleSidebar(false)
}
</script>
