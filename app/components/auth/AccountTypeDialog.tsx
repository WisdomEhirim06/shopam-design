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
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed left-1/2 top-1/2 z-[90] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bricolage text-xl font-bold text-ink">Create an account</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-500">How do you want to use ShopAm?</p>

            <div className="mt-5 space-y-3">
              <Link
                href="/auth/user-signup"
                className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all hover:-translate-y-0.5 hover:border-[#FA3728] hover:bg-[#FA3728]/5 hover:shadow-sm"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FA3728]/10 text-[#FA3728]">
                  <ShoppingBag size={20} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">Shop</span>
                  <span className="block text-xs text-slate-500">Buy products &amp; services</span>
                </span>
              </Link>

              <Link
                href="/auth/signup"
                className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all hover:-translate-y-0.5 hover:border-[#2563EB] hover:bg-[#2563EB]/5 hover:shadow-sm"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB]">
                  <Store size={20} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">Sell</span>
                  <span className="block text-xs text-slate-500">Open a vendor store</span>
                </span>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
