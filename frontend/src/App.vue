<script setup>
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
</script>

<template>
  <Toaster
    position="top-center"
    :toastOptions="{
      class: 'bg-ctp-base border border-ctp-surface1 shadow-lg rounded-xl text-ctp-text',
      descriptionClass: 'text-ctp-subtext0 text-xs'
    }"
  />
  <RouterView />
</template>

