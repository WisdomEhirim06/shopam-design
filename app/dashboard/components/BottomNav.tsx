'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, Package, ShoppingBag, User, MoreHorizontal, Wallet, Settings, LogOut, X } from 'lucide-react';
import { authService } from '@/lib/api';

const PRIMARY = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

const MORE = [
  { href: '/dashboard/earnings', label: 'Earnings', icon: Wallet },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const signOut = () => {
    authService.logout().finally(() => {
      window.location.href = '/auth/signin';
    });
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const moreActive = MORE.some((m) => isActive(m.href));

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/70 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="flex items-center justify-around">
          {PRIMARY.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex w-16 flex-col items-center gap-0.5 py-2">
                <Icon size={21} className={active ? 'text-[#FA3728]' : 'text-slate-600'} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-[10px] ${active ? 'font-bold text-[#FA3728]' : 'font-medium text-slate-600'}`}>{item.label}</span>
              </Link>
            );
          })}
          <button onClick={() => setMoreOpen(true)} className="flex w-16 flex-col items-center gap-0.5 py-2">
            <MoreHorizontal size={21} className={moreActive ? 'text-[#FA3728]' : 'text-slate-600'} strokeWidth={moreActive ? 2.5 : 2} />
            <span className={`text-[10px] ${moreActive ? 'font-bold text-[#FA3728]' : 'font-medium text-slate-600'}`}>More</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {moreOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMoreOpen(false)}
            className="fixed inset-0 z-50 bg-black/45 md:hidden"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white px-5 pb-[env(safe-area-inset-bottom)] pt-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-ink">More</h2>
                <button onClick={() => setMoreOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-1">
                {MORE.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${active ? 'bg-slate-900/[0.04] text-ink' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  onClick={signOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Sign out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
