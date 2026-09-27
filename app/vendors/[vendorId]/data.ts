import type { ProductService, Vendor } from '@/lib/api';
import { FALLBACK_VENDORS } from '../data';

const titleCase = (value: string) =>
  value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

const COVERS = [
  '/images/shopam pictures/ankara stalls.jpg',
  '/images/products/smartwatch.jpg',
  '/images/shopam pictures/food-vendors.jpg',
  '/images/products/backpack.jpg',
  '/images/shopam pictures/clothing lines.jpg',
  '/images/products/lamp.jpg',
];

/** Best-effort vendor when `/api/commerce/vendors/{id}/` yields nothing. */
export function fallbackVendor(id: string): Vendor {
  const known = FALLBACK_VENDORS.find((v) => v.id === id);
  if (known) return known;

  const index = Math.abs(
    id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % COVERS.length;

  return {
    id,
    name: titleCase(id) || 'ShopAm Vendor',
    category: '',
    location: '',
    bio: '',
    avatar: '',
    cover: COVERS[index],
    rating: 0,
    reviews: 0,
    products: 0,
    followers: 0,
    verified: false,
    isFollowing: false,
  };
}

const product = (
  id: string,
  title: string,
  description: string,
  price: string,
  image: string,
  rating: string,
  reviews: string
): ProductService => ({
  id,
  owner: 'fallback-vendor',
  owner_name: 'ShopAm Vendor',
  title,
  description,
  taxonomy_path: '',
  price,
  tax_inclusive: false,
  item_type: 'product',
  addons: [],
  images: [{ id: `${id}-img`, image_url: image }],
  created_at: '',
  updated_at: '',
  average_rating: rating,
  review_count: reviews,
});

/** Curated products shown when the vendor has no listings yet. */
export const FALLBACK_VENDOR_PRODUCTS: ProductService[] = [
  product('fp1', 'Wireless Earbuds Pro', 'Active noise cancellation, 30-hour battery.', '18000', '/images/products/wireless-earbuds.jpg', '4.8', '234'),
  product('fp2', 'Smart Watch Series 6', 'AMOLED display with health tracking.', '45000', '/images/products/smartwatch.jpg', '4.7', '189'),
  product('fp3', 'Leather Tote Bag', 'Full-grain leather, hand-stitched finish.', '32000', '/images/products/handbad.jpg', '4.6', '321'),
  product('fp4', 'Running Sneakers', 'Lightweight, breathable everyday trainers.', '25000', '/images/products/shoes-black.jpg', '4.8', '278'),
  product('fp5', 'Bluetooth Speaker', 'Deep bass, IPX7 waterproof body.', '18000', '/images/products/speaker.jpg', '4.7', '445'),
  product('fp6', 'Laptop Backpack', 'Padded 15" sleeve with USB port.', '12000', '/images/products/backpack.jpg', '4.5', '167'),
  product('fp7', 'Desk Lamp', 'Warm-to-cool dimmable LED lighting.', '8500', '/images/products/lamp.jpg', '4.7', '234'),
  product('fp8', 'Insulated Bottle', 'Keeps drinks cold for 24 hours.', '4000', '/images/products/bottle.jpg', '4.8', '567'),
];
