'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Building2, CheckCircle2, CreditCard, Loader2, Lock } from 'lucide-react';
import { paymentsService } from '@/lib/api';
import { formatCardNumber, formatExpiry } from '@/lib/format';
import { money } from '@/lib/order-steps';

type Method = 'card' | 'bank';
type CardStep = 'form' | 'otp';
type BankStep = 'details' | 'verifying' | 'done';

export default function PaymentStep({
  orderId,
  amount,
  onPaid,
}: {
  orderId: string;
  amount: number;
  onPaid: () => void;
}) {
  const [method, setMethod] = useState<Method | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [txRef, setTxRef] = useState('');

  const [cardStep, setCardStep] = useState<CardStep>('form');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [otp, setOtp] = useState('');

  const [bankStep, setBankStep] = useState<BankStep>('details');
  const [bank, setBank] = useState<{ bankName: string; accountNumber: string; accountName: string } | null>(null);

  const ensureInit = async (): Promise<string> => {
    if (txRef) return txRef;
    const res = await paymentsService.initCheckout({ order_id: orderId });
    setTxRef(res.transaction_reference);
    return res.transaction_reference;
  };

  /* Poll for bank transfer confirmation. */
  useEffect(() => {
    if (method !== 'bank' || bankStep !== 'verifying' || !txRef) return;
    let cancelled = false;

    const tick = async () => {
      try {
        const status = (await paymentsService.getStatus(txRef)) as Record<string, unknown>;
        const paid =
          status?.paymentStatus === 'PAID' ||
          status?.status === 'PAID' ||
          status?.status === 'successful' ||
          status?.status === 'success';
        if (paid && !cancelled) {
          setBankStep('done');
          onPaid();
        }
      } catch {
        /* keep polling */
      }
    };

    void tick();
    const id = setInterval(tick, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, bankStep, txRef]);

  const selectCard = () => {
    setMethod('card');
    setCardStep('form');
    setError('');
  };

  const selectBank = async () => {
    setMethod('bank');
    setBusy(true);
    setError('');
    try {
      const ref = await ensureInit();
      const res = (await paymentsService.bankTransfer({ transaction_reference: ref })) as Record<string, unknown>;
      setBank({
        bankName: (res.bankName ?? res.bank_name ?? 'Wema Bank') as string,
        accountNumber: (res.accountNumber ?? res.account_number ?? '') as string,
        accountName: (res.accountName ?? res.account_name ?? 'ShopAm') as string,
      });
      setBankStep('details');
    } catch {
      setError('Could not generate transfer details. Please try again.');
      setMethod(null);
    } finally {
      setBusy(false);
    }
  };

  const payWithCard = async () => {
    if (!cardNumber || !expiry || !cvv) return;
    setBusy(true);
    setError('');
    try {
      const ref = await ensureInit();
      const [mm, yy] = expiry.split('/');
      await paymentsService.directCharge({
        transaction_reference: ref,
        number: cardNumber.replace(/\s/g, ''),
        expiryMonth: (mm || '').trim(),
        expiryYear: (yy || '').trim().length === 2 ? `20${yy.trim()}` : (yy || '').trim(),
        cvv,
      });
      onPaid();
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { responseMessage?: string } } };
      const needsOtp =
        e?.response?.status === 400 || /otp/i.test(e?.response?.data?.responseMessage ?? '');
      if (needsOtp) setCardStep('otp');
      else setError('Card payment failed. Please check your details and try again.');
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return;
    setBusy(true);
    setError('');
    try {
      await paymentsService.authorizeOTP({ transaction_reference: txRef, token_id: 'otp', token: otp });
      onPaid();
    } catch {
      setError('OTP verification failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  /* ── Method selection ── */
  if (!method) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-ink">Payment method</h2>
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}

        <button
          onClick={selectCard}
          className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-ink active:scale-[0.99]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-ink">
            <CreditCard size={20} />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-ink">Card</span>
            <span className="block text-xs text-slate-500">Debit or credit card</span>
          </span>
        </button>

        <button
          onClick={selectBank}
          className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-ink active:scale-[0.99]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-ink">
            <Building2 size={20} />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-ink">Bank transfer</span>
            <span className="block text-xs text-slate-500">Transfer to a one-time account</span>
          </span>
        </button>

        <p className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-400">
          <Lock size={11} />
          Secured by Monnify
        </p>
      </div>
    );
  }

  /* ── Card ── */
  if (method === 'card') {
    return (
      <div>
        <button onClick={() => setMethod(null)} className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-ink">
          <ArrowLeft size={16} /> Payment method
        </button>

        {error && <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}

        {cardStep === 'form' ? (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Card number</label>
              <input
                inputMode="numeric"
                maxLength={19}
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-mono text-sm tracking-wider text-ink outline-none focus:border-ink"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Expiry</label>
                <input
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-mono text-sm text-ink outline-none focus:border-ink"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">CVV</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={3}
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-mono text-sm text-ink outline-none focus:border-ink"
                />
              </div>
            </div>
            <button
              onClick={payWithCard}
              disabled={!cardNumber || !expiry || !cvv || busy}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-bold text-white transition-colors hover:bg-[#FA3728] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? <Loader2 size={18} className="animate-spin" /> : `Pay ${money(amount)}`}
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-base font-bold text-ink">Enter the OTP sent to you</h3>
            <p className="mt-1 text-xs text-slate-500">Check your phone or email for the code.</p>
            <input
              inputMode="numeric"
              maxLength={6}
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-ink outline-none focus:border-ink"
            />
            <button
              onClick={verifyOtp}
              disabled={!otp || busy}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-bold text-white transition-colors hover:bg-[#FA3728] disabled:opacity-50"
            >
              {busy ? <Loader2 size={18} className="animate-spin" /> : 'Verify & pay'}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ── Bank transfer ── */
  return (
    <div>
      <button
        onClick={() => { setMethod(null); setBankStep('details'); }}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-ink"
      >
        <ArrowLeft size={16} /> Payment method
      </button>

      {error && <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}

      {bankStep === 'done' ? (
        <div className="flex flex-col items-center py-6 text-center">
          <CheckCircle2 size={44} className="text-emerald-500" strokeWidth={1.5} />
          <p className="mt-3 text-base font-bold text-ink">Payment confirmed</p>
        </div>
      ) : bankStep === 'verifying' ? (
        <div className="flex flex-col items-center py-8 text-center">
          <Loader2 size={40} className="animate-spin text-[#FA3728]" />
          <p className="mt-4 text-sm font-bold text-ink">Confirming your transfer…</p>
          <p className="mt-1 text-xs text-slate-500">This can take a minute. Don&apos;t close this page.</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Transfer to this account
            </p>
            <div className="space-y-3.5">
              {[
                { label: 'Bank', value: bank?.bankName ?? '—' },
                { label: 'Account number', value: bank?.accountNumber ?? '—', mono: true },
                { label: 'Account name', value: bank?.accountName ?? '—' },
                { label: 'Amount', value: money(amount), highlight: true },
              ].map(({ label, value, mono, highlight }) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className={`text-sm font-bold ${highlight ? 'text-[#FA3728]' : 'text-ink'} ${mono ? 'font-mono tracking-wider' : ''}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">
            Transfer the exact amount. This account expires in 30 minutes.
          </p>
          <button
            onClick={() => setBankStep('verifying')}
            disabled={!bank}
            className="mt-4 w-full rounded-full bg-ink py-4 text-sm font-bold text-white transition-colors hover:bg-[#FA3728] disabled:opacity-50"
          >
            I&apos;ve sent the transfer
          </button>
        </>
      )}
    </div>
  );
}
