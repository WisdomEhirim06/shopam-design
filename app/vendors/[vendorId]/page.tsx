'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  MapPin,
  Check,
  MessageCircle,
  Search,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import {
  vendorsService,
  productsService,
  postsService,
  cartService,
  authService,
  followsService,
} from '@/lib/api';
import type { ProductService, Vendor } from '@/lib/api';
import { compactNumber } from '@/lib/format';
import Navbar from '../../components/home/Navbar';
import ProductCard from '../../explore/components/ProductCard';
import PostCard from '../../components/feed/PostCard';
import { toFeedPost, FEED_POSTS, type FeedPost } from '../../components/feed/data';
import { fallbackVendor, FALLBACK_VENDOR_PRODUCTS } from './data';

type Tab = 'products' | 'posts' | 'info';

function Stars({ value, size = 15 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(value) ? 'fill-gold text-gold' : 'text-slate-300'}
        />
      ))}
    </span>
  );
}

export default function VendorShopPage() {
  const params = useParams();
  const vendorId = decodeURIComponent((params?.vendorId as string) ?? '');

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<ProductService[]>([]);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [following, setFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!vendorId) return;
    let active = true;
    setLoading(true);

    vendorsService
      .getVendor(vendorId)
      .then((data) => {
        if (!active) return;
        setVendor(data);
        setFollowing(data.isFollowing);
      })
      .catch(() => {
        if (active) {
          const fb = fallbackVendor(vendorId);
          setVendor(fb);
          setFollowing(fb.isFollowing);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    productsService
      .getProducts({ vendor: vendorId, page_size: 24 })
      .then((res) => {
        if (active) setProducts(res.results.length > 0 ? res.results : FALLBACK_VENDOR_PRODUCTS);
      })
      .catch(() => {
        if (active) setProducts(FALLBACK_VENDOR_PRODUCTS);
      });

    postsService
      .getPosts({ vendor: vendorId, page_size: 12 })
      .then((res) => {
        if (!active) return;
        const mapped = (res.results ?? []).map(toFeedPost).filter((p) => p.image);
        setPosts(mapped.length > 0 ? mapped : FEED_POSTS.slice(0, 3));
      })
      .catch(() => {
        if (active) setPosts(FEED_POSTS.slice(0, 3));
      });

    return () => {
      active = false;
    };
  }, [vendorId]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = async (item: ProductService) => {
    try {
      await cartService.addToCart({ product_id: item.id, quantity: 1, product: item });
      window.dispatchEvent(new Event('shopam:cart-updated'));
      showToast('Added to cart!', 'success');
    } catch {
      showToast('Failed to add to cart.', 'error');
    }
  };

  const toggleFollow = async () => {
    if (!authService.isAuthenticated()) {
      window.location.href = `/auth/signin?redirect=${encodeURIComponent(`/vendors/${vendorId}`)}`;
      return;
    }
    setFollowBusy(true);
    try {
      if (!following) {
        await followsService.followVendor({ followed_vendor: vendorId });
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    } catch {
      /* follow is non-critical */
    } finally {
      setFollowBusy(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = products.filter(
      (p) => !q || `${p.title} ${p.description ?? ''}`.toLowerCase().includes(q)
    );
    switch (sortBy) {
      case 'price-low':
        return [...list].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price-high':
        return [...list].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      default:
        return list;
    }
  }, [products, searchQuery, sortBy]);

  if (loading || !vendor) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar actions />
        <main className="mx-auto max-w-7xl animate-pulse px-4 pb-28 pt-28 sm:px-6 lg:px-8">
          <div className="h-44 rounded-3xl bg-slate-100 sm:h-60" />
          <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-3">
            <div className="h-24 w-24 rounded-full bg-slate-100" />
            <div className="h-8 w-56 rounded bg-slate-100" />
            <div className="h-4 w-40 rounded bg-slate-100" />
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-slate-100" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'products', label: 'Products', count: products.length },
    { id: 'posts', label: 'Posts', count: posts.length },
    { id: 'info', label: 'Info' },
  ];

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink antialiased">
      <Navbar actions />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed left-1/2 top-20 z-[200] -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg ${
              toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-28 sm:px-6 lg:px-8">
        <Link
          href="/vendors"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} />
          All shops
        </Link>

        {/* Cover */}
        <div className="relative h-44 overflow-hidden rounded-3xl bg-slate-100 sm:h-60 lg:h-72">
          {vendor.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={vendor.cover} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#FA3728] to-[#E31B23]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10" />

          {vendor.rating > 0 && (
            <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">
              <Star size={12} className="fill-gold text-gold" />
              {vendor.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Centered identity */}
        <div className="relative -mt-14 flex flex-col items-center px-4 text-center sm:-mt-16">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-canvas bg-white shadow-md sm:h-28 sm:w-28">
            {vendor.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={vendor.avatar} alt={vendor.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FA3728] to-[#E31B23] text-3xl font-black text-white">
                {vendor.name[0]}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <h1 className="font-bricolage text-3xl font-black tracking-tight text-ink sm:text-4xl">
              {vendor.name}
            </h1>
            {vendor.verified && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-trust text-[10px] font-bold text-white">
                ✓
              </span>
            )}
          </div>

          {vendor.rating > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Stars value={vendor.rating} />
              <span className="font-semibold text-ink">{vendor.rating.toFixed(1)}</span>
              {vendor.reviews > 0 && <span>· {compactNumber(vendor.reviews)} reviews</span>}
            </div>
          )}

          {(vendor.category || vendor.location) && (
            <p className="mt-1.5 text-sm text-slate-500">
              {[vendor.category, vendor.location].filter(Boolean).join(' • ')}
            </p>
          )}

          {vendor.bio && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">{vendor.bio}</p>
          )}

          {vendor.followers > 0 && (
            <p className="mt-2 text-xs font-medium text-slate-400">
              {compactNumber(vendor.followers)} followers
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={toggleFollow}
              disabled={followBusy}
              className={`inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-70 ${
                following
                  ? 'border border-slate-200 bg-white text-ink hover:border-slate-300'
                  : 'bg-ink text-white hover:bg-[#FA3728]'
              }`}
            >
              {following && <Check size={15} strokeWidth={3} />}
              {following ? 'Following' : 'Follow'}
            </button>
            <Link
              href={`/chats/${vendor.id}`}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-bold text-ink transition-colors hover:border-ink"
            >
              <MessageCircle size={16} />
              Message
            </Link>
          </div>

          {vendor.verified && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Shield size={13} className="text-ink" />
              Verified vendor
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-9 border-b border-slate-200/70">
          <div className="flex justify-center gap-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap border-b-2 py-3 text-sm font-bold transition-colors ${
                    active
                      ? 'border-ink text-ink'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                  {typeof tab.count === 'number' && (
                    <span className={active ? 'text-slate-400' : 'text-slate-300'}> {tab.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products */}
        {activeTab === 'products' && (
          <div className="mt-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products"
                    className="w-44 rounded-full border border-slate-200 bg-white py-2 pl-9 pr-3 text-base text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-ink sm:w-64 sm:text-sm"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-2 text-base font-semibold text-slate-700 outline-none focus:border-ink sm:text-xs"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 py-20 text-center">
                <p className="text-lg font-semibold text-ink">No products found</p>
                <p className="mt-1 text-sm text-slate-500">Try a different search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-5 lg:gap-4 xl:grid-cols-6">
                {filteredProducts.map((item, index) => (
                  <ProductCard key={item.id} product={item} index={index} onAddToCart={addToCart} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Posts */}
        {activeTab === 'posts' && (
          <div className="mx-auto mt-6 max-w-xl">
            {posts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 py-20 text-center">
                <p className="text-lg font-semibold text-ink">No posts yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  {vendor.name} hasn&apos;t shared any updates.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {posts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info */}
        {activeTab === 'info' && (
          <div className="mx-auto mt-6 max-w-2xl">
            <div className="rounded-3xl border border-slate-200/70 bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold text-ink">About {vendor.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {vendor.bio || 'This vendor has not added a description yet.'}
              </p>

              <dl className="mt-6 space-y-4">
                {(vendor.category || vendor.location) && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50">
                      <MapPin size={18} className="text-ink" />
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-slate-400">Location</dt>
                      <dd className="text-sm font-semibold text-ink">
                        {vendor.location || 'Not provided'}
                      </dd>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50">
                    <Shield size={18} className="text-ink" />
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-400">Verification</dt>
                    <dd className="text-sm font-semibold text-ink">
                      {vendor.verified ? 'Verified vendor' : 'Not verified'}
                    </dd>
                  </div>
                </div>
              </dl>

              <Link
                href={`/chats/${vendor.id}`}
                className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-white transition-colors hover:bg-[#FA3728]"
              >
                <MessageCircle size={16} />
                Message {vendor.name}
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Floating message button (mobile) */}
      <Link
        href={`/chats/${vendor.id}`}
        aria-label={`Message ${vendor.name}`}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white shadow-lg transition-colors hover:bg-[#FA3728] sm:hidden"
      >
        <MessageCircle size={20} />
      </Link>
    </div>
  );
}
