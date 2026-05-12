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

// Public endpoints that must NOT carry an Authorization header.
// Only list auth/registration routes here — commerce browse endpoints
// (products, categories, vendors) intentionally omitted so that vendor
// write requests (POST/PATCH/DELETE) receive the auth token. Sending a
// token on a public GET is harmless; not sending one on a vendor POST
// causes a 403 Forbidden from the backend.
const PUBLIC_ENDPOINTS = [
  '/api/accounts/register/',
  '/api/accounts/login/',
  '/api/accounts/token/refresh/',
  '/api/accounts/password/forgot/',
  '/api/accounts/password/reset',
  '/api/accounts/verify-email',
  // Categories are public read-only — no auth token needed, and a stale token
  // can cause the backend to return 500 instead of the expected 200.
  '/api/commerce/categories',
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

// Shared promise that deduplicates concurrent token refresh requests.
// Without this, multiple simultaneous 401s each fire their own refresh call.
// Backends that use refresh token rotation invalidate the token after first use,
// so the second concurrent refresh returns 401 → clears storage → logs user out.
let tokenRefreshPromise: Promise<string> | null = null;

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Never attempt a token refresh for auth endpoints — they don't use tokens and
    // a redirect loop would swallow the real error before the page can show it.
    const url = originalRequest.url || '';
    const isAuthEndpoint =
      url.startsWith('/api/accounts/login') ||
      url.startsWith('/api/accounts/register') ||
      url.startsWith('/api/accounts/token/refresh') ||
      url.startsWith('/api/accounts/verify-email');

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        // If a refresh is already in flight, await the same promise rather than
        // issuing a second request. This prevents the race condition where N
        // concurrent 401s each consume the (rotation-invalidated) refresh token.
        if (!tokenRefreshPromise) {
          tokenRefreshPromise = axios
            .post('/api/accounts/token/refresh/', { refresh: refreshToken })
            .then((res) => {
              const raw = res.data ?? {};
              // The backend wraps tokens the same way as login:
              // { tokens: { access, refresh } } OR flat { access, refresh }.
              // Normalize both formats — if only access comes back (legacy), fall through.
              const access: string = raw.tokens?.access ?? raw.access ?? '';
              const refresh: string = raw.tokens?.refresh ?? raw.refresh ?? '';

              if (!access) throw new Error('Refresh response contained no access token');

              localStorage.setItem('access_token', access);
              // Always persist the new refresh token — the backend rotates the
              // token pair on every refresh call (TokenSessionMiddleware updates
              // the Redis session with the NEW pair). Keeping the old refresh
              // token means the next expiry cycle sends a consumed token → SESSION_INVALID.
              if (refresh) localStorage.setItem('refresh_token', refresh);

              return access;
            })
            .finally(() => {
              tokenRefreshPromise = null;
            });
        }

        const newToken = await tokenRefreshPromise;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      } catch {
        // Refresh failed — clear all auth state and send user to sign-in
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        tokenRefreshPromise = null;
        window.location.href = '/auth/signin';
        return Promise.reject(error);
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
    VENDOR_PROFILE_UPDATE: '/api/accounts/path/vendor-update/',
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
    RAISE_DISPUTE: (id: string) => `/admins/dispute/create/${id}/`,
    DISPUTES: '/api/commerce/disputes/',
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

  REVIEWS: {
    LIST: '/api/commerce/vendors/reviews/',
    CREATE: '/api/commerce/vendors/reviews/',
    UPDATE: (id: number) => `/api/commerce/vendors/reviews/${id}/`,
    DELETE: (id: number) => `/api/commerce/vendors/reviews/${id}/`,
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