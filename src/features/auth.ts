import { useState } from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { authAtom } from '../store'
import { authApi, LoginRequest, RegisterRequest } from '../api/auth'

export const useAuth = () => {
  const [auth, setAuth] = useAtom(authAtom)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const login = async (data: LoginRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await authApi.login(data)
      setAuth({
        token: response.access_token,
        user: response.user
      })
      navigate('/app')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      await authApi.register(data)
      // After registration, login the user
      await login({ email: data.email, password: data.password })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setAuth({ token: null, user: null })
    navigate('/')
  }

  return {
    auth,
    loading,
    error,
    login,
    register,
    logout
  }
}
