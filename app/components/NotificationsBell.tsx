'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { notificationsService } from '@/lib/api';
import type { Notification } from '@/lib/api';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = 60_000;
  const h = 60 * m;
  const d = 24 * h;
  if (diff < m) return 'Just now';
  if (diff < h) return `${Math.floor(diff / m)}m ago`;
  if (diff < d) return `${Math.floor(diff / h)}h ago`;
  const days = Math.floor(diff / d);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const unread = items.filter((n) => !n.is_read).length;

  useEffect(() => {
    let active = true;
    notificationsService
      .list()
      .then((n) => {
        if (active) setItems(n);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const markAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await notificationsService.markAllRead();
    } catch {
      /* non-critical */
    }
  };

  const markRead = async (id: number) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await notificationsService.markRead(id);
    } catch {
      /* non-critical */
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-900/5"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FA3728] px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-11 z-50 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_50px_-20px_rgba(15,23,42,0.35)]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-sm font-bold text-ink">Notifications</h2>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-[11px] font-bold text-[#FA3728] hover:underline">
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                  <Bell size={22} className="text-slate-300" />
                  <p className="text-xs text-slate-500">No notifications yet.</p>
                </div>
              ) : (
                items.slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => markRead(item.id)}
                    className={`flex w-full items-start gap-2 border-b border-slate-50 px-4 py-3 text-left last:border-0 hover:bg-slate-50/60 ${
                      item.is_read ? 'border-l-2 border-l-transparent' : 'border-l-2 border-l-[#FA3728]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] leading-snug text-slate-700">
                        <span className="font-semibold text-ink">{item.actor?.username ?? 'ShopAm'}</span>
                        {': '}
                        {item.verb}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{timeAgo(item.created_at)}</p>
                    </div>
                    {!item.is_read && <span className="shrink-0 text-[10px] font-bold text-[#FA3728]">New</span>}
                  </button>
                ))
              )}
            </div>

            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block border-t border-slate-100 px-4 py-3 text-center text-[12px] font-bold text-ink transition-colors hover:bg-slate-50"
            >
              View all notifications
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
