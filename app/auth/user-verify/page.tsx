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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#FA3728] mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying your email…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left brand panel */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#FA3728] to-[#E31B23] relative overflow-hidden flex items-center justify-center p-8">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative z-10 text-center text-white max-w-md">
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <ShoppingBag className="text-[#FA3728]" size={32} />
            </div>
            <span className="text-4xl font-bold">ShopAm</span>
          </Link>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
            <div className="w-48 h-48 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Mail size={80} className="text-white" />
            </div>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <h2 className="text-3xl font-bold mb-4">Check Your Email</h2>
            <p className="text-lg opacity-90">
              We've sent a verification code to your email. Enter it below to complete your registration.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <Link href="/auth/user-signin" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FA3728] transition-colors mb-8">
            <ArrowLeft size={20} />
            <span>Back to Sign In</span>
          </Link>

          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Email Verified!</h2>
              <p className="text-gray-500">Taking you to the app…</p>
            </motion.div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Verify Code</h2>
                <p className="text-gray-600">Enter the 6-digit code sent to your email</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">{error}</div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4 text-center">Enter 6-Digit Code</label>
                  <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste}>
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
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-[#FA3728] outline-none transition-all text-gray-900"
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-500">Resend in <span className="font-semibold text-[#FA3728]">{resendTimer}s</span></p>
                  ) : (
                    <button type="button" onClick={handleResend} className="text-sm text-[#FA3728] hover:underline font-semibold">
                      Resend Code
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || code.join('').length !== 6}
                  className="w-full py-3.5 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Verifying…</> : 'Verify'}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Having trouble?{' '}
                    <Link href="/help" className="text-[#FA3728] hover:underline font-medium">Contact Support</Link>
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
