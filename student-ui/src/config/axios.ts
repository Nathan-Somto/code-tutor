import axios from "axios";
//@TODO: check environment variables for production set urls
const codeApi = axios.create({
    baseURL: import.meta.env.VITE_CODE_API_URL as string,
});
const mainApi = axios.create({
    baseURL: import.meta.env.VITE_MAIN_API_URL as string,
});
mainApi.interceptors.request.use(
    (config) => {
      const token = JSON.parse(localStorage.getItem('auth-student')?? '{}')?.token;
      console.log("in axios.ts token:", token);
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
export {
    codeApi,
    mainApi
}