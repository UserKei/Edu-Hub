import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const continueLearningList = ref([])
  const isLoading = ref(false)

  // Actions
  const fetchContinueLearning = async () => {
    isLoading.value = true
    try {
      const response = await request.get('/api/dashboard/continue-learning')
      continueLearningList.value = response.data
    } finally {
      isLoading.value = false
    }
  }

  return {
    continueLearningList,
    isLoading,
    fetchContinueLearning
  }
})
