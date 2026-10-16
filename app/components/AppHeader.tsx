'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
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
      className="relative hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 md:flex"
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

/**
 * Responsive app bar:
 *  - Desktop: single full-bleed row — logo | centered nav links | cart · bell · avatar.
 *  - Mobile:  two tiers — logo + actions on top, nav links underneath.
 */
export default function AppHeader() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

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

  const renderTabs = (className: string) => (
    <nav className={`items-center justify-center gap-8 ${className}`}>
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative px-1 py-2 text-sm font-semibold transition-colors ${
              active ? 'text-ink' : 'text-slate-500 hover:text-ink'
            }`}
          >
            {tab.label}
            {active && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#FA3728]" />}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white">
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

        {/* Desktop nav links (centered) */}
        {renderTabs('hidden flex-1 md:flex')}

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <CartLink count={cartCount} />
          <NotificationsBell />
          <ProfileButton />
        </div>
      </div>

      {/* Mobile nav links (second tier) */}
      {renderTabs('flex md:hidden')}
    </header>
  );
}
