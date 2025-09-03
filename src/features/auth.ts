import { useAtom } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi, LoginRequest, RegisterRequest } from '../services/auth';
import { authAtom } from '../store';

export const useAuth = () => {
  const [auth, setAuth] = useAtom(authAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login(data);
      setAuth({
        token: response.access_token,
        user: response.user,
      });
      navigate('/app');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);

    try {
      await authApi.register(data);
      await login({ email: data.email, password: data.password });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    navigate('/');
  };

  return {
    auth,
    loading,
    error,
    login,
    register,
    logout,
  };
};
