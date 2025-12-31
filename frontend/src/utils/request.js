import axios from 'axios'

const service = axios.create({
  baseURL: 'http://127.0.0.1:3000',
  timeout: 5000
})

// Request interceptor
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // Handle specific error codes if needed
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      // You might want to redirect to login here or handle it in the store/component
    }
    return Promise.reject(error)
  }
)

export default service
