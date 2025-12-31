<template>
  <div class="bg-ctp-mantle rounded-2xl p-6">
    <h2 class="text-xl font-bold text-ctp-text mb-4">{{ $t('dashboard.news') }}</h2>
    <div class="space-y-4">
      <div v-for="i in 3" :key="i" class="p-3 bg-ctp-surface0 rounded-lg">
        <div class="h-4 w-3/4 bg-ctp-surface1 rounded mb-2"></div>
        <div class="h-3 w-1/2 bg-ctp-surface1 rounded"></div>
      </div>
    </div>
  </div>
</template>
