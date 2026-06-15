import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Base URL for the API — empty string routes through Next.js rewrites (/api/* → https://api.shopam.net/api/*)
export const API_BASE_URL = '';




const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

const PUBLIC_ENDPOINTS = [
  '/api/accounts/register',
  '/api/accounts/login',
  '/api/accounts/token/refresh',
  '/api/accounts/password/forgot',
  '/api/accounts/password/reset',
  '/api/accounts/verify-email',
  '/api/accounts/user-verify',
  '/api/commerce/categories',
];

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 2. REMOVED the localStorage 'access_token' logic. 
    // We don't need it because withCredentials handles the session cookie automatically.
    
    // You can keep CSRF token logic here if Django requires it for POST requests
    // Example: config.headers['X-CSRFToken'] = getCsrfTokenCookie();

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 3. Add a RESPONSE interceptor to handle expired sessions
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // If the backend says the cookie is invalid or expired
    if (error.response?.status === 401) {
      // Clear frontend user data
      localStorage.removeItem('user');
      
      // Redirect to login only if we aren't already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/signin')) {
        window.location.href = '/auth/signin';
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
    USER_REGISTER: '/api/accounts/register/customer',
    VENDOR_REGISTER: '/api/accounts/register/vendor',
    LOGIN: '/api/accounts/login',
    LOGOUT: '/api/accounts/logout',
    PROFILE: '/api/accounts/profile',
    PROFILE_UPDATE: '/api/accounts/profile/update',
    PROFILE_DEACTIVATE: '/api/accounts/profile/deactivate',
    PASSWORD_CHANGE: '/api/accounts/password/change',
    FORGOT_PASSWORD: '/api/accounts/password/forgot',
    RESET_PASSWORD: '/api/accounts/password/reset',
    VERIFY_EMAIL: '/api/accounts/user-verify',
    TOKEN_REFRESH: '/api/accounts/token/refresh',
    VENDOR_PROFILE_UPDATE: '/api/accounts/path/vendor-update',
    VENDOR_UPGRADE: '/api/accounts/upgrade-vendor',
  },

  // Products
  PRODUCTS: {
    LIST: '/api/commerce/products/',
    MY_PRODUCTS: '/api/commerce/my-products/',
    DETAIL: (id: string) => `/api/commerce/products/${id}/`,
    CREATE: '/api/commerce/products/',
    UPDATE: (id: string) => `/api/commerce/products/${id}/`,
    DELETE: (id: string) => `/api/commerce/products/${id}/`,
    ADDONS: (productId: string) => `/api/commerce/products/${productId}/addons/`,
    ADDON_DETAIL: (productId: string, id: string) => `/api/commerce/products/${productId}/addons/${id}/`,
  },

  // Categories (Taxonomy) — no trailing slash so Next.js trailingSlash:false
  // does not issue a 308 redirect before the proxy can handle the request.
  CATEGORIES: {
    LIST: '/api/commerce/categories',
    DETAIL: (id: string) => `/api/commerce/categories/${id}`,
  },

  // Discovery — use /search/ for keyword queries (takes ?q=); products list
  // supports ?ordering, ?page, ?page_size, ?item_type, ?owner but NOT ?search.
  SEARCH: '/api/commerce/search/',
  VENDORS: '/api/commerce/vendors/',
  VENDOR_DETAIL: (id: string | number) => `/api/commerce/vendors/${id}/`,
  VENDOR_REVIEWS: '/api/commerce/vendors/reviews/',

  // Cart
  CART: {
    GET: '/api/commerce/cart/',
    ADD: '/api/commerce/cart/add/',
    CLEAR: '/api/commerce/cart/clear/',
    ITEM_DETAIL: (id: string) => `/api/commerce/cart/items/${id}/`,
  },

  // Orders
  ORDERS: {
    VENDOR_LIST: '/api/commerce/vendor/orders',
    LIST: '/api/commerce/orders',
    PLACE: '/api/commerce/orders/place',
    FILTER: '/api/commerce/orders/filter',
    HISTORY: '/api/commerce/orders/history',
    DETAIL: (id: string) => `/api/commerce/orders/filter?order_id=${id}`,
    UPDATE: (id: string) => `/api/commerce/orders/${id}/`,
    VENDOR_REVIEW: (id: string) => `/api/commerce/orders/${id}/vendor-review`,
    CUSTOMER_APPROVE: (id: string) => `/api/commerce/orders/${id}/customer-approve`,
    SET_SHIPPING: (id: string) => `/api/commerce/orders/${id}/set-shipping`,
    SET_SHIPPING_FEE: (id: string) => `/api/commerce/orders/${id}/set-shipping-fee`,
    PAYMENT_DECISION: (id: string) => `/api/commerce/orders/${id}/payment-decision`,
    START_DELIVERY: (id: string) => `/api/commerce/orders/${id}/start-delivery`,
    CONFIRM_HANDOVER: (id: string) => `/api/commerce/orders/${id}/confirm-handover`,
    RAISE_DISPUTE: (id: string) => `/admins/dispute/create/${id}`,
    DISPUTES: '/api/commerce/disputes/',
  },

  // Payments (Monnify)
  PAYMENTS: {
    INIT: '/api/payments/checkout/init',
    DIRECT_CHARGE: '/api/payments/direct-charge',
    BANK_TRANSFER: '/api/payments/bank-transfer',
    AUTHORIZE_OTP: '/api/payments/authorize-otp',
    HISTORY: '/api/payments/history',
    PENDING: '/api/payments/pending',
    STATUS: (txRef: string) => `/api/payments/status/${txRef}`,
    DETAIL: (txRef: string) => `/api/payments/detail/${txRef}`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/notifications/notifications',
    DETAIL: (id: number) => `/api/notifications/notifications/${id}`,
    MARK_READ: (id: number) => `/api/notifications/notifications/${id}/mark_read`,
    MARK_ALL_READ: '/api/notifications/notifications/mark_all_read',
  },

  // Messages / DM
  MESSAGES: {
    LIST: '/api/posts/messages',
    THREAD: '/api/posts/messages/thread',
    DETAIL: (id: string) => `/api/posts/messages/${id}`,
  },

  REVIEWS: {
    LIST: '/api/commerce/vendors/reviews',
    CREATE: '/api/commerce/vendors/reviews',
    UPDATE: (id: number) => `/api/commerce/vendors/reviews/${id}`,
    DELETE: (id: number) => `/api/commerce/vendors/reviews/${id}`,
  },

  // Social - Posts
  POSTS: {
    LIST: '/api/socialposts',
    CREATE: '/api/socialposts',
    DETAIL: (id: number) => `/api/socialposts/${id}`,
    UPDATE: (id: number) => `/api/socialposts/${id}`,
    DELETE: (id: number) => `/api/socialposts/${id}`,
  },

  // Social - Likes
  LIKES: {
    CREATE: '/api/sociallikes',
    DELETE: (id: number) => `/api/sociallikes/${id}`,
  },

  // Social - Comments
  COMMENTS: {
    LIST: '/api/socialcomments/',
    CREATE: '/api/socialcomments/',
    UPDATE: (id: number) => `/api/socialcomments/${id}`,
    DELETE: (id: number) => `/api/socialcomments/${id}`,
  },

  // Social - Follows
  FOLLOWS: {
    CREATE: '/api/socialfollows',
    DELETE: (id: number) => `/api/socialfollows/${id}`,
  },

  // Transactions
  TRANSACTIONS: {
    LIST: '/api/commercetransactions/',
    DETAIL: (id: string) => `/api/commercetransactions/${id}`,
  },
};