import axios from 'axios'
import { clearTokens,  getAccessToken, refreshTokens } from './auth'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api',
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        await refreshTokens()
        return api(original)
      } catch {
        clearTokens()
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)