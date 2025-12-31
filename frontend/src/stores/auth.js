import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, register as registerApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || '')

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials) => {
    const response = await loginApi(credentials)

    console.log('Login response:', response)

    token.value = response.token
    user.value = response.user

    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))

    return response
  }

  const register = async (data) => {
    const response = await registerApi(data)

    console.log('Register response:', response)

    return response
  }

  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // router.push('/login') // 可以在组件中处理，或者如果 router 可用也可以在这里处理
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout
  }
})
