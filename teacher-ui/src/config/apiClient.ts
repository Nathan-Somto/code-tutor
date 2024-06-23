import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['Authorization'];
  }
  console.log('apiClient headers:', apiClient.defaults.headers.common);
  console.log('axios headers:', axios.defaults.headers.common);
};
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.auth?.token || JSON.parse(localStorage.getItem('auth')?? '{}')?.token;
    console.log("in apiClient.ts token:", token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default apiClient;