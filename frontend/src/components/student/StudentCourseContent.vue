<script setup>
import { computed, ref, watch } from 'vue'
import { useStudentCourseStore } from '@/stores/student-course'
import { Icon } from '@iconify/vue'

const store = useStudentCourseStore()
const videoRef = ref(null)

const chapter = computed(() => store.currentChapter)
const isLoading = computed(() => store.loading)

// Video progress tracking
const handleTimeUpdate = () => {
  if (videoRef.value) {
    const currentTime = videoRef.value.currentTime
    const duration = videoRef.value.duration
    if (duration > 0) {
      const progress = Math.floor((currentTime / duration) * 100)
      store.updateLearningProgress(progress)
    }
  }
}

const handleVideoEnded = () => {
  store.updateLearningProgress(100)
}

// Reset video when chapter changes
watch(() => chapter.value?.id, () => {
  if (videoRef.value) {
    videoRef.value.currentTime = 0
    // If we had stored progress for this specific chapter, we could restore it here
  }
})
</script>

<template>
  <div class="h-full flex flex-col bg-ctp-base overflow-y-auto">
    <div v-if="isLoading" class="flex items-center justify-center h-full">
      <Icon icon="eos-icons:loading" class="text-4xl text-ctp-blue animate-spin" />
    </div>

    <div v-else-if="chapter" class="max-w-4xl mx-auto w-full p-8">
      <!-- Breadcrumb / Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-ctp-text mb-2">{{ chapter.title }}</h1>
      </div>

      <!-- Video Player -->
      <div v-if="chapter.video_url" class="aspect-video bg-black rounded-lg overflow-hidden shadow-lg mb-8">
        <video
          ref="videoRef"
          class="w-full h-full"
          controls
          :src="chapter.video_url"
          @timeupdate="handleTimeUpdate"
          @ended="handleVideoEnded"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <!-- Content -->
      <div class="prose prose-invert max-w-none">
        <div v-html="chapter.content"></div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-12 pt-8 border-t border-ctp-surface0">
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-ctp-surface0 text-ctp-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!store.prevChapterId"
          @click="store.setCurrentChapter(store.prevChapterId)"
        >
          <Icon icon="mdi:arrow-left" />
          {{ $t('student.course.content.prev') }}
        </button>

        <button
          class="flex items-center gap-2 px-4 py-2 bg-ctp-blue text-ctp-base rounded-lg hover:bg-ctp-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!store.nextChapterId"
          @click="store.setCurrentChapter(store.nextChapterId)"
        >
          {{ $t('student.course.content.next') }}
          <Icon icon="mdi:arrow-right" />
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center h-full text-ctp-subtext0">
      <Icon icon="mdi:book-open-page-variant" class="text-6xl mb-4 opacity-50" />
      <p>{{ $t('student.course.content.select_chapter') }}</p>
    </div>
  </div>
</template>
