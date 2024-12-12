// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001', // Your backend URL
  headers: {
    'Content-Type': 'application/json', // You can customize headers as needed
  },
});

export default axiosInstance;
