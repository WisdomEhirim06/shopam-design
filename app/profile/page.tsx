'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  ChevronRight,
  HelpCircle,
  Loader2,
  LogOut,
  Receipt,
  Settings,
  Store,
} from 'lucide-react';
import { authService } from '@/lib/api';
import type { UserProfile } from '@/lib/api';
import AppBar from '@/app/components/ui/AppBar';
import BottomNav from '@/app/components/BottomNav';

function MenuRow({
  icon: Icon,
  title,
  subtitle,
  href,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  subtitle?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3.5 border-b border-slate-100 px-4 py-3.5 transition-colors last:border-0 hover:bg-slate-50/60"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink">{title}</span>
        {subtitle && <span className="mt-0.5 block text-xs text-slate-600">{subtitle}</span>}
      </span>
      <ChevronRight size={16} className="shrink-0 text-slate-400" />
    </Link>
  );
}

function initialsOf(user: UserProfile): string {
  const firstPart = user.first_name || user.username || '';
  const first = firstPart.charAt(0);
  let last = (user.last_name || '').charAt(0);
  if (!last && firstPart.includes(' ')) {
    const parts = firstPart.trim().split(/\s+/);
    if (parts.length > 1) last = parts[parts.length - 1].charAt(0);
  }
  return `${first}${last}`.toUpperCase().trim();
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current = authService.getCurrentUser();
    if (!current) {
      window.location.href = '/auth/signin';
      return;
    }
    setUser(current);
    setReady(true);
  }, []);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Loader2 className="animate-spin text-[#FA3728]" size={28} />
      </div>
    );
  }

  const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username;

  const signOut = () => {
    authService.logout().finally(() => {
      window.location.href = '/';
    });
  };

  return (
    <div className="min-h-screen bg-canvas pb-28 md:pb-16">
      <AppBar
        title="Profile"
        showBack={false}
        action={
          <Link
            href="/profile/settings"
            aria-label="Settings"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
          >
            <Settings size={19} />
          </Link>
        }
      />

      <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6">
        {/* Identity */}
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#FA3728] text-xl font-bold text-white">
            {initialsOf(user)}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-ink">{name}</h1>
            <p className="truncate text-sm text-slate-600">{user.email}</p>
            {user.phone && <p className="truncate text-xs text-slate-500">{user.phone}</p>}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center">
            <p className="text-xl font-black text-ink">5</p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Following</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center">
            <p className="text-xl font-black text-ink">12</p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Orders</p>
          </div>
        </div>

        {/* Account */}
        <section className="space-y-2">
          <h2 className="px-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">Account</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            <MenuRow icon={Settings} title="Settings" subtitle="Profile, password and notifications" href="/profile/settings" />
            <MenuRow icon={Receipt} title="Payment history" subtitle="Receipts for your orders" href="/profile/payments" />
            <MenuRow icon={Bell} title="Notifications" subtitle="Order and message updates" href="/notifications" />
          </div>
        </section>

        {/* Others */}
        <section className="space-y-2">
          <h2 className="px-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">Others</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            {user.is_vendor ? (
              <MenuRow icon={Store} title="Vendor dashboard" subtitle="Manage your shop" href="/dashboard" />
            ) : (
              <MenuRow icon={Store} title="Become a vendor" subtitle="Start selling on ShopAm" href="/auth/signup" />
            )}
            <MenuRow icon={HelpCircle} title="Help & support" subtitle="Get answers and contact us" href="/support" />
          </div>
        </section>

        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut size={17} /> Sign out
        </button>

        <p className="pb-2 text-center text-[11px] text-slate-500">ShopAm · v1.0</p>
      </div>

      <BottomNav />
    </div>
  );
}
