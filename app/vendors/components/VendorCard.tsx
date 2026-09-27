'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Check } from 'lucide-react';
import { authService, followsService } from '@/lib/api';
import type { Vendor } from '@/lib/api';
import { compactNumber } from '@/lib/format';

export default function VendorCard({ vendor, index = 0 }: { vendor: Vendor; index?: number }) {
  const [following, setFollowing] = useState(vendor.isFollowing);
  const [busy, setBusy] = useState(false);

  const toggleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authService.isAuthenticated()) {
      window.location.href = `/auth/signin?redirect=${encodeURIComponent(`/vendors/${vendor.id}`)}`;
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
      /* surface nothing — follow is non-critical */
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.04, 0.28), duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full"
    >
      <div className="relative h-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300/80 hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.35)]">
        <Link href={`/vendors/${vendor.id}`} className="block">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
            {vendor.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={vendor.cover}
                alt={vendor.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FA3728] to-[#E31B23]">
                <span className="text-5xl font-black text-white/80">{vendor.name[0]}</span>
              </div>
            )}

            {/* Readability gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />

            {/* Rating badge */}
            {vendor.rating > 0 && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-bold text-slate-800 shadow-sm backdrop-blur">
                <Star size={11} className="fill-gold text-gold" />
                {vendor.rating.toFixed(1)}
                {vendor.reviews > 0 && (
                  <span className="font-medium text-slate-400">({compactNumber(vendor.reviews)})</span>
                )}
              </span>
            )}

            {/* Name + meta */}
            <div className="absolute inset-x-3 bottom-3">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-base font-bold text-white drop-shadow-sm">
                  {vendor.name}
                </h3>
                {vendor.verified && (
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-trust text-[9px] font-bold text-white">
                    ✓
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-[11px] font-medium text-white/80">
                {[vendor.category, vendor.location].filter(Boolean).join(' • ')}
              </p>
            </div>
          </div>
        </Link>

        {/* Follow — text button, not a heart */}
        <button
          type="button"
          onClick={toggleFollow}
          disabled={busy}
          aria-pressed={following}
          className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-sm backdrop-blur transition-all active:scale-95 disabled:opacity-70 ${
            following
              ? 'border border-white/40 bg-white/20 text-white hover:bg-white/30'
              : 'bg-white text-ink hover:bg-[#FA3728] hover:text-white'
          }`}
        >
          {following && <Check size={11} strokeWidth={3} />}
          {following ? 'Following' : 'Follow'}
        </button>
      </div>
    </motion.article>
  );
}
