'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cartService } from '@/lib/api';
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
            className={`min-w-0 whitespace-nowrap text-xs font-bold transition-colors sm:text-sm ${
              active ? 'text-[#FA3728]' : 'text-slate-600 hover:text-[#FA3728]'
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

/**
 * Floating pill navigation. One compact row — logo left, the three tabs
 * centred, commerce actions (cart / chat / profile) on the right.
 */
export default function Navbar({ actions = false }: { actions?: boolean }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!actions) return;
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
  }, [actions]);

  return (
    <header className="fixed top-2.5 sm:top-5 left-1/2 z-50 w-[94%] max-w-5xl -translate-x-1/2 transition-all duration-300 sm:w-[92%]">
      <nav className="relative flex items-center justify-between rounded-full border border-white/60 bg-white/85 px-3 py-2 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5 backdrop-blur-xl sm:px-7 sm:py-3">
        {/* Left: logo */}
        <Link href="/" className="z-10 flex shrink-0 items-center">
          <Image
            src="/images/black-logo.png"
            alt="ShopAm"
            width={104}
            height={28}
            priority
            className="h-3.5 w-auto object-contain sm:h-7"
          />
        </Link>

        {/* Center: tabs */}
        <NavLinks className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center gap-3 sm:gap-8" />

        {/* Right: commerce actions or country */}
        {actions ? (
          <div className="z-10 flex shrink-0 items-center gap-0.5 sm:gap-1">
            <CartLink count={cartCount} />
            <Link
              href="/chats"
              aria-label="Messages"
              className="hidden h-9 w-9 min-w-0 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-900/5 sm:flex"
            >
              <MessageCircle size={18} />
            </Link>
            <ProfileButton />
          </div>
        ) : (
          <div className="hidden items-center text-xs font-bold text-slate-400 sm:flex">
            <span>Nigeria</span>
          </div>
        )}
      </nav>
    </header>
  );
}
