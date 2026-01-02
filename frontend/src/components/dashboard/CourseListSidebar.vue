<template>
  <div class="bg-ctp-mantle rounded-2xl p-6 h-full flex flex-col">
    <h2 class="text-xl font-bold text-ctp-text mb-4">{{ $t('dashboard.my_courses') }}</h2>

    <div v-if="courseStore.isLoading" class="space-y-3">
      <!-- Loading Skeletons -->
      <div v-for="i in 5" :key="i" class="flex items-center gap-3 p-2 rounded-lg animate-pulse">
        <div class="w-10 h-10 rounded bg-ctp-surface1 shrink-0"></div>
        <div class="flex-1 min-w-0">
          <div class="h-4 bg-ctp-surface1 rounded w-3/4 mb-1"></div>
          <div class="h-3 bg-ctp-surface1 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <div v-else-if="courseStore.enrolledCourses && courseStore.enrolledCourses.length > 0" class="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
      <div
        v-for="enrollment in courseStore.enrolledCourses"
        :key="enrollment.id"
        @click="navigateToCourse(enrollment.course.id)"
        class="flex items-center gap-3 p-2 rounded-lg hover:bg-ctp-surface0 transition-colors cursor-pointer group"
      >
        <!-- Cover Image or Placeholder -->
        <div class="w-10 h-10 rounded bg-ctp-surface1 shrink-0 overflow-hidden flex items-center justify-center">
            <img v-if="enrollment.course.cover_image" :src="enrollment.course.cover_image" class="w-full h-full object-cover" alt="cover" />
            <Icon v-else icon="mdi:book-open-page-variant" class="text-ctp-overlay0 text-xl" />
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="text-ctp-text text-sm font-medium truncate group-hover:text-ctp-blue transition-colors">
            {{ enrollment.course.title }}
          </h3>
          <p class="text-ctp-subtext0 text-xs truncate">
            {{ $t('course.type.' + (enrollment.course.type === 'PUBLIC' ? 'public' : 'private')) }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center flex-1 text-ctp-overlay1 gap-2">
        <Icon icon="mdi:book-open-blank-variant" class="text-4xl opacity-50" />
        <p class="text-sm">{{ $t('course.list.empty') }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/course'
import { Icon } from '@iconify/vue'

const router = useRouter()
const courseStore = useCourseStore()

const navigateToCourse = (courseId) => {
  router.push({ name: 'student-course-detail', params: { courseId } })
}

onMounted(() => {
  courseStore.fetchEnrolledCourses()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgb(var(--ctp-surface1));
  border-radius: 20px;
}
</style>
