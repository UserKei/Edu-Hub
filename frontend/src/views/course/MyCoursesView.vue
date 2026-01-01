<script setup>
import { onMounted, computed } from 'vue'
import { useCourseStore } from '@/stores/course'
import CourseActionToolbar from '@/components/course/CourseActionToolbar.vue'
import CourseList from '@/components/course/CourseList.vue'
import CourseCard from '@/components/course/CourseCard.vue'
import CourseLayout from './CourseLayout.vue'

const courseStore = useCourseStore()

// 注意：API 返回的是选课对象 (Enrollment Object)，其中 'course' 属性包含课程详情。
// 我们需要将其映射为扁平的课程列表以适配 CourseCard 组件。
// API 结构参考: [ { id: 1, student_id: 2, course_id: 1, ..., course: { ... } } ]
const courses = computed(() => {
  return courseStore.enrolledCourses.map(enrollment => ({
    ...enrollment.course,
    // 如果需要，保留选课特定的数据
    enrollment_id: enrollment.id,
    progress: enrollment.progress
  }))
})

const isLoading = computed(() => courseStore.isLoading)

const handleSearch = (query) => {
  // 客户端过滤：由于 Store 和 API 目前不支持已选修课程的搜索参数，
  // 我们在这里实现简单的客户端过滤。
  courseStore.searchQuery = query
}

const filteredCourses = computed(() => {
  const query = courseStore.searchQuery.toLowerCase()
  if (!query) return courses.value
  return courses.value.filter(c => c.title.toLowerCase().includes(query))
})

onMounted(async () => {
  try {
    await courseStore.fetchEnrolledCourses()
  } catch (error) {
    console.error('Failed to fetch enrolled courses:', error)
  }
})
</script>

<template>
  <CourseLayout>
    <CourseActionToolbar
      :title="$t('course.my_courses.title')"
      :show-create-button="false"
      @search="handleSearch"
    />

    <CourseList :loading="isLoading" :courses="filteredCourses">
      <CourseCard
        v-for="course in filteredCourses"
        :key="course.id"
        :course="course"
        :is-enrolled="true"
      />
    </CourseList>
  </CourseLayout>
</template>
