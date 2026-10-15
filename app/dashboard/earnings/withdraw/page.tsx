'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, CheckCircle2, Loader2, Landmark, Wallet } from 'lucide-react';
import { money } from '@/lib/order-steps';
import Field from '../../components/Field';
import { BALANCE } from '../data';

type Step = 'amount' | 'account' | 'review' | 'done';

const STEPS: Step[] = ['amount', 'account', 'review'];

export default function WithdrawPage() {
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState({ bankName: 'Wema Bank', accountNumber: '0123456789', accountName: 'ShopAm Vendor' });
  const [busy, setBusy] = useState(false);

  const value = Number(amount) || 0;
  const amountValid = value > 0 && value <= BALANCE.available;
  const accountValid = account.bankName.trim() && account.accountNumber.trim() && account.accountName.trim();

  const confirm = () => {
    setBusy(true);
    // TODO: wire to the payout/withdrawal endpoint when available.
    setTimeout(() => {
      setBusy(false);
      setStep('done');
    }, 700);
  };

  if (step === 'done') {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-2 py-14 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={42} strokeWidth={1.5} />
        </div>
        <h2 className="mt-5 text-2xl font-black tracking-tight text-ink">Withdrawal requested</h2>
        <p className="mt-2 text-sm text-slate-600">
          {money(value)} is on its way to <span className="font-semibold text-ink">{account.accountName}</span>. It&rsquo;s reviewed within 1–3 business days.
        </p>
        <Link href="/dashboard/earnings" className="mt-8 w-full rounded-full bg-ink py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#FA3728]">
          Back to earnings
        </Link>
      </div>
    );
  }

  const stepIndex = STEPS.indexOf(step as Step);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/earnings" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-xl font-black tracking-tight text-ink">Withdraw</h2>
          <p className="text-xs text-slate-600">Move your balance to your bank.</p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${done ? 'bg-emerald-500 text-white' : active ? 'bg-[#FA3728] text-white' : 'bg-slate-200 text-slate-600'}`}>
                {done ? <Check size={12} strokeWidth={3} /> : i + 1}
              </span>
              {i < STEPS.length - 1 && <span className={`h-0.5 flex-1 rounded-full ${i < stepIndex ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
            </div>
          );
        })}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-5"
      >
        {step === 'amount' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Wallet size={16} className="text-ink" /> Available:
              <span className="font-bold text-ink">{money(BALANCE.available)}</span>
            </div>
            <Field label="Amount (₦)" value={amount} onChange={setAmount} type="number" inputMode="decimal" />
            <div className="flex gap-2">
              {[10000, 50000, BALANCE.available].map((amt) => (
                <button key={amt} onClick={() => setAmount(String(amt))} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-ink hover:text-ink">
                  {amt === BALANCE.available ? 'All' : money(amt)}
                </button>
              ))}
            </div>
            {amount && !amountValid && <p className="text-xs font-medium text-red-500">Enter an amount up to {money(BALANCE.available)}.</p>}
            <button
              onClick={() => setStep('account')}
              disabled={!amountValid}
              className="w-full rounded-full bg-[#FA3728] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#E31B23] disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'account' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <Landmark size={16} /> Payout account
            </div>
            <Field label="Bank" value={account.bankName} onChange={(v) => setAccount((a) => ({ ...a, bankName: v }))} />
            <Field label="Account number" value={account.accountNumber} onChange={(v) => setAccount((a) => ({ ...a, accountNumber: v.replace(/\D/g, '').slice(0, 10) }))} inputMode="numeric" />
            <Field label="Account name" value={account.accountName} onChange={(v) => setAccount((a) => ({ ...a, accountName: v }))} />
            <div className="flex gap-2">
              <button onClick={() => setStep('amount')} className="flex-1 rounded-full border border-slate-200 bg-white py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink">
                Back
              </button>
              <button
                onClick={() => setStep('review')}
                disabled={!accountValid}
                className="flex-1 rounded-full bg-[#FA3728] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#E31B23] disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-ink">Review</h3>
            <div className="space-y-2.5 rounded-2xl bg-slate-50 p-4">
              {[
                { label: 'Amount', value: money(value) },
                { label: 'To', value: account.accountName },
                { label: 'Bank', value: account.bankName },
                { label: 'Account number', value: account.accountNumber },
              ].map(({ label, value: v }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold text-ink">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep('account')} className="flex-1 rounded-full border border-slate-200 bg-white py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink">
                Back
              </button>
              <button
                onClick={confirm}
                disabled={busy}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#FA3728] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#E31B23] disabled:opacity-60"
              >
                {busy && <Loader2 size={16} className="animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
