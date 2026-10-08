
export function timeAgo(iso: string, now: number = Date.now()): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then) || then <= 0) return '';
  const diff = now - then;
  const day = 86_400_000;
  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < day) return `${Math.floor(diff / 3_600_000)}h`;
  const days = Math.floor(diff / day);
  if (days === 1) return '1d';
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.floor(days / 7)}w`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  return `${Math.floor(days / 365)}y`;
}

/** Compact count label, e.g. 12400 → "12.4k". */
export function compactNumber(value: number): string {
  if (!Number.isFinite(value)) return '0';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(value);
}

/** Group a card number into 4-digit blocks. */
export function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

/** Format an expiry as MM/YY while typing. */
export function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

const CATEGORY_LABELS: Record<string, string> = {
  fashion: 'Fashion',
  beauty_hair: 'Beauty, Hair & Personal Care',
  home_living: 'Home & Living',
  food_drinks: 'Food & Drinks',
  baby_kids: 'Baby & Kids',
  books_stationery: 'Books & Stationery',
  health_wellness: 'Health & Wellness',
  accessories: 'Accessories',
  books: 'Books',
};

/**
 * Normalise a vendor category for display. Handles API slugs (`beauty_hair`),
 * `business_category_display` strings, and already-nice labels consistently.
 */
export function formatCategory(input?: string | null): string {
  const value = (input ?? '').trim();
  if (!value) return '';

  const key = value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  if (CATEGORY_LABELS[key]) return CATEGORY_LABELS[key];

  if (value.includes('_')) {
    return value
      .split('_')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Normalise "Beauty, Hair and Personal Care" → "Beauty, Hair & Personal Care".
  return value.replace(/\band\b/g, '&').replace(/\s+/g, ' ').trim();
}

/**
 * Safe display casing for a shop name: only all-lowercase or all-uppercase
 * names are Title-Cased; mixed-case brand names (e.g. "TechHub", "NG") are
 * left exactly as the vendor wrote them.
 */
export function formatVendorName(input?: string | null): string {
  const value = (input ?? '').trim();
  if (!value) return '';
  const isAllLower = value === value.toLowerCase();
  const isAllUpper = value === value.toUpperCase();
  if (!isAllLower && !isAllUpper) return value;
  return value
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
