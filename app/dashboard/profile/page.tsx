'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Shield, Star, X, Loader2, Camera, Package } from 'lucide-react';
import { authService, productsService } from '@/lib/api';
import type { ProductService } from '@/lib/api';
import { compactNumber } from '@/lib/format';
import ProductCard from '@/app/explore/components/ProductCard';
import PostCard from '@/app/components/feed/PostCard';
import { FEED_POSTS } from '@/app/components/feed/data';

type Tab = 'products' | 'posts' | 'info';

export default function VendorProfilePage() {
  const [profile, setProfile] = useState({ name: '', bio: '', category: '', location: '' });
  const [products, setProducts] = useState<ProductService[]>([]);
  const [tab, setTab] = useState<Tab>('products');
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setProfile((p) => ({ ...p, name: (user as { business_name?: string } | null)?.business_name || user?.first_name || user?.username || 'Your Shop' }));

    authService
      .getFullProfile()
      .then((full) => {
        const vp = full?.vendor_profile;
        setProfile({
          name: vp?.business_name || '',
          bio: vp?.bio || '',
          category: vp?.business_category || '',
          location: vp?.business_address || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    productsService.getMyProducts().then((r) => setProducts(Array.isArray(r) ? r : [])).catch(() => {});
  }, []);

  const addToCart = () => {};

  return (
    <div className="space-y-6">
      {/* Cover + identity */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
        <div className="relative h-32 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 sm:h-40">
          <button className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-sm">
            <Camera size={13} /> Change cover
          </button>
        </div>

        <div className="relative px-4 pb-4 sm:px-6">
          <div className="-mt-10 flex items-end justify-between">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-ink text-2xl font-black text-white shadow-md sm:h-24 sm:w-24">
              {(profile.name || 'S').charAt(0).toUpperCase()}
            </div>
            <button onClick={() => setEditOpen(true)} className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#FA3728]">
              Edit profile
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <h2 className="font-bricolage text-2xl font-black tracking-tight text-ink">{profile.name || 'Your Shop'}</h2>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-trust text-[10px] font-bold text-white">✓</span>
          </div>
          {(profile.category || profile.location) && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin size={14} /> {[profile.category, profile.location].filter(Boolean).join(' • ')}
            </p>
          )}
          {profile.bio && <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">{profile.bio}</p>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200/70">
        {(['products', 'posts', 'info'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 pb-2.5 text-sm font-bold capitalize transition-colors ${tab === t ? 'border-ink text-ink' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <div>
          <div className="mb-4 flex items-center justify-end">
            <Link href="/dashboard/products" className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#FA3728]">
              <Package size={15} /> Add product
            </Link>
          </div>
          {products.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-400">No products yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'posts' && (
        <div className="mx-auto max-w-xl space-y-5">
          {FEED_POSTS.slice(0, 3).map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}

      {tab === 'info' && (
        <div className="max-w-2xl rounded-2xl border border-slate-200/80 bg-white p-5">
          <h3 className="text-sm font-bold text-ink">About</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{profile.bio || 'No description yet.'}</p>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center gap-2"><Shield size={15} className="text-ink" /> <span className="text-slate-600">Verification:</span> <span className="font-semibold text-ink">Verified vendor</span></div>
            <div className="flex items-center gap-2"><Star size={15} className="text-ink" /> <span className="text-slate-600">Reviews:</span> <span className="font-semibold text-ink">{compactNumber(24)}</span></div>
          </dl>
        </div>
      )}

      {/* Edit modal */}
      <AnimatePresence>
        {editOpen && (
          <EditProfileModal
            profile={profile}
            onClose={() => setEditOpen(false)}
            onSave={(next) => {
              setProfile(next);
              setEditOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EditProfileModal({
  profile,
  onClose,
  onSave,
}: {
  profile: { name: string; bio: string; category: string; location: string };
  onClose: () => void;
  onSave: (next: { name: string; bio: string; category: string; location: string }) => void;
}) {
  const [form, setForm] = useState(profile);
  const [busy, setBusy] = useState(false);

  const submit = () => {
    setBusy(true);
    // TODO: persist via the vendor profile endpoint when it's stable.
    setTimeout(() => onSave(form), 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 sm:items-center sm:px-4"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Edit profile</h2>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Shop name', key: 'name' as const },
            { label: 'Category', key: 'category' as const },
            { label: 'Location', key: 'location' as const },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-semibold text-slate-500">{label}</label>
              <input
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
              />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
            />
          </div>
        </div>

        <button
          onClick={submit}
          disabled={busy}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#FA3728] disabled:opacity-60"
        >
          {busy && <Loader2 size={16} className="animate-spin" />}
          Save changes
        </button>
      </motion.div>
    </motion.div>
  );
}
