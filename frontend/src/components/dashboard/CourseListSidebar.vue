<template>
  <div class="bg-ctp-mantle rounded-2xl p-6 h-full">
    <h2 class="text-xl font-bold text-ctp-text mb-4">{{ $t('dashboard.my_courses') }}</h2>
    <div class="space-y-3">
      <!-- Placeholder for course list -->
      <div v-for="i in 5" :key="i" class="flex items-center gap-3 p-2 rounded-lg hover:bg-ctp-surface0 transition-colors cursor-pointer">
        <div class="w-10 h-10 rounded bg-ctp-surface1 shrink-0"></div>
        <div class="flex-1 min-w-0">
          <div class="h-4 bg-ctp-surface1 rounded w-3/4 mb-1"></div>
          <div class="h-3 bg-ctp-surface1 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// TODO: Fetch and display actual course list
</script>
