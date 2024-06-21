import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['x-auth-token'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['x-auth-token'];
  }
};
export default apiClient;