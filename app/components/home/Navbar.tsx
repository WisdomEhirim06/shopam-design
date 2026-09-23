'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authService, cartService } from '@/lib/api';
import ProfileButton from '../ProfileButton';

function NavLinks({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  const links = [
    { href: '/explore', label: 'Products' },
    { href: '/feed', label: 'Feeds' },
    { href: '/vendors', label: 'Vendors' },
  ];

  return (
    <div className={className}>
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`min-w-0 whitespace-nowrap text-[11px] font-bold transition-colors sm:text-sm ${active ? 'text-[#FA3728]' : 'text-slate-700 hover:text-[#FA3728]'
              }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

function CartLink({ count, className = '' }: { count: number; className?: string }) {
  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className={`relative flex h-9 w-9 min-w-0 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-900/5 ${className}`}
    >
      <ShoppingCart size={18} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FA3728] px-1 text-[10px] font-bold text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}


export default function Navbar({ actions = false }: { actions?: boolean }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!actions) return;
    let active = true;

    const refresh = async () => {
      try {
        if (authService.isAuthenticated()) {
          const count = await cartService.getCartItemCount();
          if (active) setCartCount(count);
        } else if (active) {
          setCartCount(0);
        }
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
  }, [actions]);

  if (!actions) {
    return (
      <header className="fixed top-2.5 sm:top-5 left-1/2 -translate-x-1/2 w-[94%] sm:w-[92%] max-w-5xl z-50 transition-all duration-300">
        <nav className="relative flex items-center justify-between px-3 sm:px-7 py-2 sm:py-3 rounded-full bg-white/85 backdrop-blur-xl border border-white/60 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5">
          <Link href="/" className="flex items-center shrink-0 z-10">
            <Image
              src="/images/black-logo.png"
              alt="ShopAm"
              width={104}
              height={28}
              priority
              className="h-3.5 sm:h-7 w-auto object-contain"
            />
          </Link>

          <NavLinks className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-3.5 sm:gap-8" />

          <div className="hidden sm:flex items-center text-xs font-bold text-slate-400">
            <span>Nigeria</span>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="fixed top-2.5 sm:top-5 left-1/2 -translate-x-1/2 w-[94%] sm:w-[92%] max-w-5xl z-50 transition-all duration-300">
      <nav className="relative flex flex-col rounded-2xl px-3 py-2 bg-white/85 backdrop-blur-xl border border-white/60 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-7 sm:py-3">
        {/* Mobile row 1: logo + primary actions (also the desktop layout via sm:contents) */}
        <div className="flex items-center justify-between sm:contents">
          <Link href="/" className="flex items-center shrink-0 z-10">
            <Image
              src="/images/black-logo.png"
              alt="ShopAm"
              width={104}
              height={28}
              priority
              className="h-4 sm:h-7 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-0.5 sm:hidden">
            <CartLink count={cartCount} />
            <ProfileButton />
          </div>
        </div>

        {/* Links: second row on mobile, centered on desktop (nudged left to optically balance the action cluster) */}
        <NavLinks className="mt-1 flex items-center justify-center gap-6 sm:absolute sm:left-1/2 sm:mt-0 sm:-ml-2 sm:-translate-x-1/2 sm:gap-8" />

        {/* Desktop actions */}
        <div className="z-10 hidden shrink-0 items-center gap-1 sm:flex">
          <CartLink count={cartCount} />
          <Link
            href="/chats"
            aria-label="Messages"
            className="flex h-9 w-9 min-w-0 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-900/5"
          >
            <MessageCircle size={18} />
          </Link>
          <ProfileButton />
        </div>
      </nav>
    </header>
  );
}
