import { defineStore } from 'pinia'
import request from '@/utils/request'

let updateChapterTimer = null

export const useCourseCreationStore = defineStore('course-creation', {
  state: () => ({
    currentStep: 1,
    courseId: null,
    courseInfo: {
      title: '',
      description: '',
      cover_image: '',
      type: 'PUBLIC',
      teacher_id: null
    },
    chapters: [],
    currentChapterId: null,
    isLoading: false
  }),

  actions: {
    async createCourse(data) {
      this.isLoading = true
      try {
        // data should be { title, description, cover_image, type, teacher_id }
        const res = await request.post('/api/courses', data)
        this.courseId = res.course.id
        this.courseInfo = { ...this.courseInfo, ...res.course }
        return res
      } finally {
        this.isLoading = false
      }
    },

    async updateCourse(data) {
      this.isLoading = true
      try {
        const res = await request.put(`/api/courses/${this.courseId}`, data)
        this.courseInfo = { ...this.courseInfo, ...res.course }
        return res
      } finally {
        this.isLoading = false
      }
    },

    async fetchCourse(id) {
      this.isLoading = true
      try {
        const res = await request.get(`/api/courses/${id}`)
        this.courseId = res.id
        this.courseInfo = res
        return res
      } finally {
        this.isLoading = false
      }
    },

    async fetchChapters(courseId) {
      this.isLoading = true
      try {
        const res = await request.get(`/api/courses/${courseId}/chapters`)
        this.chapters = res
        return res
      } finally {
        this.isLoading = false
      }
    },

    async addChapter(data) {
      this.isLoading = true
      try {
        // data: { title, parent_id, order, ... }
        const res = await request.post(`/api/courses/${this.courseId}/chapters`, data)
        // Refresh chapters to get the correct structure/ID
        await this.fetchChapters(this.courseId)
        return res
      } finally {
        this.isLoading = false
      }
    },

    async updateChapter(chapterId, data) {
      // Debounce logic
      if (updateChapterTimer) clearTimeout(updateChapterTimer)

      return new Promise((resolve, reject) => {
        updateChapterTimer = setTimeout(async () => {
          try {
            // Don't set global isLoading for background saves to avoid UI flickering
            // or handle it gracefully in UI
            const res = await request.put(
              `/api/courses/${this.courseId}/chapters/${chapterId}`,
              data
            )

            // Update local chapter data if needed, or just rely on fetchChapters
            // For rich text, we might not want to refetch immediately to avoid cursor jumps
            resolve(res)
          } catch (error) {
            reject(error)
          }
        }, 1000)
      })
    },

    async reorderChapters(chaptersData) {
      this.isLoading = true
      try {
        // chaptersData: [{id, order, parent_id}, ...]
        await request.put(`/api/courses/${this.courseId}/chapters/reorder`, {
          chapters: chaptersData
        })
      } finally {
        this.isLoading = false
      }
    },

    async publishCourse() {
      this.isLoading = true
      try {
        const res = await request.patch(`/api/courses/${this.courseId}/publish`)
        this.courseInfo.status = 'PUBLISHED'
        return res
      } finally {
        this.isLoading = false
      }
    },

    async deleteChapter(chapterId) {
        this.isLoading = true
        try {
            await request.delete(`/api/courses/${this.courseId}/chapters/${chapterId}`)
            await this.fetchChapters(this.courseId)
        } finally {
            this.isLoading = false
        }
    }
  }
})
