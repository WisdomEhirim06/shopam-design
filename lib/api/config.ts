import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Base URL for the API — empty string routes through Next.js rewrites (/api/* → https://api.shopam.net/api/*)
export const API_BASE_URL = '';


const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
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

const isPublicEndpoint = (url = '') => PUBLIC_ENDPOINTS.some((p) => url.startsWith(p));

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Auth is handled via the Bearer token attached below and the session
    // cookie; no extra request headers are needed here.
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
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token');

    const access = localStorage.getItem('access_token');
    const response = await fetch('/api/accounts/token/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(access ? { Authorization: `Bearer ${access}` } : {}),
      },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) throw new Error('Refresh failed');

    const data = await response.json();
    // Backend returns { access } or { tokens: { access } }
    const newAccess: string = data.tokens?.access ?? data.access ?? '';
    if (!newAccess) throw new Error('No access token in refresh response');

    localStorage.setItem('access_token', newAccess);

    const newRefresh: string = data.tokens?.refresh ?? data.refresh ?? '';
    if (newRefresh) localStorage.setItem('refresh_token', newRefresh);

    return newAccess;
  })();

  try {
    return await _refreshPromise;
  } finally {
    _refreshPromise = null;
  }
}

/** Drop all local session state (no navigation — callers decide what to show). */
function clearSession() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  // Expire the role-hint cookie set by authService.login.
  document.cookie = 'shopam_role=; Path=/; Max-Age=0; SameSite=Lax';
}

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;
    const status = error.response?.status;
    const url = config?.url ?? '';
    const isKeepalive = Boolean(
      config?.headers && (config.headers as Record<string, unknown>)['X-Keepalive']
    );

    // Only 401s are auth problems. Never bounce the user on 400/403/404/5xx
    // or network failures — public pages render their own empty/fallback state.
    if (status !== 401 || !config || isPublicEndpoint(url) || isKeepalive) {
      return Promise.reject(error);
    }

    // A guest (never signed in) who hits an auth-required endpoint should NOT
    // be redirected. The page/action decides whether to prompt for sign-in.
    if (typeof window === 'undefined' || !localStorage.getItem('refresh_token')) {
      return Promise.reject(error);
    }

    // Expired access token: try one silent refresh + replay before giving up.
    if (!config._retry) {
      config._retry = true;
      try {
        const access = await refreshAccessToken();
        const headers = config.headers as unknown as { set?: (k: string, v: string) => void };
        if (headers?.set) {
          headers.set('Authorization', `Bearer ${access}`);
        } else {
          config.headers = {
            ...(config.headers as Record<string, string>),
            Authorization: `Bearer ${access}`,
          } as InternalAxiosRequestConfig['headers'];
        }
        return apiClient(config);
      } catch {
        clearSession();
        return Promise.reject(error);
      }
    }

    // Refresh token is dead: clear the stale session but do NOT force a
    // redirect. Protected areas guard themselves, so sign-in is only ever
    // requested when the user takes an action that needs an account.
    clearSession();
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
  },

  // Products
  PRODUCTS: {
    LIST: '/api/commerce/products/',
    MY_PRODUCTS: '/api/commerce/my-products/',
    DETAIL: (id: string) => `/api/commerce/products/${id}/`,
    CREATE: '/api/commerce/products/',
    UPDATE: (id: string) => `/api/commerce/products/${id}/`,
    UPDATE_STOCK: (id: string) => `/api/commerce/products/${id}/update-stock`,
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
