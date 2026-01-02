import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const isSidebarOpen = ref(false)
  const theme = ref(localStorage.getItem('theme') || 'dark')
  const locale = ref(localStorage.getItem('locale') || 'en')

  // Actions
  const toggleSidebar = (value) => {
    if (typeof value === 'boolean') {
      isSidebarOpen.value = value
    } else {
      isSidebarOpen.value = !isSidebarOpen.value
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', theme.value)
  }

  const toggleLocale = () => {
    locale.value = locale.value === 'en' ? 'zh-CN' : 'en'
    localStorage.setItem('locale', locale.value)
  }

  return {
    isSidebarOpen,
    theme,
    locale,
    toggleSidebar,
    toggleTheme,
    toggleLocale
  }
})
