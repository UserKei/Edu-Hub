<template>
  <div class="bg-ctp-mantle rounded-2xl p-6">
    <h2 class="text-xl font-bold text-ctp-text mb-4 flex items-center gap-2">
      <Icon icon="mdi:history" class="text-ctp-blue" />
      {{ $t('dashboard.continue_learning') }}
    </h2>

    <div v-if="isLoading" class="flex flex-col gap-4">
      <!-- Skeleton Loader -->
      <div v-for="i in 3" :key="i" class="bg-ctp-surface0 rounded-xl p-3 h-28 animate-pulse flex gap-4">
        <div class="w-40 h-full bg-ctp-surface1 rounded-lg shrink-0"></div>
        <div class="flex-1 py-2 space-y-3">
            <div class="h-6 bg-ctp-surface1 rounded w-1/3"></div>
            <div class="h-4 bg-ctp-surface1 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <div v-else-if="list.length > 0" class="flex flex-col gap-4">
      <ContinueLearningCard
        v-for="item in list"
        :key="item.course.id"
        :data="item"
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
