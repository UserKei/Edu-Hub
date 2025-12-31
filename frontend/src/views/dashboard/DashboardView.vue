<template>
  <DashboardLayout>
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- Left Sidebar (Course List) - Hidden on small screens, visible on XL -->
      <div class="hidden xl:block xl:col-span-1">
        <CourseListSidebar />
      </div>

      <!-- Main Content Area -->
      <div class="col-span-1 xl:col-span-2 space-y-6">
        <ContinueLearningList />
        <CourseFeed />
      </div>

      <!-- Right Sidebar Area -->
      <div class="col-span-1 xl:col-span-1">
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
