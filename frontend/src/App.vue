<script setup>
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'
import { watchEffect } from 'vue'

const appStore = useAppStore()
const { locale } = useI18n()

watchEffect(() => {
  // Theme handling
  const root = document.documentElement
  root.classList.remove('latte', 'mocha')
  root.classList.add(appStore.theme === 'light' ? 'latte' : 'mocha')

  // Locale handling
  locale.value = appStore.locale
})
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

