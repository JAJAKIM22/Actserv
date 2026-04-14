import Cookies from 'js-cookie'
import { api } from './api'

export const getAccessToken = () => Cookies.get('access')
export const getRefreshToken = () => Cookies.get('refresh')

export const setTokens = (access: string, refresh: string) => {
  Cookies.set('access', access, { secure: true, sameSite: 'strict' })
  Cookies.set('refresh', refresh, { secure: true, sameSite: 'strict' })
}

export const clearTokens = () => {
  Cookies.remove('access')
  Cookies.remove('refresh')
}

export const refreshTokens = async () => {
  const refresh = getRefreshToken()
  if (!refresh) throw new Error('No refresh token')
  const { data } = await api.post('/auth/refresh/', { refresh })
  setTokens(data.access, refresh)
}