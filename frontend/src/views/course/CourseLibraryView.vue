<script setup>
import { onMounted, computed, ref } from 'vue'
import { useCourseStore } from '@/stores/course'
import { useAuthStore } from '@/stores/auth'
import CourseActionToolbar from '@/components/course/CourseActionToolbar.vue'
import CourseList from '@/components/course/CourseList.vue'
import CourseCard from '@/components/course/CourseCard.vue'
import CourseLayout from './CourseLayout.vue'

const courseStore = useCourseStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const isLoading = computed(() => courseStore.isLoading)
const isTeacher = computed(() => authStore.user?.role === 'TEACHER')

// 客户端过滤，因为 API 目前不支持搜索参数
const courses = computed(() => {
  const list = courseStore.publicCourses
  if (!searchQuery.value) return list
  const query = searchQuery.value.toLowerCase()
  return list.filter(c => c.title.toLowerCase().includes(query))
})

const handleSearch = (query) => {
  searchQuery.value = query
}

const handleCreate = () => {
  // TODO: 打开创建课程模态框或跳转到创建页面
  console.log('Create course clicked')
}

onMounted(async () => {
  try {
    await courseStore.fetchPublicCourses()
  } catch (error) {
    console.error('Failed to fetch courses:', error)
  }
})
</script>

<template>
  <CourseLayout>
    <CourseActionToolbar
      :title="$t('course.library.title')"
      :show-create-button="isTeacher"
      @search="handleSearch"
      @create="handleCreate"
    />

    <CourseList :loading="isLoading" :courses="courses">
      <CourseCard
        v-for="course in courses"
        :key="course.id"
        :course="course"
      />
    </CourseList>
  </CourseLayout>
</template>
