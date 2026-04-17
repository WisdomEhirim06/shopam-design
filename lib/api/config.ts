import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Base URL for the API
export const API_BASE_URL = 'https://api.shopam.net';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/accounts/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth/signin';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    USER_REGISTER: '/api/accounts/register/customer/',
    VENDOR_REGISTER: '/api/accounts/register/vendor/',
    LOGIN: '/api/accounts/login/',
    LOGOUT: '/api/accounts/logout/',
    PROFILE: '/api/accounts/profile/',
    PASSWORD_CHANGE: '/api/accounts/password/change/',
  },
  
  // Products
  PRODUCTS: {
    LIST: '/api/commerceproducts/',
    DETAIL: (id: string) => `/api/commerceproducts/${id}/`,
    CREATE: '/api/commerceproducts/',
    UPDATE: (id: string) => `/api/commerceproducts/${id}/`,
    DELETE: (id: string) => `/api/commerceproducts/${id}/`,
  },
  
  // Categories
  CATEGORIES: {
    LIST: '/api/commercecategories/',
    DETAIL: (id: number) => `/api/commercecategories/${id}/`,
  },
  
  // Cart
  CART: {
    GET: '/api/commercecart/',
    ADD: '/api/commercecart/add/',
    CLEAR: '/api/commercecart/clear/',
    ITEM_DETAIL: (id: string) => `/api/commercecart/items/${id}/`,
  },
  
  // Orders
  ORDERS: {
    LIST: '/api/commerceorders/',
    CREATE: '/api/commerceorders/',
    DETAIL: (id: string) => `/api/commerceorders/${id}/`,
    UPDATE: (id: string) => `/api/commerceorders/${id}/`,
  },
  
  // Reviews
  REVIEWS: {
    LIST: '/api/commercereviews/',
    CREATE: '/api/commercereviews/',
    DETAIL: (id: number) => `/api/commercereviews/${id}/`,
    UPDATE: (id: number) => `/api/commercereviews/${id}/`,
    DELETE: (id: number) => `/api/commercereviews/${id}/`,
  },
  
  // Social - Posts
  POSTS: {
    LIST: '/api/socialposts/',
    CREATE: '/api/socialposts/',
    DETAIL: (id: number) => `/api/socialposts/${id}/`,
    UPDATE: (id: number) => `/api/socialposts/${id}/`,
    DELETE: (id: number) => `/api/socialposts/${id}/`,
  },
  
  // Social - Likes
  LIKES: {
    CREATE: '/api/sociallikes/',
    DELETE: (id: number) => `/api/sociallikes/${id}/`,
  },
  
  // Social - Comments
  COMMENTS: {
    LIST: '/api/socialcomments/',
    CREATE: '/api/socialcomments/',
    UPDATE: (id: number) => `/api/socialcomments/${id}/`,
    DELETE: (id: number) => `/api/socialcomments/${id}/`,
  },
  
  // Social - Follows
  FOLLOWS: {
    CREATE: '/api/socialfollows/',
    DELETE: (id: number) => `/api/socialfollows/${id}/`,
  },
  
  // Transactions
  TRANSACTIONS: {
    LIST: '/api/commercetransactions/',
    DETAIL: (id: string) => `/api/commercetransactions/${id}/`,
  },
};