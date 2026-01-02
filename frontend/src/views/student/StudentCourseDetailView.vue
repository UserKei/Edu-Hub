<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStudentCourseStore } from '@/stores/student-course'
import StudentCourseSidebar from '@/components/student/StudentCourseSidebar.vue'
import StudentCourseContent from '@/components/student/StudentCourseContent.vue'
import StudentCourseDiscussion from '@/components/student/StudentCourseDiscussion.vue'

const route = useRoute()
const store = useStudentCourseStore()

onMounted(() => {
  if (route.params.courseId) {
    store.fetchCourseContent(route.params.courseId)
  }
})
</script>

<template>
  <div class="flex h-screen bg-ctp-base overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-80 shrink-0 border-r border-ctp-surface0 bg-ctp-mantle">
      <StudentCourseSidebar />
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 relative">
      <!-- Content Area -->
      <div class="flex-1 overflow-hidden relative">
        <StudentCourseContent />
      </div>
    </main>

    <!-- Discussion Panel -->
    <aside class="w-80 shrink-0 border-l border-ctp-surface0 bg-ctp-mantle">
      <StudentCourseDiscussion />
    </aside>
  </div>
</template>
