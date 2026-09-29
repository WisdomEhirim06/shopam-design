import type { UserProfile } from './api/types';


const FLAG = process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const DEV_AUTH_BYPASS = FLAG && !IS_PRODUCTION;

const ROLE: 'vendor' | 'customer' =
  process.env.NEXT_PUBLIC_DEV_USER_ROLE === 'vendor' ? 'vendor' : 'customer';

export const DEV_USER: UserProfile = {
  id: 'dev-user',
  username: ROLE === 'vendor' ? 'dev-vendor' : 'dev-customer',
  email: 'dev@shopam.local',
  first_name: 'Dev',
  last_name: ROLE === 'vendor' ? 'Vendor' : 'Shopper',
  phone: '08000000000',
  is_vendor: ROLE === 'vendor',
  is_customer: ROLE !== 'vendor',
};

/** Seed a mock session in localStorage so guards that read it directly pass. */
export function ensureDevSession(): void {
  if (!DEV_AUTH_BYPASS || typeof window === 'undefined') return;
  if (!localStorage.getItem('user')) {
    localStorage.setItem('user', JSON.stringify(DEV_USER));
  }
  document.cookie = `shopam_role=${ROLE}; Path=/; Max-Age=2592000; SameSite=Lax`;
}
