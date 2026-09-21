'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, CreditCard, Building2, X, CheckCircle2, Loader2 } from 'lucide-react';
import { formatCardNumber, formatExpiry } from './chat-logic';

type BankStep = 'details' | 'verifying' | 'success' | null;
type CardStep = 'details' | 'otp' | 'success' | null;

interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface PaymentModalsProps {
  showPaymentSheet: boolean;
  paymentMethod: 'card' | 'bank' | null;
  bankStep: BankStep;
  bankDetailsLoading: boolean;
  bankDetails: BankDetails | null;
  cardStep: CardStep;
  cardNumber: string;
  expiry: string;
  cvv: string;
  otp: string[];
  isLoading: boolean;
  payAmount: number;
  otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;

  onBackdropDismiss: () => void;
  onCloseMethod: () => void;
  onSelectCard: () => void;
  onSelectBank: () => void;
  onBackFromBank: () => void;
  onISentIt: () => void;
  onBankSuccess: () => void;
  onCloseCard: () => void;
  onBackFromCard: () => void;
  onCardNumberChange: (v: string) => void;
  onExpiryChange: (v: string) => void;
  onCvvChange: (v: string) => void;
  onCardPay: () => void;
  onOtpChange: (v: string, i: number) => void;
  onOtpKeyDown: (e: React.KeyboardEvent, i: number) => void;
  onVerifyOtp: () => void;
  onCardSuccess: () => void;
}

