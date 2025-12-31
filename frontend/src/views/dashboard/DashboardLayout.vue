<template>
  <div class="min-h-screen bg-ctp-base text-ctp-text">
    <SidebarMenu />

    <div class="flex flex-col min-h-screen">
      <TopBar />

      <main class="flex-1 p-4 md:p-6 overflow-y-auto">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import TopBar from '@/components/layout/TopBar.vue'
import SidebarMenu from '@/components/layout/SidebarMenu.vue'
</script>
