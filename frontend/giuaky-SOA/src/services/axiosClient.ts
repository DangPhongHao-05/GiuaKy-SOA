import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://localhost:7001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động gắn Token vào header nếu đã đăng nhập ở các request sau
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;