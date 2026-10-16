'use client';

import { useEffect, useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { notificationsService } from '@/lib/api';
import type { Notification } from '@/lib/api';
import AppBar from '@/app/components/ui/AppBar';
import BottomNav from '@/app/components/BottomNav';

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
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

function Row({ item, onRead }: { item: Notification; onRead: (id: number) => void }) {
  return (
    <button
      onClick={() => onRead(item.id)}
      className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3.5 text-left transition-colors last:border-0 hover:bg-slate-50/60 ${
        item.is_read ? 'border-l-2 border-l-transparent' : 'border-l-2 border-l-[#FA3728]'
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug text-slate-700">
          <span className="font-semibold text-ink">{item.actor?.username ?? 'ShopAm'}</span>
          {': '}
          {item.verb}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">{timeAgo(item.created_at)}</p>
      </div>
      {!item.is_read && <span className="shrink-0 pt-0.5 text-[10px] font-bold text-[#FA3728]">New</span>}
    </button>
  );
}

function Group({ title, items, onRead }: { title: string; items: Notification[]; onRead: (id: number) => void }) {
  return (
    <section className="space-y-2">
      <h2 className="px-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">{title}</h2>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        {items.map((item) => (
          <Row key={item.id} item={item} onRead={onRead} />
        ))}
      </div>
    </section>
  );
}

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    notificationsService
      .list()
      .then((n) => {
        if (active) setItems(n);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const unread = items.filter((n) => !n.is_read);

  const markAll = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await notificationsService.markAllRead();
    } catch {
      /* non-critical */
    }
  };

  const markOne = async (id: number) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await notificationsService.markRead(id);
    } catch {
      /* non-critical */
    }
  };

  const readItems = items.filter((n) => n.is_read);

  return (
    <div className="min-h-screen bg-canvas pb-28 md:pb-16">
      <AppBar
        title="Notifications"
        action={
          unread.length > 0 ? (
            <button onClick={markAll} className="shrink-0 text-[12px] font-bold text-[#FA3728] hover:underline">
              Mark all read
            </button>
          ) : undefined
        }
      />

      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#FA3728]" size={26} />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Bell size={24} />
            </span>
            <p className="text-sm font-bold text-ink">You&rsquo;re all caught up</p>
            <p className="text-xs text-slate-600">Order updates and messages will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {unread.length > 0 && <Group title="New" items={unread} onRead={markOne} />}
            {readItems.length > 0 && <Group title="Earlier" items={readItems} onRead={markOne} />}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
