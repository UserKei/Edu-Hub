<script setup>
import { computed } from 'vue'
import { useStudentCourseStore } from '@/stores/student-course'
import SidebarItem from './SidebarItem.vue'

const store = useStudentCourseStore()

const courseTitle = computed(() => store.course?.title || 'Loading...')
const chapters = computed(() => store.chapters)
const currentChapterId = computed(() => store.currentChapter?.id)

const handleSelect = (chapterId) => {
  store.setCurrentChapter(chapterId)
}
</script>

<template>
  <div class="h-full flex flex-col bg-ctp-mantle border-r border-ctp-surface0">
    <!-- Course Header -->
    <div class="p-4 border-b border-ctp-surface0">
      <h2 class="text-lg font-bold text-ctp-text truncate" :title="courseTitle">
        {{ courseTitle }}
      </h2>
      <div class="mt-2 w-full bg-ctp-surface0 rounded-full h-2">
        <div
          class="bg-ctp-green h-2 rounded-full transition-all duration-500"
          :style="{ width: store.progressPercentage + '%' }"
        ></div>
      </div>
      <p class="text-xs text-ctp-subtext0 mt-1 text-right">
        {{ Math.round(store.progressPercentage) }}% {{ $t('student.course.sidebar.completed') }}
      </p>
    </div>

    <!-- Chapter Tree -->
    <div class="flex-1 overflow-y-auto py-2">
      <SidebarItem
        v-for="chapter in chapters"
        :key="chapter.id"
        :item="chapter"
        :current-chapter-id="currentChapterId"
        @select="handleSelect"
      />
    </div>
  </div>
</template>
