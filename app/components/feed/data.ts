import { timeAgo } from '@/lib/format';

/** Normalized post view-model shared by the Feed and vendor shop pages. */
export interface FeedPost {
  id: number;
  vendorName: string;
  verified: boolean;
  followers?: number;
  timeAgo: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  tags: string[];
  isLiked?: boolean;
  isSaved?: boolean;
}

/** Map an API `Post` into the normalized feed view-model. */
export function toFeedPost(raw: any): FeedPost {
  const vendor = raw?.vendor ?? {};
  const name =
    vendor?.business_name ||
    [vendor?.first_name, vendor?.last_name].filter(Boolean).join(' ') ||
    vendor?.username ||
    'ShopAm Vendor';
  const media = Array.isArray(raw?.media) ? raw.media : [];
  const first = media[0];
  const image = typeof first === 'string' ? first : first?.image_url || first?.url || '';

  return {
    id: Number(raw?.id) || 0,
    vendorName: name,
    verified: Boolean(vendor?.is_verified ?? vendor?.is_vendor ?? false),
    followers: undefined,
    timeAgo: raw?.created_at ? timeAgo(raw.created_at) : '',
    image,
    caption: raw?.caption ?? '',
    likes: Number(raw?.likes_count) || 0,
    comments: Number(raw?.comments_count) || 0,
    tags: Array.isArray(raw?.tags) ? raw.tags : [],
    isLiked: Boolean(raw?.is_liked),
    isSaved: false,
  };
}

/** Curated fallback posts so the feed always renders. */
export const FEED_POSTS: FeedPost[] = [
  {
    id: 1,
    vendorName: "Sarah's Fashion",
    verified: true,
    followers: 2340,
    timeAgo: '2h',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=900',
    caption:
      'New collection alert! 🔥 African print dresses now available. Limited stock! These beautiful pieces celebrate African heritage with modern cuts and vibrant patterns. Perfect for any occasion from casual outings to special events. Get yours before they sell out!',
    likes: 234,
    comments: 45,
    tags: ['fashion', 'african', 'dress'],
    isLiked: false,
    isSaved: false,
  },
  {
    id: 2,
    vendorName: 'TechHub Nigeria',
    verified: true,
    followers: 5670,
    timeAgo: '5h',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=900',
    caption:
      'Premium wireless earbuds with noise cancellation. Get yours today! 🎧 Experience crystal clear sound quality with active noise cancellation technology. Long battery life, comfortable fit, and premium build quality make these a must-have.',
    likes: 567,
    comments: 89,
    tags: ['tech', 'earbuds', 'gadgets'],
    isLiked: true,
    isSaved: false,
  },
  {
    id: 3,
    vendorName: 'Kiara Takeaway',
    verified: true,
    followers: 12400,
    timeAgo: '1d',
    image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=900',
    caption: 'Grilled chicken perfection! 🍗 Order now and get 20% off your first order.',
    likes: 1240,
    comments: 156,
    tags: ['food', 'chicken', 'delivery'],
    isLiked: false,
    isSaved: true,
  },
  {
    id: 4,
    vendorName: 'Book Zone',
    verified: false,
    followers: 890,
    timeAgo: '3d',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=900',
    caption: 'New arrivals in fiction! Add these titles to your reading list 📚',
    likes: 89,
    comments: 23,
    tags: ['books', 'reading', 'fiction'],
    isLiked: false,
    isSaved: false,
  },
];
