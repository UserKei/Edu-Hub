<template>
  <DashboardLayout>
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
      <!-- Left Sidebar (Course List) - Hidden on small screens, visible on XL -->
      <div class="hidden xl:block xl:col-span-1 h-full overflow-hidden">
        <CourseListSidebar />
      </div>

      <!-- Main Content Area -->
      <div class="col-span-1 xl:col-span-2 flex flex-col gap-6 h-full overflow-hidden">
        <ContinueLearningList class="shrink-0" />
        <CourseFeed class="flex-1 min-h-0 overflow-hidden" />
      </div>

      <!-- Right Sidebar Area -->
      <div class="col-span-1 xl:col-span-1 h-full overflow-hidden">
        <CourseNewsWidget />
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from './DashboardLayout.vue'
import CourseListSidebar from '@/components/dashboard/CourseListSidebar.vue'
import ContinueLearningList from '@/components/dashboard/ContinueLearningList.vue'
import CourseFeed from '@/components/dashboard/CourseFeed.vue'
import CourseNewsWidget from '@/components/dashboard/CourseNewsWidget.vue'
</script>
