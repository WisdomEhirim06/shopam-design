'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { authService, followsService } from '@/lib/api';
import type { Vendor } from '@/lib/api';
import { DEV_AUTH_BYPASS } from '@/lib/devAuth';
import { compactNumber, formatCategory, formatVendorName } from '@/lib/format';

export default function VendorCard({ vendor, index = 0 }: { vendor: Vendor; index?: number }) {
  const [following, setFollowing] = useState(vendor.isFollowing);
  const [busy, setBusy] = useState(false);
  const href = `/vendors/${vendor.id}`;

  const toggleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Dev bypass: no real session — just toggle the UI state.
    if (DEV_AUTH_BYPASS) {
      setFollowing((v) => !v);
      return;
    }

    if (!authService.isAuthenticated()) {
      window.location.href = `/auth/signin?redirect=${encodeURIComponent(href)}`;
      return;
    }

    setBusy(true);
    try {
      if (!following) {
        await followsService.followVendor({ followed_vendor: vendor.id });
        setFollowing(true);
      } else {
        // Unfollow requires the follow record id, which this payload doesn't expose.
        setFollowing(false);
      }
    } catch {
      /* follow is non-critical */
    } finally {
      setBusy(false);
    }
  };

  const name = formatVendorName(vendor.name);
  const category = formatCategory(vendor.category);
  const meta = [category, vendor.location].filter(Boolean).join(' • ') || 'Verified vendor';

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.03, 0.24), duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full"
    >
      <div className="flex h-full flex-col">
        {/* Cover + heart */}
        <div className="relative">
          <Link href={href} className="block">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-900/5">
              {vendor.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={vendor.cover}
                  alt={name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
              ) : (
                <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 1px 1px, rgba(250,55,40,0.12) 1px, transparent 0)',
                      backgroundSize: '16px 16px',
                    }}
                  />
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-sm font-black text-[#FA3728] shadow-sm ring-1 ring-white/90">
                    {name[0]}
                  </span>
                </div>
              )}
            </div>
          </Link>

          <button
            type="button"
            onClick={toggleFollow}
            disabled={busy}
            aria-pressed={following}
            aria-label={following ? `Unfollow ${name}` : `Follow ${name}`}
            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm ring-1 ring-slate-900/5 backdrop-blur transition-all hover:bg-white active:scale-90 disabled:opacity-60"
          >
            <Heart
              size={15}
              className={following ? 'fill-[#FA3728] text-[#FA3728]' : 'text-slate-600'}
            />
          </button>
        </div>

        {/* Details */}
        <div className="mt-2.5 flex flex-1 flex-col px-0.5">
          <Link href={href} className="min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="truncate text-[12px] font-bold text-ink transition-colors group-hover:text-[#FA3728]">
                {name}
              </h3>
              {vendor.verified && (
                <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-trust text-[8px] font-bold text-white">
                  ✓
                </span>
              )}
            </div>
            <p className="mt-1 truncate text-[11px] font-medium text-slate-600">{meta}</p>
          </Link>

          {vendor.rating > 0 && (
            <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[11px] font-semibold text-slate-600">
              <Star size={12} className="shrink-0 fill-gold text-gold" />
              {vendor.rating.toFixed(1)}
              {vendor.reviews > 0 && (
                <span className="font-medium text-slate-500">({compactNumber(vendor.reviews)})</span>
              )}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
