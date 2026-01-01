<script setup>
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path) => route.path === path
</script>

<template>
  <div class="w-64 bg-ctp-blue text-white flex flex-col py-6 gap-2 h-full min-h-[calc(100vh-64px)]">
    <router-link
      to="/courses"
      class="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-white/10 border-l-4 border-transparent"
      :class="{ 'bg-white/20 border-white': isActive('/courses') }"
    >
      <Icon icon="mdi:library" class="text-xl" />
      <span class="font-medium">{{ $t('course.library.title') }}</span>
    </router-link>

    <router-link
      to="/my-courses"
      class="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-white/10 border-l-4 border-transparent"
      :class="{ 'bg-white/20 border-white': isActive('/my-courses') }"
    >
      <Icon icon="mdi:book-education" class="text-xl" />
      <span class="font-medium">{{ $t('course.my_courses.title') }}</span>
    </router-link>
  </div>
</template>
