'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Camera, ImagePlus, Loader2, MapPin, Package, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { authService, postsService, productsService } from '@/lib/api';
import type { ProductService } from '@/lib/api';
import ProductCard from '@/app/explore/components/ProductCard';
import PostCard from '@/app/components/feed/PostCard';
import Field from '../components/Field';
import Modal from '../components/Modal';
import { FEED_POSTS, type FeedPost } from '@/app/components/feed/data';

type Tab = 'products' | 'posts';

export default function VendorProfilePage() {
  const [profile, setProfile] = useState({ name: 'Your Shop', bio: '', category: '', location: '' });
  const [products, setProducts] = useState<ProductService[]>([]);
  const [posts, setPosts] = useState<FeedPost[]>(FEED_POSTS.slice(0, 3));
  const [tab, setTab] = useState<Tab>('products');
  const [postOpen, setPostOpen] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setProfile((p) => ({ ...p, name: user?.first_name || user?.username || 'Your Shop' }));

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
      .catch(() => {});

    productsService.getMyProducts().then((r) => setProducts(Array.isArray(r) ? r : [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Cover + identity (read-only; editing lives in Settings) */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
        <div className="h-32 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 sm:h-40" />
        <div className="relative px-4 pb-4 sm:px-6">
          <div className="-mt-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-ink text-2xl font-black text-white shadow-md sm:h-24 sm:w-24">
            {(profile.name || 'S').charAt(0).toUpperCase()}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <h2 className="font-bricolage text-2xl font-black tracking-tight text-ink">{profile.name || 'Your Shop'}</h2>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-trust text-[10px] font-bold text-white">✓</span>
          </div>
          {(profile.category || profile.location) && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin size={14} /> {[profile.category, profile.location].filter(Boolean).join(' • ')}
            </p>
          )}
          {profile.bio && <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">{profile.bio}</p>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-200/70">
        {(['products', 'posts'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 pb-2.5 text-sm font-bold capitalize transition-colors ${tab === t ? 'border-[#FA3728] text-ink' : 'border-transparent text-slate-500 hover:text-slate-600'}`}
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
            <p className="py-16 text-center text-sm text-slate-500">No products yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onAddToCart={() => {}} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'posts' && (
        <div className="mx-auto max-w-xl">
          <div className="mb-4 flex items-center justify-end">
            <button onClick={() => setPostOpen(true)} className="flex items-center gap-1.5 rounded-full bg-[#FA3728] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#E31B23]">
              <Plus size={15} /> New post
            </button>
          </div>
          <div className="space-y-5">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {postOpen && (
          <CreatePostModal
            onClose={() => setPostOpen(false)}
            onCreated={(post) => {
              setPosts((prev) => [post, ...prev]);
              setPostOpen(false);
            }}
            authorName={profile.name}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreatePostModal({
  onClose,
  onCreated,
  authorName,
}: {
  onClose: () => void;
  onCreated: (post: FeedPost) => void;
  authorName: string;
}) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = async () => {
    if (!caption.trim()) return;
    setBusy(true);
    try {
      await postsService.createPost({ caption: caption.trim(), media: file ? [file] : undefined });
    } catch {
      /* dev/offline — still show it locally */
    }
    onCreated({
      id: Date.now(),
      vendorName: authorName || 'Your Shop',
      verified: true,
      timeAgo: 'Just now',
      image: image ?? '',
      caption: caption.trim(),
      likes: 0,
      comments: 0,
      tags: [],
    });
    setBusy(false);
  };

  return (
    <Modal
      open
      title="Create post"
      description="Share an update with your followers."
      onClose={onClose}
      footer={
        <button onClick={submit} disabled={!caption.trim() || busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FA3728] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#E31B23] disabled:opacity-50">
          {busy && <Loader2 size={16} className="animate-spin" />}
          Publish post
        </button>
      }
    >
      <div className="space-y-4">
        <button onClick={() => fileRef.current?.click()} className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 transition-colors hover:border-[#FA3728] hover:text-[#FA3728]">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="Post" className="h-full w-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-1">
              <ImagePlus size={26} />
              <span className="text-xs font-medium">Add a photo</span>
            </span>
          )}
          {image && (
            <span
              onClick={(e) => { e.stopPropagation(); setImage(null); setFile(null); }}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X size={14} />
            </span>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { setFile(f); setImage(URL.createObjectURL(f)); }
          }}
        />
        <Field label="Caption" value={caption} onChange={setCaption} textarea rows={3} />
      </div>
    </Modal>
  );
}
