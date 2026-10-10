import axios from 'axios';
import { STUDENT } from '@constants/student';

const apiClient = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  config.headers.set('X-Student-Id', STUDENT.mssv);
  return config;
});

export default apiClient;
