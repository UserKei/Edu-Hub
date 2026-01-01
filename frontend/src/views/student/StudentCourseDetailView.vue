<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStudentCourseStore } from '@/stores/student-course'
import StudentCourseSidebar from '@/components/student/StudentCourseSidebar.vue'
import StudentCourseContent from '@/components/student/StudentCourseContent.vue'
import StudentCourseDiscussion from '@/components/student/StudentCourseDiscussion.vue'
import { Icon } from '@iconify/vue'

const route = useRoute()
const store = useStudentCourseStore()
const showSidebar = ref(true)

onMounted(() => {
  if (route.params.courseId) {
    store.fetchCourseContent(route.params.courseId)
  }
})
</script>

<template>
  <div class="flex h-screen bg-ctp-base overflow-hidden">
    <!-- Sidebar Toggle (Mobile/Desktop) -->
    <div
      class="fixed left-4 top-4 z-50 md:hidden"
      @click="showSidebar = !showSidebar"
    >
      <button class="p-2 bg-ctp-surface0 rounded-lg shadow-lg text-ctp-text">
        <Icon icon="mdi:menu" />
      </button>
    </div>

    <!-- Sidebar -->
    <aside
      class="w-80 shrink-0 transition-all duration-300 ease-in-out transform"
      :class="[
        showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden',
        'fixed md:relative z-40 h-full shadow-xl md:shadow-none'
      ]"
    >
      <StudentCourseSidebar />
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 relative">
      <!-- Toolbar -->
      <div class="h-12 bg-ctp-mantle border-b border-ctp-surface0 flex items-center justify-between px-4">
        <button
          class="text-ctp-text hover:text-ctp-blue transition-colors"
          @click="showSidebar = !showSidebar"
          :title="showSidebar ? 'Hide Sidebar' : 'Show Sidebar'"
        >
          <Icon :icon="showSidebar ? 'mdi:page-layout-sidebar-left' : 'mdi:page-layout-sidebar-left-off'" class="text-xl" />
        </button>
      </div>

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
