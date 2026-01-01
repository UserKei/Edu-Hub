<template>
  <div class="bg-ctp-surface0 rounded-xl p-4 flex flex-col gap-3 hover:bg-ctp-surface1 transition-colors border border-transparent hover:border-ctp-blue/30">
    <div class="relative aspect-video rounded-lg overflow-hidden bg-ctp-crust">
      <img :src="course.course_cover" :alt="course.course_title" class="w-full h-full object-cover" />
    </div>

    <div class="flex-1">
      <h3 class="font-bold text-ctp-text line-clamp-1">{{ course.course_title }}</h3>
      <p class="text-sm text-ctp-subtext0 mt-1 line-clamp-1">{{ course.last_chapter_title }}</p>
    </div>

    <button
      @click="handleContinue"
      class="w-full py-2 px-4 bg-ctp-blue text-ctp-base rounded-lg font-medium hover:bg-ctp-blue/90 transition-colors flex items-center justify-center gap-2"
    >
      <Icon icon="mdi:play-circle" />
      <span>{{ $t('dashboard.continue_learning') }}</span>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const handleContinue = () => {
  router.push(`/learn/${props.course.course_id}`)
}
</script>
