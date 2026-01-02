<template>
  <div class="h-screen bg-ctp-base text-ctp-text overflow-hidden flex flex-col">
    <SidebarMenu />

    <div class="flex flex-col h-full overflow-hidden">
      <TopBar class="shrink-0" />

      <main class="flex-1 p-4 md:p-6 overflow-hidden">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import TopBar from '@/components/layout/TopBar.vue'
import SidebarMenu from '@/components/layout/SidebarMenu.vue'
</script>
