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

      <!-- User Dropdown -->
      <div class="relative" ref="dropdownRef">
        <button
          @click="toggleDropdown"
          class="w-8 h-8 rounded-full bg-ctp-surface1 flex items-center justify-center text-ctp-text overflow-hidden hover:ring-2 hover:ring-ctp-blue transition-all cursor-pointer"
        >
           <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" class="w-full h-full object-cover" />
           <Icon v-else icon="mdi:account" class="text-xl" />
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-48 bg-ctp-base border border-ctp-surface0 rounded-lg shadow-lg py-1 z-50"
        >
          <div class="px-4 py-2 border-b border-ctp-surface0">
            <p class="text-sm font-medium text-ctp-text truncate">{{ authStore.user?.nickname || authStore.user?.username || 'User' }}</p>
            <p class="text-xs text-ctp-subtext0 truncate">{{ authStore.user?.role || 'Student' }}</p>
          </div>

          <button
            @click="handleLogout"
            class="w-full text-left px-4 py-2 text-sm text-ctp-red hover:bg-ctp-surface0 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Icon icon="mdi:logout" />
            {{ $t('auth.logout') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const currentTitle = computed(() => {
  if (route.meta && route.meta.title) {
    return route.meta.title
  }
  return 'dashboard.title'
})

const toggleSidebar = () => {
  appStore.toggleSidebar(true)
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isDropdownOpen.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>
