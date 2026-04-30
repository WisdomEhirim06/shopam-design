import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Base URL for the API — empty string routes through Next.js rewrites (/api/* → https://api.shopam.net/api/*)
export const API_BASE_URL = '';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public endpoints that must NOT carry an Authorization header
const PUBLIC_ENDPOINTS = [
  '/api/accounts/register/',
  '/api/accounts/login/',
  '/api/accounts/token/refresh/',
  '/api/accounts/password/forgot/',
  '/api/accounts/password/reset',
  '/api/accounts/verify-email',
];

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const url = config.url || '';
    const isPublic = PUBLIC_ENDPOINTS.some((p) => url.startsWith(p));

    if (!isPublic) {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
          const response = await axios.post(`/api/accounts/token/refresh/`, {
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
    PROFILE_UPDATE: '/api/accounts/profile/update/',
    PROFILE_DEACTIVATE: '/api/accounts/profile/deactivate/',
    PASSWORD_CHANGE: '/api/accounts/password/change/',
    FORGOT_PASSWORD: '/api/accounts/password/forgot/',
    RESET_PASSWORD: '/api/accounts/password/reset',
    VERIFY_EMAIL: '/api/accounts/verify-email',
    TOKEN_REFRESH: '/api/accounts/token/refresh/',
  },

  // Products
  PRODUCTS: {
    LIST: '/api/commerce/products/',
    MY_PRODUCTS: '/api/commerce/my-products/',
    DETAIL: (id: string) => `/api/commerce/products/${id}/`,
    CREATE: '/api/commerce/products/',
    UPDATE: (id: string) => `/api/commerce/products/${id}/`,
    DELETE: (id: string) => `/api/commerce/products/${id}/`,
  },

  // Categories
  CATEGORIES: {
    LIST: '/api/commerce/categories/', // Assumed pattern
    DETAIL: (id: number) => `/api/commerce/categories/${id}/`,
  },

  // Cart
  CART: {
    GET: '/api/commerce/cart/',
    ADD: '/api/commerce/cart/add/',
    CLEAR: '/api/commerce/cart/clear/',
    ITEM_DETAIL: (id: string) => `/api/commerce/cart/items/${id}/`,
  },

  // Orders
  ORDERS: {
    VENDOR_LIST: '/api/commerce/vendor/orders/',
    LIST: '/api/commerce/orders/',
    PLACE: '/api/commerce/orders/place/',
    FILTER: '/api/commerce/orders/filter',
    HISTORY: '/api/commerce/orders/history/',
    DETAIL: (id: string) => `/api/commerce/orders/filter?order_id=${id}`,
    UPDATE: (id: string) => `/api/commerce/orders/${id}/`,
    VENDOR_REVIEW: (id: string) => `/api/commerce/orders/${id}/vendor-review/`,
    CUSTOMER_APPROVE: (id: string) => `/api/commerce/orders/${id}/customer-approve/`,
    SET_SHIPPING: (id: string) => `/api/commerce/orders/${id}/set-shipping/`,
    SET_SHIPPING_FEE: (id: string) => `/api/commerce/orders/${id}/set-shipping-fee/`,
    PAYMENT_DECISION: (id: string) => `/api/commerce/orders/${id}/payment-decision/`,
    START_DELIVERY: (id: string) => `/api/commerce/orders/${id}/start-delivery/`,
    CONFIRM_HANDOVER: (id: string) => `/api/commerce/orders/${id}/confirm-handover/`,
    RAISE_DISPUTE: (id: string) => `/api/commerce/orders/${id}/dispute/`,
  },

  // Payments (Monnify)
  PAYMENTS: {
    INIT: '/api/payments/checkout/init/',
    DIRECT_CHARGE: '/api/payments/direct-charge/',
    BANK_TRANSFER: '/api/payments/bank-transfer/',
    AUTHORIZE_OTP: '/api/payments/authorize-otp/',
    HISTORY: '/api/payments/history/',
    PENDING: '/api/payments/pending/',
    STATUS: (txRef: string) => `/api/payments/status/${txRef}/`,
    DETAIL: (txRef: string) => `/api/payments/detail/${txRef}/`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/notifications/notifications/',
    DETAIL: (id: number) => `/api/notifications/notifications/${id}/`,
    MARK_READ: (id: number) => `/api/notifications/notifications/${id}/mark_read/`,
    MARK_ALL_READ: '/api/notifications/notifications/mark_all_read/',
  },

  // Messages / DM
  MESSAGES: {
    LIST: '/api/posts/messages/',
    THREAD: '/api/posts/messages/thread/',
    DETAIL: (id: string) => `/api/posts/messages/${id}/`,
  },

  // Reviews — spec: GET/POST /api/commercevendors/reviews/
  REVIEWS: {
    LIST: '/api/commercevendors/reviews/',
    CREATE: '/api/commercevendors/reviews/',
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