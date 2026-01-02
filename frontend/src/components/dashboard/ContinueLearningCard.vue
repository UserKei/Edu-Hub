<template>
  <div
    @click="handleContinue"
    class="bg-ctp-surface0 rounded-xl p-3 flex items-center gap-4 hover:bg-ctp-surface1 transition-all border border-transparent hover:border-ctp-blue/30 group cursor-pointer"
  >
    <!-- Cover Image -->
    <div class="relative w-40 h-24 shrink-0 rounded-lg overflow-hidden bg-ctp-crust flex items-center justify-center">
      <img
        v-if="data.course.cover_image"
        :src="data.course.cover_image"
        :alt="data.course.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <Icon
        v-else
        icon="mdi:book-open-variant"
        class="text-ctp-overlay0 text-4xl group-hover:scale-110 transition-transform duration-500"
      />

      <div class="absolute inset-0 flex items-center justify-center bg-ctp-crust/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <Icon icon="mdi:play-circle" class="text-ctp-text text-3xl drop-shadow-lg" />
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0 flex flex-col justify-center gap-1">
      <h3 class="font-bold text-ctp-text text-lg truncate group-hover:text-ctp-blue transition-colors">
        {{ data.course.title }}
      </h3>
      <div class="flex items-center gap-2 text-sm text-ctp-subtext0">
        <Icon icon="mdi:bookmark-outline" class="shrink-0" />
        <p class="truncate">{{ data.last_chapter ? data.last_chapter.title : $t('dashboard.start_learning') }}</p>
      </div>
    </div>

    <!-- Action Button -->
    <div class="shrink-0 px-2 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
      <Icon icon="mdi:arrow-right" class="text-2xl text-ctp-blue" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const handleContinue = () => {
  router.push(`/learn/${props.data.course.id}`)
}
</script>
