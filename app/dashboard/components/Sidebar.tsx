'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { authService } from '@/lib/api';
import { NAV_ITEMS } from '../nav';

export default function Sidebar() {
  const pathname = usePathname();

  const signOut = () => {
    authService.logout().finally(() => {
      window.location.href = '/auth/signin';
    });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col overflow-y-auto border-r border-slate-200/70 bg-white md:flex">
      <div className="flex items-center gap-2 px-5 pb-2 pt-6">
        <Image src="/images/black-logo.png" alt="ShopAm" width={104} height={28} className="h-6 w-auto object-contain" />
      </div>
      <p className="px-5 pb-3 pt-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">Vendor dashboard</p>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active ? 'bg-[#FA3728]/10 text-[#FA3728]' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
