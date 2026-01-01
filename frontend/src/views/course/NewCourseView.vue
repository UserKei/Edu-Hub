<template>
  <div class="min-h-screen bg-ctp-base p-6">
    <!-- Step 1 Container -->
    <div v-if="store.currentStep === 1" class="max-w-4xl mx-auto bg-ctp-mantle rounded-xl shadow-lg p-8">
      <h1 class="text-2xl font-bold text-ctp-text mb-6">Create a new course</h1>
      <CourseBaseInfo
        :initial-data="store.courseInfo"
        @submit="handleStep1Submit"
      />
    </div>

    <!-- Step 2 Container (Full Width) -->
    <div v-else class="flex h-[calc(100vh-120px)] gap-6">
      <CourseChapterEditor class="w-full" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseCreationStore } from '@/stores/course-creation'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import CourseBaseInfo from '@/components/course/creation/CourseBaseInfo.vue'
import CourseChapterEditor from '@/components/course/creation/CourseChapterEditor.vue'

const route = useRoute()
const router = useRouter()
const store = useCourseCreationStore()
const authStore = useAuthStore()
const toast = useToast()

onMounted(async () => {
  const id = route.params.id
  if (id) {
    // Edit mode
    await store.fetchCourse(id)
    await store.fetchChapters(id)
    store.currentStep = 1
    store.courseId = id
  } else {
    // Create mode
    store.$reset()
    store.currentStep = 1
    if (authStore.user) {
        store.courseInfo.teacher_id = authStore.user.id
    }
  }
})

const handleStep1Submit = async (data) => {
  try {
    if (store.courseId) {
      await store.updateCourse(data)
    } else {
      await store.createCourse(data)
      // Update URL without reload
      router.replace(`/course/${store.courseId}/edit`)
    }
    store.currentStep = 2
  } catch (error) {
    console.error(error)
    toast.error('Failed to save course info')
  }
}
</script>
