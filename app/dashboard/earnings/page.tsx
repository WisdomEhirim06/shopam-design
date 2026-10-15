'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, Landmark, Loader2, Wallet } from 'lucide-react';
import { money } from '@/lib/order-steps';

const BALANCE = { available: 182500, pending: 93500, total: 452000 };

const TRANSACTIONS = [
  { id: 1, label: 'Order #101 settled', amount: 8400, type: 'credit', date: 'Today, 14:20' },
  { id: 2, label: 'Order #98 settled', amount: 12500, type: 'credit', date: 'Yesterday' },
  { id: 3, label: 'Platform fee', amount: -900, type: 'debit', date: 'Yesterday' },
  { id: 4, label: 'Payout to bank', amount: -40000, type: 'debit', date: 'Oct 12' },
  { id: 5, label: 'Order #91 settled', amount: 22000, type: 'credit', date: 'Oct 10' },
];

export default function EarningsPage() {
  const [bank, setBank] = useState({ bankName: 'Wema Bank', accountNumber: '0123456789', accountName: 'ShopAm Vendor' });
  const [withdraw, setWithdraw] = useState('');
  const [saving, setSaving] = useState(false);

  const saveBank = () => {
    setSaving(true);
    // TODO: wire to the payout/bank endpoint when available.
    setTimeout(() => setSaving(false), 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-ink">Earnings</h2>
        <p className="mt-1 text-sm text-slate-500">Your balance, payouts and transactions.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: 'Available balance', value: money(BALANCE.available), icon: Wallet, tone: 'ink' },
          { label: 'Pending payout', value: money(BALANCE.pending), icon: ArrowDownUp, tone: 'slate' },
          { label: 'Total earned', value: money(BALANCE.total), icon: Wallet, tone: 'red' },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-200/80 bg-white p-4">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone === 'ink' ? 'bg-ink text-white' : tone === 'red' ? 'bg-[#FA3728]/10 text-[#FA3728]' : 'bg-slate-100 text-slate-600'}`}>
              <Icon size={17} />
            </span>
            <p className="mt-3 text-2xl font-black tracking-tight text-ink">{value}</p>
            <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bank account */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Landmark size={17} className="text-ink" />
            <h3 className="text-sm font-bold text-ink">Payout account</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Bank', key: 'bankName' as const },
              { label: 'Account number', key: 'accountNumber' as const },
              { label: 'Account name', key: 'accountName' as const },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="mb-1 block text-xs font-semibold text-slate-500">{label}</label>
                <input
                  value={bank[key]}
                  onChange={(e) => setBank((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
                />
              </div>
            ))}
            <button
              onClick={saveBank}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-bold text-white transition-colors hover:bg-[#FA3728] disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Save account
            </button>
          </div>
        </section>

        {/* Withdraw */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Wallet size={17} className="text-ink" />
            <h3 className="text-sm font-bold text-ink">Withdraw</h3>
          </div>
          <p className="mb-3 text-xs text-slate-500">Available: <span className="font-bold text-ink">{money(BALANCE.available)}</span></p>
          <input
            type="number"
            inputMode="numeric"
            value={withdraw}
            onChange={(e) => setWithdraw(e.target.value)}
            placeholder="Amount (₦)"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
          />
          <button
            disabled={!Number(withdraw)}
            className="mt-3 w-full rounded-full bg-[#FA3728] py-3 text-sm font-bold text-white transition-colors hover:bg-[#E31B23] disabled:opacity-50"
          >
            Request withdrawal
          </button>
          <p className="mt-3 text-[11px] text-slate-400">Withdrawals are reviewed within 1–3 business days.</p>
        </section>
      </div>

      {/* Transactions */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <div className="border-b border-slate-100 px-5 py-3">
          <h3 className="text-sm font-bold text-ink">Transaction history</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {TRANSACTIONS.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink">{t.label}</p>
                <p className="text-[11px] text-slate-400">{t.date}</p>
              </div>
              <span className={`text-[13px] font-bold ${t.amount >= 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                {t.amount >= 0 ? '+' : ''}{money(Math.abs(t.amount))}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
