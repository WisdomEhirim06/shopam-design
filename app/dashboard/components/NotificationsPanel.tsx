'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import type { Notification } from '@/lib/api';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = 3_600_000;
  if (diff < h) return 'Just now';
  if (diff < 24 * h) return `${Math.floor(diff / h)}h ago`;
  return `${Math.floor(diff / (24 * h))}d ago`;
}

export default function NotificationsPanel({
  open,
  items,
  onClose,
  onMarkAllRead,
}: {
  open: boolean;
  items: Notification[];
  onClose: () => void;
  onMarkAllRead: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-11 z-50 w-[19rem] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_50px_-20px_rgba(15,23,42,0.35)]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-sm font-bold text-ink">Notifications</h2>
              <button onClick={onMarkAllRead} className="text-[11px] font-bold text-[#FA3728] hover:underline">
                Mark all read
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                  <Bell size={22} className="text-slate-300" />
                  <p className="text-xs text-slate-400">No notifications yet.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 border-b border-slate-50 px-4 py-3 last:border-0">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.is_read ? 'bg-slate-200' : 'bg-[#FA3728]'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] leading-snug text-ink">
                        <span className="font-semibold">{item.actor?.username ?? 'ShopAm'}</span> {item.verb}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{timeAgo(item.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
