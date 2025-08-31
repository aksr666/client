import axios from 'axios'
import { authAtom } from '../store'
import { getDefaultStore } from 'jotai'

const API_BASE_URL = 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const store = getDefaultStore()
    const auth = store.get(authAtom)
    
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const store = getDefaultStore()
      store.set(authAtom, { token: null, user: null })
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
