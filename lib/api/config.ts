import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Base URL for the API — empty string routes through Next.js rewrites (/api/* → https://api.shopam.net/api/*)
export const API_BASE_URL = '';

// Create axios instance.
// Do NOT set a default Content-Type here.
// Axios auto-sets  application/json  for plain-object bodies and lets the
// browser set  multipart/form-data; boundary=…  for FormData bodies.
// A hard-coded application/json default causes Axios 1.x to run
// FormDataToJSON() + JSON.stringify() on FormData payloads — File objects
// serialise as {} (empty dicts), which is why the backend was receiving
// uploaded_images as a dictionary instead of a binary list.
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
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

// Track whether a token refresh is already in flight to prevent concurrent
// refresh attempts when multiple requests fail with 401 simultaneously.
let _refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) throw new Error('No refresh token');

  const response = await fetch('/api/accounts/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) throw new Error('Refresh failed');

  const data = await response.json();
  // Backend returns { access } or { tokens: { access } }
  const newAccess: string = data.tokens?.access ?? data.access ?? '';
  if (!newAccess) throw new Error('No access token in refresh response');

  localStorage.setItem('access_token', newAccess);
  return newAccess;
}

// Module-level flag that prevents concurrent 401 responses (e.g. a keepalive
// ping + a page data fetch both failing at the same instant) from each
// independently clearing localStorage and firing window.location.href.
// Resets to false on any successful response so future legitimate 401s are
// still handled correctly after the user logs back in.
let isRedirecting = false;

function clearSessionAndRedirect() {
  if (isRedirecting) return; // another 401 already triggered the redirect
  isRedirecting = true;
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') ?? 'null'); } catch { return null; }
  })();
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  const signinPage = storedUser?.is_vendor ? '/auth/signin' : '/auth/user-signin';
  window.location.href = signinPage;
}

// Response interceptor — handle 401 globally.
//
// Strategy:
//   1. If the failing request is an auth endpoint (login, register, refresh,
//      verify-email, logout, password routes), propagate the error directly so
//      those pages can display their own messages.
//   2. Otherwise, if the user has a refresh token, attempt a silent token
//      refresh exactly once and replay the original request.
//   3. If the refresh itself fails (or there is no refresh token), clear local
//      auth state and redirect to the appropriate sign-in page.
apiClient.interceptors.response.use(
  (response) => {
    // Any successful response means the session is alive — reset the redirect
    // guard so a future genuine 401 (after the user logs back in) is still
    // handled correctly.
    isRedirecting = false;
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retried?: boolean };

    const url = originalRequest?.url || '';

    // Auth endpoints manage their own error messages — never intercept them.
    const isAuthEndpoint =
      url.startsWith('/api/accounts/login') ||
      url.startsWith('/api/accounts/logout') ||
      url.startsWith('/api/accounts/register') ||
      url.startsWith('/api/accounts/token/refresh') ||
      url.startsWith('/api/accounts/verify-email') ||
      url.startsWith('/api/accounts/password');

    // Keepalive pings (tagged with X-Keepalive) must not trigger a redirect.
    // A transient 401 on a background ping is handled by the normal
    // token-refresh path on the next real user-initiated request.
    const isKeepalivePing = !!originalRequest?.headers?.['X-Keepalive'];

    // Commerce endpoints (cart, products, search) currently return 401 due to
    // a backend misconfiguration — the commerce Django app uses a different
    // authentication class than accounts, so JWT Bearer tokens are rejected
    // even when valid. Logging the user out on a cart 401 is incorrect;
    // propagate the error so the page can show an inline message instead.
    // REMOVE this once the backend aligns commerce auth with accounts auth.
    const isCommerceEndpoint = url.startsWith('/api/commerce/');

    if (error.response?.status !== 401 || isAuthEndpoint || isKeepalivePing || isCommerceEndpoint || originalRequest?._retried) {
      return Promise.reject(error);
    }

    // Only attempt refresh when the user had an active session.
    // Unauthenticated users hitting a protected endpoint get the error
    // propagated so the page can show an inline sign-in prompt instead of
    // a jarring redirect.
    const hadSession = !!localStorage.getItem('access_token');
    if (!hadSession) return Promise.reject(error);

    originalRequest._retried = true;

    try {
      // Deduplicate: if a refresh is already in flight, wait for it.
      if (!_refreshPromise) {
        _refreshPromise = refreshAccessToken().finally(() => {
          _refreshPromise = null;
        });
      }
      const newToken = await _refreshPromise;

      // Retry the original request with the fresh token.
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }
      return apiClient(originalRequest);
    } catch {
      // Refresh failed — session is genuinely over.
      clearSessionAndRedirect();
      return Promise.reject(error);
    }
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