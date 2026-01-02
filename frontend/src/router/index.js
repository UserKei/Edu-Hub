import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/dashboard/DashboardView.vue'),
      meta: { requiresAuth: true, title: 'dashboard.title' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardView.vue'),
      meta: { requiresAuth: true, title: 'dashboard.title' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guest: true, title: 'auth.login.title' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { guest: true, title: 'auth.register.title' }
    },
    {
      path: '/courses',
      name: 'course-library',
      component: () => import('../views/course/CourseLibraryView.vue'),
      meta: { title: 'course.library.title' }
    },
    {
      path: '/my-courses',
      name: 'my-courses',
      component: () => import('../views/course/MyCoursesView.vue'),
      meta: { requiresAuth: true, title: 'course.my_courses.title' }
    },
    {
      path: '/learn/:courseId',
      name: 'student-course-detail',
      component: () => import('../views/student/StudentCourseDetailView.vue'),
      meta: { requiresAuth: true, title: 'dashboard.continue_learning' }
    },
    {
      path: '/course/new',
      name: 'course-create',
      component: () => import('../views/course/NewCourseView.vue'),
      meta: { requiresAuth: true, title: 'course.action.create' }
    },
    {
      path: '/course/:id/edit',
      name: 'course-edit',
      component: () => import('../views/course/NewCourseView.vue'),
      meta: { requiresAuth: true, title: 'course.action.create' }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
