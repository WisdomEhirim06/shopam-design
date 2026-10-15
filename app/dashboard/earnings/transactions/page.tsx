'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { money } from '@/lib/order-steps';
import { TRANSACTIONS } from '../data';

export default function TransactionsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/earnings" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-xl font-black tracking-tight text-ink">Transactions</h2>
          <p className="text-xs text-slate-600">All credits and debits on your account.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        {TRANSACTIONS.map((t) => (
          <div key={t.id} className="flex items-center justify-between border-b border-slate-50 px-4 py-3.5 last:border-0">
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
    </div>
  );
}
