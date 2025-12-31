import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const isSidebarOpen = ref(false)

  // Actions
  const toggleSidebar = (value) => {
    if (typeof value === 'boolean') {
      isSidebarOpen.value = value
    } else {
      isSidebarOpen.value = !isSidebarOpen.value
    }
  }

  return {
    isSidebarOpen,
    toggleSidebar
  }
})
