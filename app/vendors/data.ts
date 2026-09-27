import type { Vendor } from '@/lib/api';

/** Curated fallback vendors shown when the directory API returns nothing. */
export const FALLBACK_VENDORS: Vendor[] = [
  {
    id: 'sarahs-fashion',
    name: "Sarah's Fashion",
    category: "Women's Fashion",
    location: 'Lagos',
    bio: 'Authentic African fashion and accessories, tailored in Lagos.',
    avatar: '/images/shopam pictures/african-vendor.jpg',
    cover: '/images/shopam pictures/ankara stalls.jpg',
    rating: 4.9,
    reviews: 234,
    products: 45,
    followers: 2340,
    verified: true,
    isFollowing: false,
  },
  {
    id: 'techhub-nigeria',
    name: 'TechHub Nigeria',
    category: 'Accessories',
    location: 'Abuja',
    bio: 'Your trusted source for gadgets and electronics nationwide.',
    avatar: '/images/products/wireless-earbuds.jpg',
    cover: '/images/products/smartwatch.jpg',
    rating: 4.8,
    reviews: 567,
    products: 128,
    followers: 5670,
    verified: true,
    isFollowing: false,
  },
  {
    id: 'kiara-takeaway',
    name: 'Kiara Takeaway',
    category: 'Food and Drinks',
    location: 'Port Harcourt',
    bio: 'Delicious meals delivered to your doorstep, hot and fresh.',
    avatar: '/images/shopam pictures/food-vendors.jpg',
    cover: '/images/products/chicken.jpg',
    rating: 5,
    reviews: 1240,
    products: 67,
    followers: 12400,
    verified: true,
    isFollowing: false,
  },
  {
    id: 'book-zone',
    name: 'Book Zone',
    category: 'Books',
    location: 'Ibadan',
    bio: 'A wide selection of books across every genre and level.',
    avatar: '/images/products/book.png',
    cover: '/images/products/backpack.jpg',
    rating: 4.7,
    reviews: 345,
    products: 234,
    followers: 890,
    verified: false,
    isFollowing: false,
  },
  {
    id: 'beautyplus-ng',
    name: 'BeautyPlus NG',
    category: 'Beauty, Hair and Personal Care',
    location: 'Lagos',
    bio: 'Premium beauty products and everyday skincare essentials.',
    avatar: '/images/shopam pictures/ladiesskincare.jpg',
    cover: '/images/shopam pictures/makeup.jpg',
    rating: 4.8,
    reviews: 678,
    products: 156,
    followers: 8900,
    verified: true,
    isFollowing: false,
  },
  {
    id: 'home-office-ng',
    name: 'Home & Office NG',
    category: 'Home and Living',
    location: 'Nationwide',
    bio: 'Furniture, décor and office supplies delivered nationwide.',
    avatar: '/images/products/lamp.jpg',
    cover: '/images/shopam pictures/clothing lines.jpg',
    rating: 4.6,
    reviews: 234,
    products: 89,
    followers: 3210,
    verified: true,
    isFollowing: false,
  },
  {
    id: 'naija-fresh-farm',
    name: 'Naija Fresh Farm',
    category: 'Food and Drinks',
    location: 'Nationwide',
    bio: 'Organic farm produce sourced directly from local farmers.',
    avatar: '/images/products/fruits.jpg',
    cover: '/images/shopam pictures/soupdishes.jpg',
    rating: 4.8,
    reviews: 156,
    products: 38,
    followers: 4120,
    verified: true,
    isFollowing: false,
  },
  {
    id: 'kemi-beauty-bar',
    name: 'Kemi Beauty Bar',
    category: 'Beauty, Hair and Personal Care',
    location: 'Abuja',
    bio: 'Wigs, hair care and beauty services by appointment.',
    avatar: '/images/products/hair.jpg',
    cover: '/images/shopam pictures/makeup.jpg',
    rating: 4.9,
    reviews: 72,
    products: 24,
    followers: 1890,
    verified: true,
    isFollowing: false,
  },
];

export type VendorSort = 'top-rated' | 'most-reviewed' | 'name';

export const VENDOR_SORTS: { id: VendorSort; label: string }[] = [
  { id: 'top-rated', label: 'Top rated' },
  { id: 'most-reviewed', label: 'Most reviewed' },
  { id: 'name', label: 'Name (A–Z)' },
];

/** Distinct, non-empty locations from the current vendor list. */
export function uniqueLocations(vendors: Vendor[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of vendors) {
    const loc = (v.location || '').trim();
    if (loc && !seen.has(loc.toLowerCase())) {
      seen.add(loc.toLowerCase());
      out.push(loc);
    }
  }
  return out.sort((a, b) => a.localeCompare(b));
}

/** Maps the shared category-pill slugs to keywords found in vendor categories. */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  home_living: ['home'],
  beauty_hair_personal_care: ['beauty', 'hair'],
  accessories: ['accessor'],
  mens_fashion: ['men'],
  womens_fashion: ['women'],
  baby_kids: ['baby', 'kid'],
  food_drinks: ['food', 'drink'],
};

export function matchesCategory(vendor: Vendor, slug: string): boolean {
  const keywords = CATEGORY_KEYWORDS[slug];
  if (!keywords) return false;
  const haystack = `${vendor.category} ${vendor.name}`.toLowerCase();
  return keywords.some((keyword) => haystack.includes(keyword));
}

