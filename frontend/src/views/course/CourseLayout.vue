<template>
  <div class="min-h-screen bg-ctp-base text-ctp-text">
    <!-- Global Sidebar (Off-canvas) -->
    <SidebarMenu />

    <div class="flex flex-col min-h-screen">
      <!-- Global Header -->
      <TopBar />

      <div class="flex flex-1">
        <!-- Course Module Sidebar (Static) -->
        <CourseSidebar class="hidden md:flex shrink-0" />

        <!-- Main Content -->
        <main class="flex-1 p-4 md:p-6 overflow-y-auto">
          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopBar from '@/components/layout/TopBar.vue'
import SidebarMenu from '@/components/layout/SidebarMenu.vue'
import CourseSidebar from '@/components/course/CourseSidebar.vue'
</script>
