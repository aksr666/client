import axios from 'axios';
import { getDefaultStore } from 'jotai';

import { authAtom } from '../store';

const API_BASE_URL = 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const store = getDefaultStore();
    const auth = store.get(authAtom);

    if (auth.token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${auth.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const store = getDefaultStore();
      store.set(authAtom, { token: null, user: null });
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default api;
