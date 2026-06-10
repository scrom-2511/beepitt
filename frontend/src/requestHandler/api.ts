import axios from 'axios';
import { BACKEND_URL } from '@/config/app.config';

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
