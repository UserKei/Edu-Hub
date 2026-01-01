import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/dashboard/DashboardView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/courses',
      name: 'course-library',
      component: () => import('../views/course/CourseLibraryView.vue')
    },
    {
      path: '/my-courses',
      name: 'my-courses',
      component: () => import('../views/course/MyCoursesView.vue')
    },
    {
      path: '/learn/:courseId',
      name: 'student-course-detail',
      component: () => import('../views/student/StudentCourseDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/course/new',
      name: 'course-create',
      component: () => import('../views/course/NewCourseView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/course/:id/edit',
      name: 'course-edit',
      component: () => import('../views/course/NewCourseView.vue'),
      meta: { requiresAuth: true }
    }
  ],
})

export default router
