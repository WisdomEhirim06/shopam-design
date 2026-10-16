'use client';

import Link from 'next/link';
import { Receipt } from 'lucide-react';
import AppBar from '@/app/components/ui/AppBar';
import BottomNav from '@/app/components/BottomNav';

export default function PaymentHistoryPage() {
  return (
    <div className="min-h-screen bg-canvas pb-28 md:pb-16">
      <AppBar title="Payment history" backHref="/profile" />
      <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Receipt size={24} />
          </span>
          <p className="text-sm font-bold text-ink">No payments yet</p>
          <p className="max-w-xs text-xs text-slate-600">
            Once you pay for an order, your receipts and payment history will show up here.
          </p>
          <Link
            href="/explore"
            className="mt-1 rounded-full bg-[#FA3728] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#E31B23]"
          >
            Start shopping
          </Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
