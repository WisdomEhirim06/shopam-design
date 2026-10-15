'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { money } from '@/lib/order-steps';
import BalanceCard from '../components/BalanceCard';
import { TRANSACTIONS } from './data';

export default function EarningsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-ink">Earnings</h2>
        <p className="mt-1 text-sm text-slate-600">Your balance, payouts and transactions.</p>
      </div>

      {/* Balance card */}
      <BalanceCard />

      {/* Transaction preview */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Transaction history</h3>
          <Link href="/dashboard/earnings/transactions" className="flex items-center gap-1 text-xs font-semibold text-[#FA3728] hover:underline">
            See more <ArrowRight size={13} />
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          {TRANSACTIONS.slice(0, 4).map((t) => (
            <div key={t.id} className="flex items-center justify-between border-b border-slate-50 px-4 py-3 last:border-0">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink">{t.label}</p>
                <p className="text-[11px] text-slate-500">{t.date}</p>
              </div>
              <span className={`text-[13px] font-bold ${t.amount >= 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                {t.amount >= 0 ? '+' : ''}{money(Math.abs(t.amount))}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Withdraw */}
      <Link
        href="/dashboard/earnings/withdraw"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FA3728] py-4 text-sm font-bold text-white transition-colors hover:bg-[#E31B23]"
      >
        <ArrowUpRight size={17} /> Withdraw funds
      </Link>
    </div>
  );
}
