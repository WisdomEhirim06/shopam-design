'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Mail, ShoppingBag, CheckCircle2, Loader2 } from 'lucide-react';
import { authService } from '@/lib/api';

function UserVerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get('token');
  const emailHint = searchParams.get('email');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [verifiedNeedsSignIn, setVerifiedNeedsSignIn] = useState(false);

  useEffect(() => {
    if (!urlToken) return;
    setIsSubmitting(true);
    authService.verifyEmail(urlToken)
      .then(({ authenticated }) => {
        setSuccess(true);
        if (authenticated) {
          setTimeout(() => router.push('/explore'), 5000);
        } else {
          setVerifiedNeedsSignIn(true);
          setTimeout(() => router.push('/auth/user-signin?verified=1'), 5000);
        }
      })
      .catch((err: any) => {
        setError(err?.message ?? 'Verification link is invalid or has expired.');
          })
      .finally(() => setIsSubmitting(false));
  }, [urlToken, router]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(60);
    setError('');
  };

  if (urlToken && isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#FA3728] mx-auto mb-6" />
          <p className="text-xl text-gray-700 font-semibold">Verifying your account…</p>
          <p className="text-gray-500 mt-2 text-sm">Just a moment while we confirm your email.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left brand panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FA3728] relative overflow-hidden flex-col items-center justify-center p-12">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm28-65c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 text-center text-white max-w-md">
          <Link href="/" className="inline-flex items-center gap-3 mb-14 group">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
              <ShoppingBag className="text-[#FA3728]" size={32} />
            </div>
            <div className="text-left">
              <span className="text-3xl font-extrabold tracking-tight block">ShopAm</span>
              <span className="text-xs font-medium opacity-75 tracking-widest uppercase">Verified Commerce</span>
            </div>
          </Link>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-10 relative"
          >
            <div className="w-48 h-48 mx-auto bg-white/10 rounded-[2.5rem] flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl">
              <Mail size={80} className="text-white" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full animate-pulse" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Check Your Inbox</h2>
            <p className="text-base opacity-85 leading-relaxed font-light">
              We've sent a verification link to your mailbox. Click it to activate your account.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-h-screen bg-white overflow-y-auto">
        {/* Mobile-only top bar */}
        <div className="lg:hidden flex items-center justify-between px-5 pt-6 pb-4 border-b border-gray-100">
          <Link href="/auth/user-signin" className="flex items-center gap-1.5 text-gray-500 hover:text-[#FA3728] transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Sign In
          </Link>
          <Link href="/">
            <Image src="/images/black-logo.png" alt="ShopAm" width={100} height={32} className="object-contain" />
          </Link>
          <div className="w-16" />
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8 lg:px-16">
          <div className="w-full max-w-md">

            {/* Desktop back link */}
            <Link href="/auth/user-signin" className="hidden lg:inline-flex items-center gap-2 text-gray-500 hover:text-[#FA3728] transition-colors text-sm font-medium mb-8">
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>

            {/* Mobile email icon accent */}
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                <Mail size={32} className="text-[#FA3728]" />
              </div>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <CheckCircle2 size={48} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">Verified!</h2>
                <p className="text-gray-500">
                  {verifiedNeedsSignIn
                    ? 'Your email is confirmed. Redirecting you to sign in…'
                    : 'Your account is now active. Redirecting you to the platform…'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Verify Your Email</h2>
                  <p className="text-sm sm:text-base text-gray-500">
                    {emailHint ? (
                      <>A verification link has been sent to <span className="text-gray-800 font-semibold break-all">{emailHint}</span>. Click the link in your inbox to activate your account.</>
                    ) : (
                      'A verification link has been sent to your email address. Click the link in your inbox to activate your account.'
                    )}
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-500 text-center">
                  Didn't receive the email? Check your spam folder or request a new link below.
                </div>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                      <Loader2 size={11} className="animate-spin" />
                      Resend available in {resendTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-sm text-[#FA3728] hover:text-[#E31B23] font-semibold underline-offset-4 hover:underline transition-all"
                    >
                      Resend Verification Link
                    </button>
                  )}
                </div>

                <p className="text-center text-xs text-gray-400">
                  Need help?{' '}
                  <Link href="/help" className="text-[#FA3728] hover:underline">Support Center</Link>
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#FA3728]" />
      </div>
    }>
      <UserVerifyForm />
    </Suspense>
  );
}
