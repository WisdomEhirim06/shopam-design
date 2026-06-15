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
  VendorUpgradeRequest,
} from './types';


function setRoleCookie(isVendor: boolean) {
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `shopam_role=${isVendor ? 'vendor' : 'customer'}; Path=/; Max-Age=2592000; SameSite=Lax${secure}`;
}

export function clearRoleCookie() {
  document.cookie = 'shopam_role=; Path=/; Max-Age=0; SameSite=Lax';
}

export function getRoleCookie(): 'vendor' | 'customer' | null {
  if (typeof document === 'undefined') return null;
 
  const match = document.cookie.match(/(?:^|;\s*)shopam_role=([^;]*)/);
  if (!match) return null;
 
  const value = decodeURIComponent(match[1]);
  return value === 'vendor' || value === 'customer' ? value : null;
}
export const authService = {

  async registerUser(data: UserRegister): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.USER_REGISTER, data);
  },

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


   async upgradeToVendor(data: VendorUpgradeRequest): Promise<FullProfile> {
    let response;
    if (data.logo) {
      const form = new FormData();
      (Object.keys(data) as (keyof VendorUpgradeRequest)[]).forEach((key) => {
        if (key === 'logo') return;
        const val = data[key];
        if (val !== undefined) form.append(key, val as string);
      });
      form.append('logo', data.logo);
      response = await apiClient.post<any>(API_ENDPOINTS.AUTH.VENDOR_UPGRADE, form);
    } else {
      const { logo: _logo, ...rest } = data;
      response = await apiClient.post<any>(API_ENDPOINTS.AUTH.VENDOR_UPGRADE, rest);
    }

    const raw = response.data ?? {};
    const user: UserProfile = raw.user ?? raw;
    const vendor_profile: VendorProfile | undefined = raw.vendor_profile ?? raw.profile ?? undefined;
    localStorage.setItem('user', JSON.stringify(user));
    return { user, vendor_profile };
  },
  async login(data: LoginRequest | { username: string; password: string }): Promise<LoginResponse> {
    const payload = 'username' in data && !('email' in data)
      ? { email: (data as any).username, password: data.password }
      : data;
    const response = await apiClient.post<any>(API_ENDPOINTS.AUTH.LOGIN, payload);
    const raw = response.data;

    const user: UserProfile = raw.user ?? raw;
    setRoleCookie(!!user.is_vendor);


    return { user };
  },

  
  async logout(): Promise<void> {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refresh });
      } else {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
    } finally {
      localStorage.removeItem('user');
      clearRoleCookie();
    }
  },

  
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

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  // Get stored user data
  async getCurrentUser(): Promise<UserProfile | null> {
    const response = await apiClient.get<any>(API_ENDPOINTS.AUTH.PROFILE);
    const raw = response.data ?? {};
    const user: UserProfile = raw.user ?? raw;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
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

  
  async verifyEmail(token: string): Promise<{ authenticated: boolean }> {
  try {
    const response = await apiClient.get<any>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { params: { token } });
    const raw = response.data ?? {};

    // Backend returns { message: "Email verified successfully." } on 200
    if (raw.message) {
      return { authenticated: false };
    }

    // Shouldn't reach here on a 200, but just in case
    throw new Error('Verification failed.');
  } catch (err: any) {
    // Axios throws on 4xx — pull the error message from the response body
    const message = err?.response?.data?.error ?? 'Verification link is invalid or has expired.';
    throw new Error(message);
  }
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
    clearRoleCookie();
  },
};