'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Share2,
  Truck,
  Shield,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ArrowLeft,
  Loader2,
  Star,
  User,
} from 'lucide-react';
import { productsService, cartService, authService, reviewsService } from '@/lib/api';
import type { ProductService, Review } from '@/lib/api/types';
import Navbar from '../../components/home/Navbar';
import ProductCard from '../../explore/components/ProductCard';

/* ── Helpers ─────────────────────────────────────────────── */

function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  if (!then) return '';
  const diff = Date.now() - then;
  const day = 86_400_000;
  if (diff < 3_600_000) return 'Just now';
  if (diff < day) return `${Math.floor(diff / 3_600_000)}h ago`;
  const days = Math.floor(diff / day);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(iso).toLocaleDateString();
}

function reviewerOf(review: any): { name: string; initial: string } {
  const c = review?.customer_details ?? review?.customer;
  if (c && typeof c === 'object') {
    const first = c.first_name || c.username || '';
    const last = c.last_name || '';
    const name = [first, last].filter(Boolean).join(' ') || 'Verified buyer';
    return { name, initial: (first?.[0] || last?.[0] || 'V').toUpperCase() };
  }
  return { name: 'Verified buyer', initial: 'V' };
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
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

function Section({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id?: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="border-t border-slate-200/80">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-base font-bold tracking-tight text-ink sm:text-lg">{title}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<ProductService | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductService[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [openSections, setOpenSections] = useState({ description: true, reviews: true });

  const toggleSection = (key: 'description' | 'reviews') =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError('');

    reviewsService
      .getReviews(id)
      .then((data) => active && setReviews(Array.isArray(data) ? data : []))
      .catch(() => {});

    productsService
      .getProduct(id)
      .then((data) => {
        if (!active) return;
        setProduct(data);
        return productsService
          .getProducts({ vendor: data.owner, page_size: 5 })
          .then((res) => {
            if (active) {
              setRelatedProducts(res.results.filter((p) => p.id !== id).slice(0, 4));
            }
          })
          .catch(() => {});
      })
      .catch(() => active && setError('Failed to load product. Please try again.'))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [id]);

  const addToCart = async (productId: string, qty = 1) => {
    if (!authService.isAuthenticated()) {
      window.location.href = `/auth/signin?redirect=${encodeURIComponent(`/products/${productId}`)}`;
      return;
    }
    await cartService.addToCart({ product_id: productId, quantity: qty });
    window.dispatchEvent(new Event('shopam:cart-updated'));
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch {
      // cart errors surface elsewhere
    } finally {
      setIsAddingToCart(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar actions />
        <main className="mx-auto max-w-7xl px-4 pb-28 pt-28 sm:px-6 sm:pt-28 lg:px-8">
          <div className="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="aspect-square w-full rounded-3xl bg-slate-100" />
            </div>
            <div className="space-y-4 lg:col-span-5">
              <div className="h-4 w-32 rounded bg-slate-100" />
              <div className="h-9 w-3/4 rounded bg-slate-100" />
              <div className="h-5 w-28 rounded bg-slate-100" />
              <div className="h-9 w-40 rounded bg-slate-100" />
              <div className="h-12 w-full rounded-full bg-slate-100" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !product) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar actions />
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <p className="mb-4 text-slate-500">{error || 'Product not found.'}</p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
            >
              <ArrowLeft size={16} />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Derived data ── */
  const images = product.images ?? [];
  const price = parseFloat(product.price) || 0;
  const mainImageUrl = images[selectedImage]?.image_url ?? null;
  const ratingCount = reviews.length || parseInt(product.review_count || '0', 10) || 0;
  const rating =
    parseFloat(product.average_rating) ||
    (reviews.length ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length : 0);
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));
  const maxDistribution = Math.max(1, ...distribution.map((d) => d.count));
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 4);
  const vendorInitial = (product.owner_name || 'S').charAt(0).toUpperCase();

  const goPrev = () => setSelectedImage((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setSelectedImage((i) => (i + 1) % images.length);

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink antialiased">
      <Navbar actions />

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-28 sm:px-6 sm:pt-28 lg:px-8">
        {/* Back / actions toolbar */}
        <div className="mb-5 flex items-center justify-between">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} />
            Back to products
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              aria-label="Save"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white transition-colors hover:border-slate-300"
            >
              <Heart
                size={17}
                className={isSaved ? 'fill-[#FA3728] text-[#FA3728]' : 'text-slate-600'}
              />
            </button>
            <button
              aria-label="Share"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300"
            >
              <Share2 size={17} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* ── Gallery ── */}
          <div className="lg:col-span-7">
            <div className="flex gap-3 sm:gap-4">
              {/* Vertical thumbnails (desktop) */}
              {images.length > 1 && (
                <div className="hidden w-16 shrink-0 flex-col gap-2.5 sm:flex lg:w-20">
                  {images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(index)}
                      aria-label={`View image ${index + 1}`}
                      className={`aspect-square w-full overflow-hidden rounded-xl bg-slate-50 ring-1 transition-all ${
                        selectedImage === index
                          ? 'ring-2 ring-ink'
                          : 'ring-slate-200 hover:ring-slate-300'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.image_url}
                        alt={`${product.title} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div className="relative min-w-0 flex-1">
                <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-slate-50 ring-1 ring-slate-900/5">
                  {mainImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mainImageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-slate-300">
                      <User size={48} />
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-md ring-1 ring-slate-900/5 backdrop-blur transition-transform hover:scale-105 active:scale-95"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={goNext}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-md ring-1 ring-slate-900/5 backdrop-blur transition-transform hover:scale-105 active:scale-95"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Horizontal thumbnails (mobile) */}
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar sm:hidden">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50 ring-1 transition-all ${
                      selectedImage === index ? 'ring-2 ring-ink' : 'ring-slate-200'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.image_url}
                      alt={`${product.title} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info + accordions ── */}
          <div className="lg:col-span-5">
            {/* Vendor */}
            <Link
              href={`/vendors/${product.owner}`}
              className="inline-flex items-center gap-2.5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                {vendorInitial}
              </span>
              <span className="text-sm font-semibold text-ink">{product.owner_name}</span>
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-trust text-[8px] font-bold text-white">
                ✓
              </span>
            </Link>

            {/* Title */}
            <h1 className="mt-4 font-bricolage text-2xl font-black leading-tight tracking-tight text-ink sm:text-3xl lg:text-[34px]">
              {product.title}
            </h1>

            {/* Rating */}
            {rating > 0 && (
              <button
                onClick={() => {
                  setOpenSections((p) => ({ ...p, reviews: true }));
                  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-3 flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-ink"
              >
                <Stars value={rating} />
                <span className="font-medium text-ink">{rating.toFixed(1)}</span>
                <span className="text-slate-400">({ratingCount} reviews)</span>
              </button>
            )}

            {/* Price */}
            <div className="mt-5">
              <span className="text-3xl font-black tracking-tight text-ink">
                ₦{price.toLocaleString()}
              </span>
              <p className="mt-1.5 text-xs text-slate-400">
                {product.tax_inclusive ? 'Price includes VAT · ' : ''}Shipping calculated at checkout
              </p>
            </div>

            {/* Quantity + Add to cart */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-full border border-slate-200 bg-white px-1.5 py-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center text-sm font-bold text-ink">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full text-sm font-bold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:text-base ${
                  addedToCart ? 'bg-emerald-600' : 'bg-ink hover:bg-[#FA3728]'
                }`}
              >
                {isAddingToCart && <Loader2 size={18} className="animate-spin" />}
                {isAddingToCart ? 'Adding…' : addedToCart ? 'Added to cart' : 'Add to cart'}
              </button>
            </div>

            {/* Trust line */}
            <div className="mt-4 flex items-center gap-5 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Shield size={14} className="text-ink" />
                Verified vendor
              </span>
              <span className="flex items-center gap-1.5">
                <Truck size={14} className="text-ink" />
                Fast delivery
              </span>
            </div>

            {/* Accordions — Description + Reviews only */}
            <div className="mt-8">
              {product.description && (
                <Section
                  title="Description"
                  open={openSections.description}
                  onToggle={() => toggleSection('description')}
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                    {product.description}
                  </p>
                </Section>
              )}

              <Section
                id="reviews"
                title={`Reviews${ratingCount ? ` (${ratingCount})` : ''}`}
                open={openSections.reviews}
                onToggle={() => toggleSection('reviews')}
              >
                {reviews.length === 0 && ratingCount === 0 ? (
                  <p className="text-sm text-slate-500">
                    No reviews yet. Be the first to review this product.
                  </p>
                ) : (
                  <div>
                    {/* Summary */}
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                      <div className="shrink-0">
                        <div className="text-4xl font-black tracking-tight text-ink">
                          {rating.toFixed(1)}
                        </div>
                        <div className="mt-1">
                          <Stars value={rating} size={16} />
                        </div>
                        <div className="mt-1 text-xs text-slate-400">{ratingCount} ratings</div>
                      </div>

                      {reviews.length > 0 && (
                        <div className="flex-1 space-y-1.5">
                          {distribution.map(({ star, count }) => (
                            <div key={star} className="flex items-center gap-2">
                              <span className="w-3 text-xs text-slate-400">{star}</span>
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-ink transition-all"
                                  style={{ width: `${(count / maxDistribution) * 100}%` }}
                                />
                              </div>
                              <span className="w-5 text-right text-[11px] text-slate-400">
                                {count}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Review cards */}
                    {reviews.length > 0 && (
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {visibleReviews.map((review) => {
                          const { name, initial } = reviewerOf(review);
                          return (
                            <div
                              key={review.id}
                              className="rounded-2xl border border-slate-200/70 bg-white p-4"
                            >
                              <Stars value={review.rating} size={13} />
                              {review.comment && (
                                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                                  {review.comment}
                                </p>
                              )}
                              <div className="mt-3 flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                                  {initial}
                                </span>
                                <span className="text-xs font-semibold text-ink">{name}</span>
                                <span className="text-xs text-slate-400">
                                  · {timeAgo(review.created_at)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {reviews.length > 4 && (
                      <button
                        onClick={() => setShowAllReviews((v) => !v)}
                        className="mt-4 w-full rounded-full bg-slate-50 py-3 text-sm font-semibold text-ink transition-colors hover:bg-slate-100"
                      >
                        {showAllReviews ? 'Show fewer reviews' : `Read all ${reviews.length} reviews`}
                      </button>
                    )}
                  </div>
                )}
              </Section>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 lg:mt-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-bricolage text-xl font-black tracking-tight text-ink sm:text-2xl">
                  More from {product.owner_name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">Explore the rest of this vendor&apos;s store</p>
              </div>
              <Link
                href={`/vendors/${product.owner}`}
                className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-[#FA3728] sm:inline-flex"
              >
                See all
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">
              {relatedProducts.map((related, index) => (
                <ProductCard
                  key={related.id}
                  product={related}
                  index={index}
                  onAddToCart={(pid) => addToCart(pid, 1)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Floating search pill (desktop) — mirrors the shop.app footer search */}
      <Link
        href="/explore"
        className="fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-4 rounded-full border border-slate-200 bg-white/90 py-2.5 pl-6 pr-2.5 shadow-[0_14px_45px_-14px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-all hover:shadow-[0_18px_55px_-14px_rgba(15,23,42,0.4)] lg:flex"
      >
        <span className="text-sm text-slate-400">What are you shopping for today?</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white">
          <ArrowRight size={16} />
        </span>
      </Link>
    </div>
  );
}
