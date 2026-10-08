import apiClient, { API_ENDPOINTS } from './config';
import { formatCategory, formatVendorName } from '../format';
import type { PaginatedResponse } from './types';

/**
 * Normalized vendor view-model. The `/api/commerce/vendors/` endpoint is not
 * typed in the OpenAPI mirror, so we defensively map common field names and
 * fall back gracefully.
 */
export interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  bio: string;
  avatar: string;
  cover: string;
  rating: number;
  reviews: number;
  products: number;
  followers: number;
  verified: boolean;
  isFollowing: boolean;
}

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

const asNumber = (value: unknown): number => {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? ''));
  return Number.isFinite(n) ? n : 0;
};

export function normalizeVendor(raw: any): Vendor {
  const user = raw?.user ?? raw?.owner ?? {};
  const id = String(raw?.id ?? raw?.vendor_id ?? raw?.user_id ?? raw?.username ?? '');
  const name =
    asString(raw?.business_name) ||
    asString(raw?.store_name) ||
    asString(raw?.shop_name) ||
    asString(raw?.name) ||
    [asString(user?.first_name), asString(user?.last_name)].filter(Boolean).join(' ') ||
    asString(raw?.username) ||
    'ShopAm Vendor';

  return {
    id,
    name: formatVendorName(name),
    category: formatCategory(
      asString(raw?.business_category_display) || asString(raw?.business_category) || asString(raw?.category)
    ),
    location: asString(raw?.business_address) || asString(raw?.location) || asString(raw?.city) || asString(raw?.state) || asString(user?.city),
    bio: asString(raw?.bio) || asString(raw?.description) || asString(raw?.business_description),
    avatar: asString(raw?.logo) || asString(raw?.logo_url) || asString(raw?.avatar) || asString(raw?.profile_pic) || asString(user?.profile_pic),
    cover: asString(raw?.cover_image) || asString(raw?.cover_image_url) || asString(raw?.banner) || asString(raw?.cover),
    rating: asNumber(raw?.average_rating ?? raw?.rating ?? raw?.avg_rating),
    reviews: asNumber(raw?.review_count ?? raw?.reviews_count ?? raw?.total_reviews ?? raw?.reviews),
    products: asNumber(raw?.product_count ?? raw?.products_count ?? raw?.total_products ?? raw?.products),
    followers: asNumber(raw?.followers_count ?? raw?.follower_count ?? raw?.followers),
    verified: Boolean(raw?.is_verified ?? raw?.verified ?? raw?.cac_verified ?? raw?.is_cac_verified),
    isFollowing: Boolean(raw?.is_following ?? raw?.following ?? raw?.is_followed),
  };
}

function toPage(data: any): { results: any[]; count: number; next: string | null } {
  if (Array.isArray(data)) return { results: data, count: data.length, next: null };
  return { results: data?.results ?? [], count: data?.count ?? 0, next: data?.next ?? null };
}

export const vendorsService = {
  /** Public vendor directory. */
  async getVendors(params?: Record<string, unknown>): Promise<PaginatedResponse<Vendor>> {
    const response = await apiClient.get(API_ENDPOINTS.VENDORS, { params });
    const { results, count, next } = toPage(response.data);
    return { results: results.map(normalizeVendor), count, next, previous: null };
  },

  /** Single vendor by id (UUID or slug). */
  async getVendor(id: string): Promise<Vendor> {
    const response = await apiClient.get(API_ENDPOINTS.VENDOR_DETAIL(id));
    return normalizeVendor(response.data);
  },
};
