import apiClient, { API_ENDPOINTS } from './config';
import type {
  UserRegister,
  VendorRegister,
  LoginRequest,
  LoginResponse,
  UserProfile,
  VendorProfile,
  FullProfile,
  PasswordChangeRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
} from './types';

export const authService = {
  /**
   * Register a new user (customer). Backend sends a verification email — user must verify
   * before they can log in. Redirect to /auth/user-verify after calling this.
   */
  async registerUser(data: UserRegister): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.USER_REGISTER, data);
  },

  /**
   * Register a new vendor. Backend sends a verification email — user must verify before
   * they can log in. Redirect to /auth/user-verify after calling this.
   * Sends multipart/form-data when a logo file is included.
   */
  async registerVendor(data: VendorRegister): Promise<void> {
    if (data.logo) {
      const form = new FormData();
      (Object.keys(data) as (keyof VendorRegister)[]).forEach((key) => {
        if (key === 'logo') return;
        const val = data[key];
        if (val !== undefined) form.append(key, val as string);
      });
      form.append('logo', data.logo);
      await apiClient.post(API_ENDPOINTS.AUTH.VENDOR_REGISTER, form);
    } else {
      const { logo: _logo, ...rest } = data;
      await apiClient.post(API_ENDPOINTS.AUTH.VENDOR_REGISTER, rest);
    }
  },

  /**
   * Login user or vendor
   */
  async login(data: LoginRequest | { username: string; password: string }): Promise<LoginResponse> {
    const payload = 'username' in data && !('email' in data)
      ? { email: (data as any).username, password: data.password }
      : data;
    const response = await apiClient.post<any>(API_ENDPOINTS.AUTH.LOGIN, payload);
    const raw = response.data;

    // API wraps tokens: { tokens: { access, refresh }, user } — normalise to flat LoginResponse
    const access: string = raw.tokens?.access ?? raw.access ?? '';
    const refresh: string = raw.tokens?.refresh ?? raw.refresh ?? '';
    const user: UserProfile = raw.user ?? raw;

    if (access) {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      // Set a session indicator cookie so Next.js middleware can protect routes
      // without needing to read localStorage (which isn't available server-side).
      // This is NOT the actual token — just a flag readable by the edge runtime.
      document.cookie = 'shopam_session=1; path=/; max-age=604800; SameSite=Lax';
    }

    return { access, refresh, user };
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refresh });
      } else {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
    } finally {
      // Clear tokens even if API call fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      document.cookie = 'shopam_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  },

  /**
   * Change user password
   */
  async changePassword(data: PasswordChangeRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.PASSWORD_CHANGE, data);
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<any>(API_ENDPOINTS.AUTH.PROFILE);
    // API returns { user: {...}, profile: {...} } — extract user
    return response.data?.user ?? response.data;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  /**
   * Get stored user data
   */
  getCurrentUser(): UserProfile | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },

  /**
   * Send password reset link to email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  /**
   * Reset password using token from email link
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },

  /**
   * Verify email using token from query param or 6-digit code.
   * If the backend returns tokens in the response, stores them and returns
   * { authenticated: true } so the caller can skip the sign-in step.
   * Otherwise returns { authenticated: false } — the caller should redirect
   * to the sign-in page with ?verified=1.
   */
  async verifyEmail(token: string): Promise<{ authenticated: boolean }> {
    const response = await apiClient.get<any>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { params: { token } });
    const raw = response.data ?? {};

    const access: string = raw.tokens?.access ?? raw.access ?? '';
    const refresh: string = raw.tokens?.refresh ?? raw.refresh ?? '';
    const user = raw.user ?? null;

    if (access) {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      return { authenticated: true };
    }
    return { authenticated: false };
  },

  /**
   * Fetch the full profile from the server and update localStorage
   */
  async refreshProfile(): Promise<UserProfile> {
    const response = await apiClient.get<any>(API_ENDPOINTS.AUTH.PROFILE);
    const profile: UserProfile = response.data?.user ?? response.data;
    localStorage.setItem('user', JSON.stringify(profile));
    return profile;
  },

  /**
   * Fetch user + vendor business profile together.
   * API returns { user: {...}, vendor_profile: {...} } for vendors.
   */
  async getFullProfile(): Promise<FullProfile> {
    const response = await apiClient.get<any>(API_ENDPOINTS.AUTH.PROFILE);
    const raw = response.data ?? {};
    const user: UserProfile = raw.user ?? raw;
    const vendor_profile: VendorProfile | undefined = raw.vendor_profile ?? raw.profile ?? undefined;
    localStorage.setItem('user', JSON.stringify(user));
    return { user, vendor_profile };
  },

  /**
   * Partially update the authenticated user's profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await apiClient.patch<UserProfile>(
      API_ENDPOINTS.AUTH.PROFILE_UPDATE,
      data
    );
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  /**
   * Soft-delete the authenticated user's account
   */
  async deactivateAccount(): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.AUTH.PROFILE_DEACTIVATE);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    document.cookie = 'shopam_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  },
};