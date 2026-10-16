'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, ShoppingCart, MessageCircle, User } from 'lucide-react';

const TABS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/chats', label: 'Chats', icon: MessageCircle },
  { href: '/profile', label: 'Profile', icon: User },
];

/** Shared mobile bottom navigation for the customer-facing app. */
export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/70 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="flex items-center justify-around">
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          const Icon = tab.icon;
          return (
            <Link key={tab.href} href={tab.href} className="flex w-16 flex-col items-center gap-0.5 py-2">
              <Icon
                size={21}
                className={active ? 'text-[#FA3728]' : 'text-slate-500'}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={`text-[10px] ${active ? 'font-bold text-[#FA3728]' : 'font-medium text-slate-500'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
