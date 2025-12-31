<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="min-h-screen w-full bg-ctp-base flex items-center justify-center p-4">
    <div class="w-full max-w-115 flex flex-col gap-8">
      <!-- Header / Logo Area -->
      <div class="w-full h-45 bg-ctp-surface0 rounded-xl flex items-center justify-center mb-4">
        <h1 class="text-2xl font-medium text-ctp-text">
          {{ title }}
        </h1>
      </div>

      <!-- Form Content -->
      <div class="flex flex-col gap-6">
        <slot />
      </div>

      <!-- Footer -->
      <div class="mt-4 text-center">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
