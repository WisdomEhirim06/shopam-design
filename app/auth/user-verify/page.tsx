'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Mail, ShoppingBag, CheckCircle2, Loader2 } from 'lucide-react';
import { authService } from '@/lib/api';

function UserVerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // When user clicks link in email, token arrives as ?token=...
  const urlToken = searchParams.get('token');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const inputRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));
  const [code, setCode] = useState(Array(6).fill(''));

  // If token arrived via URL (email link click), verify automatically
  useEffect(() => {
    if (!urlToken) return;
    setIsSubmitting(true);
    authService.verifyEmail(urlToken)
      .then(() => {
        setSuccess(true);
        setTimeout(() => router.push('/explore'), 2500);
      })
      .catch(() => {
        setError('Verification link is invalid or has expired. Please request a new one.');
      })
      .finally(() => setIsSubmitting(false));
  }, [urlToken, router]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1 || !/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) inputRefs[index + 1].current?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) inputRefs[index - 1].current?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;
    const next = [...pasted.split(''), ...Array(6 - pasted.length).fill('')];
    setCode(next);
    inputRefs[Math.min(pasted.length, 5)].current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = code.join('');
    if (token.length !== 6) { setError('Please enter all 6 digits'); return; }
    setError('');
    setIsSubmitting(true);
    try {
      await authService.verifyEmail(token);
      setSuccess(true);
      setTimeout(() => router.push('/explore'), 2500);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Invalid code. Please check your email and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(60);
    setError('');
    // Backend re-sends verification when user tries login with unverified account
  };

  // Auto-verify state when URL token is present
  if (urlToken && isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#FA3728] mx-auto mb-6" />
          <p className="text-xl text-gray-700 font-semibold tracking-tight">Verifying your account…</p>
          <p className="text-gray-500 mt-2">Just a moment while we confirm your email.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left brand panel - Refined with better contrast and typography */}
      <div className="lg:w-1/2 bg-[#FA3728] relative overflow-hidden flex items-center justify-center p-12">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66 3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-4c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm63-31c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM33 46c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-7-7c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM56 16c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-7 7c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-12 3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm29 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM9 26c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
        
        <div className="relative z-10 text-center text-white max-w-lg">
          <Link href="/" className="inline-flex items-center gap-4 mb-16 group">
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="text-[#FA3728]" size={40} />
            </div>
            <div className="text-left">
              <span className="text-4xl font-extrabold tracking-tight block">ShopAm</span>
              <span className="text-sm font-medium opacity-80 tracking-widest uppercase">Verified Commerce</span>
            </div>
          </Link>

          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="mb-12 relative">
            <div className="w-56 h-56 mx-auto bg-white/10 rounded-[3rem] flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl relative z-10">
              <Mail size={100} className="text-white" />
            </div>
            {/* Animated decorative circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full animate-pulse" />
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <h2 className="text-4xl font-bold mb-6 tracking-tight">Security Check</h2>
            <p className="text-xl opacity-90 leading-relaxed font-light">
              We've sent a unique 6-digit verification code to your mailbox. Please enter it to secure your account.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right form panel - Cleaner and more focused */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-10 lg:p-12 relative">
          <Link href="/auth/user-signin" className="absolute -top-16 left-0 lg:left-0 inline-flex items-center gap-2 text-gray-500 hover:text-[#FA3728] transition-colors font-medium">
            <ArrowLeft size={20} />
            <span>Back to Sign In</span>
          </Link>

          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 size={56} strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Verified!</h2>
              <p className="text-gray-500 text-lg">Your account is now active. Redirecting you to the platform…</p>
            </motion.div>
          ) : (
            <>
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Enter Code</h2>
                <p className="text-gray-500 font-medium">Check your inbox for the verification digits</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium text-center shadow-sm">
                    {error}
                  </motion.div>
                )}

                <div className="space-y-6">
                  <div className="flex gap-3 sm:gap-4 justify-center" onPaste={handlePaste}>
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        ref={inputRefs[i]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className="w-12 h-16 sm:w-16 sm:h-20 text-center text-3xl font-bold border-2 border-gray-100 bg-gray-50/50 rounded-2xl focus:ring-4 focus:ring-[#FA3728]/10 focus:border-[#FA3728] focus:bg-white outline-none transition-all text-gray-900 shadow-sm"
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="text-sm text-gray-500 font-medium mb-3">Didn't get the email?</p>
                  {resendTimer > 0 ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                      <Loader2 size={12} className="animate-spin" />
                      RESEND IN {resendTimer}S
                    </div>
                  ) : (
                    <button type="button" onClick={handleResend} className="text-sm text-[#FA3728] hover:text-[#E31B23] font-bold underline-offset-4 hover:underline transition-all">
                      Resend Verification Code
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || code.join('').length !== 6}
                  className="w-full py-4.5 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-2xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-[#FA3728]/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isSubmitting ? <><Loader2 size={24} className="animate-spin" /> Verifying</> : 'Verify Account'}
                </button>

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-400 font-medium">
                    Need help?{' '}
                    <Link href="/help" className="text-[#FA3728] hover:underline">Support Center</Link>
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserVerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-[#FA3728]" /></div>}>
      <UserVerifyForm />
    </Suspense>
  );
}
