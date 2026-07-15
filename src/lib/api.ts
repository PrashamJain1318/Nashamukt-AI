import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global 401s here
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('mock-user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
