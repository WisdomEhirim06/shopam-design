'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, ShoppingCart } from 'lucide-react';
import { cartService } from '@/lib/api';
import ProfileButton from './ProfileButton';
import NotificationsBell from './NotificationsBell';

const TABS = [
  { href: '/explore', label: 'Products' },
  { href: '/feed', label: 'Feeds' },
  { href: '/vendors', label: 'Vendors' },
];

function CartLink({ count }: { count: number }) {
  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className="relative hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 sm:flex"
    >
      <ShoppingCart size={19} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FA3728] px-1 text-[10px] font-bold text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/explore?q=${encodeURIComponent(query)}` : '/explore');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex flex-col bg-white"
    >
      <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 pt-5 sm:px-6">
        <form
          onSubmit={submit}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4"
        >
          <Search size={18} className="shrink-0 text-slate-500" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, brands, or vendors…"
            aria-label="Search products and vendors"
            className="h-12 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-slate-500"
          />
        </form>
        <button onClick={onClose} className="shrink-0 text-sm font-semibold text-slate-600 transition-colors hover:text-ink">
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Two-tier app bar:
 *  - Top row: brand logo (left) + search / cart / notifications / avatar (right).
 *  - Bottom row: section tabs (Products · Feeds · Vendors).
 */
export default function AppHeader() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const count = await cartService.getCartItemCount();
        if (active) setCartCount(count);
      } catch {
        /* cart count is non-critical */
      }
    };
    refresh();
    window.addEventListener('shopam:cart-updated', refresh);
    return () => {
      active = false;
      window.removeEventListener('shopam:cart-updated', refresh);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white">
        {/* Top row */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center" aria-label="ShopAm home">
            <Image
              src="/images/black-logo.png"
              alt="ShopAm"
              width={120}
              height={30}
              priority
              className="h-6 w-auto object-contain sm:h-7"
            />
          </Link>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
            >
              <Search size={19} />
            </button>
            <CartLink count={cartCount} />
            <NotificationsBell />
            <ProfileButton />
          </div>
        </div>

        {/* Sub-nav tabs */}
        <nav className="mx-auto flex max-w-7xl items-center gap-1 px-4 pb-2 sm:px-6 lg:px-8">
          {TABS.map((tab) => {
            const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  active ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <AnimatePresence>{searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}</AnimatePresence>
    </>
  );
}
