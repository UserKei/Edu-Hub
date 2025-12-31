<template>
  <div class="bg-ctp-mantle rounded-2xl p-6">
    <h2 class="text-xl font-bold text-ctp-text mb-4 flex items-center gap-2">
      <Icon icon="mdi:history" class="text-ctp-blue" />
      {{ $t('dashboard.continue_learning') }}
    </h2>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Skeleton Loader -->
      <div v-for="i in 3" :key="i" class="bg-ctp-surface0 rounded-xl p-4 h-64 animate-pulse"></div>
    </div>

    <div v-else-if="list.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ContinueLearningCard
        v-for="item in list"
        :key="item.course_id"
        :course="item"
      />
    </div>

    <div v-else class="text-center py-8 text-ctp-subtext0">
      {{ $t('dashboard.no_recent_learning') }}
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useDashboardStore } from '@/stores/dashboard'
import ContinueLearningCard from './ContinueLearningCard.vue'

const dashboardStore = useDashboardStore()
const list = computed(() => dashboardStore.continueLearningList)
const isLoading = computed(() => dashboardStore.isLoading)

onMounted(() => {
  dashboardStore.fetchContinueLearning()
})
</script>
