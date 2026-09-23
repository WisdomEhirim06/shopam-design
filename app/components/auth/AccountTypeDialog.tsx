'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, Store, X } from 'lucide-react';

export default function AccountTypeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 360 }}
            className="fixed left-1/2 top-1/2 z-[90] w-[calc(100%-3rem)] max-w-[320px] sm:max-w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white/90 backdrop-blur-2xl p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] border border-white/70 ring-1 ring-slate-900/5"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bricolage text-base sm:text-lg font-bold text-ink">Create an account</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-200/50 hover:text-slate-700 active:scale-95"
              >
                <X size={16} />
              </button>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">How do you want to use ShopAm?</p>

            <div className="mt-4 space-y-2.5">
              <Link
                href="/auth/user-signup"
                onClick={onClose}
                className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/70 bg-white/70 p-3 transition-all hover:border-[#FA3728]/40 hover:bg-white hover:shadow-sm active:scale-[0.98]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FA3728]/10 text-[#FA3728] transition-colors group-hover:bg-[#FA3728] group-hover:text-white">
                  <ShoppingBag size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-ink">Shop</span>
                  <span className="block text-[11px] text-slate-500 truncate">Buy products &amp; services</span>
                </span>
              </Link>

              <Link
                href="/auth/signup"
                onClick={onClose}
                className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/70 bg-white/70 p-3 transition-all hover:border-[#2563EB]/40 hover:bg-white hover:shadow-sm active:scale-[0.98]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB] transition-colors group-hover:bg-[#2563EB] group-hover:text-white">
                  <Store size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-ink">Sell</span>
                  <span className="block text-[11px] text-slate-500 truncate">Open a vendor store</span>
                </span>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
