import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import request from '@/utils/request'

// Simple debounce utility
function debounce(func, wait) {
  let timeout
  return function(...args) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(context, args), wait)
  }
}

export const useStudentCourseStore = defineStore('student-course', () => {
  const course = ref(null)
  const enrollment = ref(null)
  const chapters = ref([])
  const currentChapter = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Computed: Progress Percentage
  const progressPercentage = computed(() => {
    if (!chapters.value.length) return 0

    // Get all content chapters (leaf nodes)
    // Note: flatChapters is already computed below, but we can't use it before it's defined if we keep this order.
    // However, Vue computed properties are lazy, so referencing flatChapters inside the callback is fine
    // as long as flatChapters is defined in the same scope.
    // But flatChapters is defined AFTER this block. Let's move flatChapters definition up or use the helper directly.

    const allFiles = flattenChapters(chapters.value)
    if (allFiles.length === 0) return 0

    const completedCount = allFiles.filter(c => c.is_completed).length
    return Math.round((completedCount / allFiles.length) * 100)
  })

  // Helper: Flatten chapters to linear list for navigation
  const flattenChapters = (list) => {
    let result = []
    for (const chapter of list) {
      if (chapter.type === 'FILE') {
        result.push(chapter)
      }
      if (chapter.children && chapter.children.length) {
        result = result.concat(flattenChapters(chapter.children))
      }
    }
    return result
  }

  const flatChapters = computed(() => flattenChapters(chapters.value))

  const prevChapterId = computed(() => {
    if (!currentChapter.value) return null
    const index = flatChapters.value.findIndex(c => c.id === currentChapter.value.id)
    if (index > 0) return flatChapters.value[index - 1].id
    return null
  })

  const nextChapterId = computed(() => {
    if (!currentChapter.value) return null
    const index = flatChapters.value.findIndex(c => c.id === currentChapter.value.id)
    if (index !== -1 && index < flatChapters.value.length - 1) return flatChapters.value[index + 1].id
    return null
  })

  // Helper: Find chapter by ID recursively
  const findChapterById = (list, id) => {
    for (const chapter of list) {
      if (chapter.id === id) return chapter
      if (chapter.children && chapter.children.length) {
        const found = findChapterById(chapter.children, id)
        if (found) return found
      }
    }
    return null
  }

  // Helper: Find first leaf node (FILE type)
  const findFirstLeaf = (list) => {
    for (const chapter of list) {
      if (chapter.type === 'FILE') return chapter
      if (chapter.children && chapter.children.length) {
        const found = findFirstLeaf(chapter.children)
        if (found) return found
      }
    }
    return null
  }

  const fetchCourseContent = async (courseId) => {
    isLoading.value = true
    error.value = null
    currentChapter.value = null // Reset current chapter to avoid stale state

    try {
      const res = await request.get(`/api/courses/${courseId}/content`)
      course.value = res.course
      enrollment.value = res.enrollment
      chapters.value = res.chapters

      // Auto-selection logic
      if (enrollment.value.last_chapter_id) {
        const lastChapter = findChapterById(chapters.value, enrollment.value.last_chapter_id)
        if (lastChapter) {
          currentChapter.value = lastChapter
        }
      }

      if (!currentChapter.value) {
        currentChapter.value = findFirstLeaf(chapters.value)
      }
    } catch (err) {
      error.value = err
      console.error('Failed to fetch course content:', err)
    } finally {
      isLoading.value = false
    }
  }

  const _updateLearningProgress = async (courseId, chapterId, progress) => {
    try {
      await request.post(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        progress,
        status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS'
      })
      if (enrollment.value) {
        enrollment.value.last_chapter_id = chapterId
      }
    } catch (err) {
      console.error('Failed to update progress:', err)
    }
  }

  // Create the debounced function once
  const debouncedUpdateProgress = debounce(_updateLearningProgress, 1000)

  const updateLearningProgress = (progress) => {
    if (!currentChapter.value || !course.value) return

    // Update local state immediately
    currentChapter.value.progress = progress
    if (progress >= 100) {
      currentChapter.value.is_completed = true
      // Force immediate update for completion
      _updateLearningProgress(course.value.id, currentChapter.value.id, progress)
    } else {
      // Call debounced API update
      debouncedUpdateProgress(course.value.id, currentChapter.value.id, progress)
    }
  }

  const setCurrentChapter = (chapterId) => {
    const chapter = findChapterById(chapters.value, chapterId)
    if (chapter) {
      currentChapter.value = chapter
    }
  }

  return {
    course,
    enrollment,
    chapters,
    currentChapter,
    isLoading,
    error,
    progressPercentage,
    prevChapterId,
    nextChapterId,
    fetchCourseContent,
    setCurrentChapter,
    updateLearningProgress
  }
})
