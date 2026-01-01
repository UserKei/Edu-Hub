<script setup>
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
</script>

<template>
  <Toaster
    position="top-left"
    :toastOptions="{
      class: 'bg-ctp-base border border-ctp-surface1 shadow-xl rounded-xl text-ctp-text min-w-[320px]',
      descriptionClass: 'text-ctp-subtext0 text-xs',
      actionButtonClass: 'bg-ctp-blue text-ctp-base',
      cancelButtonClass: 'bg-ctp-surface0 text-ctp-text'
    }"
  />
  <RouterView />
</template>

