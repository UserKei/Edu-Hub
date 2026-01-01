import { defineStore } from 'pinia'
import request from '@/utils/request'

export const useCourseStore = defineStore('course', {
  state: () => ({
    publicCourses: [],
    enrolledCourses: [],
    isLoading: false,
    searchQuery: ''
  }),

  actions: {
    async fetchPublicCourses() {
      this.isLoading = true
      try {
        const response = await request({
          url: '/api/courses',
          method: 'get'
        })
        this.publicCourses = response
        return response
      } finally {
        this.isLoading = false
      }
    },

    async fetchEnrolledCourses() {
      this.isLoading = true
      try {
        const response = await request({
          url: '/api/courses/enrolled',
          method: 'get'
        })
        this.enrolledCourses = response
        return response
      } finally {
        this.isLoading = false
      }
    },

    async createCourse(courseData) {
      this.isLoading = true
      try {
        const response = await request({
          url: '/api/courses',
          method: 'post',
          data: courseData
        })
        // 创建后刷新列表
        await this.fetchPublicCourses()
        return response
      } finally {
        this.isLoading = false
      }
    }
  }
})
