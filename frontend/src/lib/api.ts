import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

export function setAuthToken(token: string | null) {
  if (!token) {
    delete api.defaults.headers.common.Authorization
    return
  }
  api.defaults.headers.common.Authorization = `Bearer ${token}`
}

