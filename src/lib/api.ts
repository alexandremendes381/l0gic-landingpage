import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL !;


const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const withAuth = (config: any = {}) => {
  return config;
};

axiosInstance.interceptors.request.use(
  (config) => {
    return withAuth(config);
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Erro na API:', error);
    return Promise.reject(error);
  }
);

const API = {
  get: async (endpoint: string, config = {}) => {
    return axiosInstance.get(endpoint, withAuth(config));
  },
  post: async (endpoint: string, data: unknown, config = {}) => {
    return axiosInstance.post(endpoint, data, withAuth(config));
  },
  put: async (endpoint: string, data: unknown, config = {}) => {
    return axiosInstance.put(endpoint, data, withAuth(config));
  },
  patch: async (endpoint: string, data: unknown, config = {}) => {
    return axiosInstance.patch(endpoint, data, withAuth(config));
  },
  delete: async (endpoint: string, config = {}) => {
    return axiosInstance.delete(endpoint, withAuth(config));
  },
};

export default API;