export default function PaymentModals(props: PaymentModalsProps) {
  const {
    showPaymentSheet, paymentMethod, bankStep, bankDetailsLoading, bankDetails,
    cardStep, cardNumber, expiry, cvv, otp, isLoading, payAmount, otpRefs,
    onBackdropDismiss, onCloseMethod, onSelectCard, onSelectBank, onBackFromBank,
    onISentIt, onBankSuccess, onCloseCard, onBackFromCard, onCardNumberChange,
    onExpiryChange, onCvvChange, onCardPay, onOtpChange, onOtpKeyDown, onVerifyOtp, onCardSuccess,
  } = props;

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          PAYMENT MODAL — method selection + bank transfer
          Mobile: slides up from bottom
          Desktop: centered dialog
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPaymentSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-end sm:items-center justify-center sm:px-4 bg-black/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) onBackdropDismiss();
            }}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle (mobile only) */}
              <div className="sm:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1.5 rounded-full bg-gray-200" />
              </div>

              <div className="px-6 pt-4 pb-[max(env(safe-area-inset-bottom),24px)] sm:pb-8">

                {/* ── Method Selection ── */}
                {!paymentMethod && (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-xl font-bold text-gray-900">Pay for Order</h2>
                      <button
                        onClick={onCloseMethod}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X size={18} className="text-gray-500" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                      Total due: <span className="font-bold text-[#FA3728] text-base">₦{payAmount.toLocaleString()}</span>
                    </p>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={onSelectCard}
                        className="flex items-center gap-4 w-full p-4 border-2 border-gray-100 rounded-2xl hover:border-[#FA3728] hover:bg-[#FA3728]/5 active:scale-[0.98] transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#FA3728]/10 flex items-center justify-center flex-shrink-0">
                          <CreditCard size={22} className="text-[#FA3728]" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-bold text-gray-900 text-sm">Card Payment</p>
                          <p className="text-xs text-gray-500 mt-0.5">Debit or credit card</p>
                        </div>
                        <span className="text-gray-300 group-hover:text-[#FA3728] text-lg transition-colors">›</span>
                      </button>

                      <button
                        onClick={onSelectBank}
                        className="flex items-center gap-4 w-full p-4 border-2 border-gray-100 rounded-2xl hover:border-blue-400 hover:bg-blue-50/50 active:scale-[0.98] transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Building2 size={22} className="text-blue-500" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-bold text-gray-900 text-sm">Bank Transfer</p>
                          <p className="text-xs text-gray-500 mt-0.5">Transfer to a virtual account</p>
                        </div>
                        <span className="text-gray-300 group-hover:text-blue-400 text-lg transition-colors">›</span>
                      </button>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-5 flex items-center justify-center gap-1.5">
                      <Lock size={11} />
                      Secured by Monnify
                    </p>
                  </>
                )}

                {/* ── Bank Transfer: Loading ── */}
                {paymentMethod === 'bank' && bankStep === 'details' && bankDetailsLoading && (
                  <div className="flex flex-col items-center justify-center py-10 gap-4">
                    <Loader2 size={32} className="animate-spin text-blue-500" />
                    <p className="text-sm text-gray-500">Generating transfer details…</p>
                  </div>
                )}

                {/* ── Bank Transfer: Details ── */}
                {paymentMethod === 'bank' && bankStep === 'details' && !bankDetailsLoading && bankDetails && (
                  <>
                    <div className="flex items-center gap-3 mb-5">
                      <button onClick={onBackFromBank} className="p-2 rounded-full hover:bg-gray-100 -ml-2 transition-colors">
                        <ArrowLeft size={18} className="text-gray-600" />
                      </button>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Bank Transfer</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Transfer the exact amount below</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-5">
                      <p className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mb-4">Transfer to this account</p>
                      <div className="space-y-3.5">
                        {[
                          { label: 'Bank', value: bankDetails.bankName },
                          { label: 'Account Number', value: bankDetails.accountNumber, mono: true },
                          { label: 'Account Name', value: bankDetails.accountName },
                          { label: 'Amount', value: `₦${payAmount.toLocaleString()}`, highlight: true },
                        ].map(({ label, value, mono, highlight }) => (
                          <div key={label} className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{label}</span>
                            <span className={`text-sm font-bold ${highlight ? 'text-[#FA3728]' : 'text-gray-900'} ${mono ? 'font-mono tracking-wider' : ''}`}>
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5 text-xs text-amber-700 font-medium">
                      Transfer the exact amount. This account expires in 30 minutes.
                    </div>

                    <button
                      onClick={onISentIt}
                      className="w-full py-4 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white rounded-2xl font-bold text-sm transition-all shadow-md"
                    >
                      I&apos;ve Sent the Transfer
                    </button>
                  </>
                )}

                {/* ── Bank Transfer: Verifying ── */}
                {paymentMethod === 'bank' && bankStep === 'verifying' && (
                  <div className="flex flex-col items-center py-10 gap-5 text-center">
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                      <Loader2 size={80} className="text-blue-400 animate-spin absolute inset-0" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">Confirming Transfer…</p>
                      <p className="text-sm text-gray-500 mt-1">This may take a minute. Do not close this screen.</p>
                    </div>
                  </div>
                )}

                {/* ── Bank Transfer: Success ── */}
                {paymentMethod === 'bank' && bankStep === 'success' && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-5">
                      <CheckCircle2 size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Payment Confirmed!</h3>
                    <p className="text-sm text-gray-500 mb-6">Your transfer has been received and the order is now in progress.</p>
                    <button
                      onClick={onBankSuccess}
                      className="w-full py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-2xl font-bold text-sm transition-all"
                    >
                      Done
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          CARD PAYMENT MODAL
          Mobile: slides up from bottom
          Desktop: centered dialog
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {paymentMethod === 'card' && cardStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-4 bg-black/60"
            onClick={(e) => { if (e.target === e.currentTarget) onCloseCard(); }}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90dvh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle (mobile only) */}
              <div className="sm:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1.5 rounded-full bg-gray-200" />
              </div>

              <div className="px-6 pt-4 pb-[max(env(safe-area-inset-bottom),24px)] sm:pb-8">

                {/* ── Card Details ── */}
                {cardStep === 'details' && (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Card Payment</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Total: <span className="font-bold text-[#FA3728]">₦{payAmount.toLocaleString()}</span></p>
                      </div>
                      <button
                        onClick={onCloseCard}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X size={18} className="text-gray-500" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">Card Number</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={19}
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={e => onCardNumberChange(formatCardNumber(e.target.value))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-mono tracking-wider outline-none focus:border-[#FA3728] focus:ring-2 focus:ring-[#FA3728]/20 transition-all"
                        />
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-xs font-semibold text-gray-600 block mb-1.5">Expiry</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={5}
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={e => onExpiryChange(formatExpiry(e.target.value))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-mono outline-none focus:border-[#FA3728] focus:ring-2 focus:ring-[#FA3728]/20 transition-all"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-semibold text-gray-600 block mb-1.5">CVV</label>
                          <input
                            type="password"
                            inputMode="numeric"
                            maxLength={3}
                            placeholder="•••"
                            value={cvv}
                            onChange={e => onCvvChange(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-mono outline-none focus:border-[#FA3728] focus:ring-2 focus:ring-[#FA3728]/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onCardPay}
                      disabled={!cardNumber || !expiry || !cvv || isLoading}
                      className="w-full mt-6 py-4 bg-[#FA3728] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-[#E31B23] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                    >
                      {isLoading ? <Loader2 size={18} className="animate-spin" /> : `Pay ₦${payAmount.toLocaleString()}`}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
                      <Lock size={11} />
                      Secured by Monnify
                    </p>
                  </>
                )}

                {/* ── OTP ── */}
                {cardStep === 'otp' && (
                  <>
                    <div className="flex items-center gap-3 mb-5">
                      <button onClick={onBackFromCard} className="p-2 rounded-full hover:bg-gray-100 -ml-2 transition-colors">
                        <ArrowLeft size={18} className="text-gray-600" />
                      </button>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Enter OTP</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Check your phone or email for the code</p>
                      </div>
                    </div>

                    <div className="flex justify-between gap-2 sm:gap-3 mb-8">
                      {otp.map((d, i) => (
                        <input
                          key={i}
                          ref={el => { otpRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={d}
                          onChange={e => onOtpChange(e.target.value, i)}
                          onKeyDown={e => onOtpKeyDown(e, i)}
                          className="w-11 h-14 sm:w-12 sm:h-14 border-2 border-gray-200 rounded-xl text-center text-xl font-bold outline-none focus:border-[#FA3728] focus:ring-2 focus:ring-[#FA3728]/20 transition-all text-gray-900"
                        />
                      ))}
                    </div>

                    <button
                      onClick={onVerifyOtp}
                      disabled={!otp.every(d => d) || isLoading}
                      className="w-full py-4 bg-[#FA3728] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-[#E31B23] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                    >
                      {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Pay'}
                    </button>
                  </>
                )}

                {/* ── Card Success ── */}
                {cardStep === 'success' && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-5">
                      <CheckCircle2 size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Payment Successful!</h3>
                    <p className="text-sm text-gray-500 mb-6">Your order is now confirmed and in progress.</p>
                    <button
                      onClick={onCardSuccess}
                      disabled={isLoading}
                      className="w-full py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-2xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Done'}
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
