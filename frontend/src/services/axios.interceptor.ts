// axiosInstance.ts
import axios from "axios";
console.log(import.meta.env.VITE_BAKEND);

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BAKEND, // replace with your actual API URL
  withCredentials: true, // always send cookies
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error.response.data);
  }
);

export default axiosInstance;
