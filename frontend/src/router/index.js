import { createRouter, createWebHistory } from 'vue-router'
import CourseEditor from '../views/CourseEditor.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import UserManagement from '../views/admin/UserManagement.vue'
import InviteCodeManagement from '../views/admin/InviteCodeManagement.vue'
import PostList from '../views/forum/PostList.vue'
import PostDetail from '../views/forum/PostDetail.vue'
import PostEditor from '../views/forum/PostEditor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CourseEditor,
    },
    {
      path: '/forum',
      name: 'forum',
      component: PostList
    },
    {
      path: '/forum/new',
      name: 'new-post',
      component: PostEditor,
      meta: { requiresAuth: true }
    },
    {
      path: '/forum/:id',
      name: 'post-detail',
      component: PostDetail
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          redirect: '/admin/users'
        },
        {
          path: 'users',
          name: 'admin-users',
          component: UserManagement
        },
        {
          path: 'invite-codes',
          name: 'admin-invite-codes',
          component: InviteCodeManagement
        }
      ]
    }
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.requiresAdmin) {
    if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
      next();
    } else {
      next('/');
    }
  } else {
    next();
  }
});

export default router
