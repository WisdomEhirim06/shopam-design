'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import apiClient, { API_ENDPOINTS } from '@/lib/api/config';
import { DEV_AUTH_BYPASS } from '@/lib/devAuth';
import { authService, notificationsService } from '@/lib/api';
import type { Notification } from '@/lib/api';
import { pageTitle } from './nav';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import NotificationsPanel from './components/NotificationsPanel';

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const authCheckRan = useRef(false);

  useEffect(() => {
    if (authCheckRan.current) return;
    authCheckRan.current = true;

    if (!localStorage.getItem('user')) {
      window.location.replace('/auth/signin?redirect=' + encodeURIComponent(pathname));
      return;
    }
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') ?? 'null');
      if (storedUser && storedUser.is_vendor === false && !DEV_AUTH_BYPASS) {
        window.location.replace('/explore');
        return;
      }
    } catch {
      /* corrupt user blob — let API-level auth decide */
    }
    setAuthChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const ping = () => {
      if (document.hidden) return;
      apiClient.get(API_ENDPOINTS.AUTH.PROFILE, { headers: { 'X-Keepalive': 'true' } }).catch(() => {});
    };
    const id = setInterval(ping, 4 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    notificationsService.list().then(setNotifications).catch(() => {});
  }, [authChecked]);

  if (!authChecked) return null;

  const user = authService.getCurrentUser();
  const initial = (user?.first_name || user?.username || 'V').charAt(0).toUpperCase();
  const unread = notifications.filter((n) => !n.is_read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    notificationsService.markAllRead().catch(() => {});
  };

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink antialiased">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur-md md:pl-60">
        <div className="flex h-14 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="md:hidden">
              <Image src="/images/black-logo.png" alt="ShopAm" width={88} height={24} className="h-6 w-auto object-contain" />
            </Link>
            <h1 className="text-[15px] font-bold text-ink">{pageTitle(pathname)}</h1>
          </div>

          <div className="relative flex items-center gap-1">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100"
            >
              <Bell size={18} />
              {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#FA3728]" />}
            </button>
            <NotificationsPanel open={notifOpen} items={notifications} onClose={() => setNotifOpen(false)} onMarkAllRead={markAllRead} />
            <Link
              href="/dashboard/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-bold text-white"
            >
              {initial}
            </Link>
          </div>
        </div>
      </header>

      {/* Desktop sidebar */}
      <Sidebar />

      {/* Content */}
      <main className="md:pl-60">
        <div className="mx-auto max-w-5xl px-4 pb-24 pt-5 md:px-8 md:pb-12 md:pt-8">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
