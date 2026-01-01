<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  courses: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div class="bg-ctp-mantle rounded-xl p-6 min-h-150">
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="n in 8" :key="n" class="bg-ctp-surface1 rounded-xl h-75 animate-pulse"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="courses.length === 0" class="flex flex-col items-center justify-center h-100 text-ctp-subtext0">
      <Icon icon="mdi:box-open" class="text-6xl mb-4 text-ctp-surface2" />
      <p class="text-lg">{{ $t('course.list.empty') }}</p>
    </div>

    <!-- Course Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <slot />
    </div>
  </div>
</template>
