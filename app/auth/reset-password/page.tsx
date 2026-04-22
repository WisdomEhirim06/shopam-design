'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await authService.resetPassword({ email, reset_token: token, password });
      setDone(true);
      setTimeout(() => router.push('/auth/signin'), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Reset failed. The link may have expired.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium">Invalid or missing reset link.</p>
        <Link href="/auth/forgot-password" className="text-[#FA3728] underline mt-4 block">
          Request a new one
        </Link>
      </div>
    );
  }

  return (
    <div data-theme="light" className="h-screen flex overflow-hidden bg-gray-50">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#8B0000]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#800000] via-[#A50F15] to-[#800000]" />
        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white w-full">
          <Link href="/auth" className="absolute top-10 left-12">
            <Image src="/images/logo.png" alt="ShopAm" width={90} height={28} className="object-contain brightness-0 invert" />
          </Link>
          <div className="max-w-sm space-y-4">
            <h2 className="text-3xl font-bold">Set a new password</h2>
            <p className="opacity-85 font-light">Choose a strong password you haven't used before.</p>
          </div>
          <div className="absolute bottom-12 left-16 opacity-60 text-sm">© 2026 ShopAm. All rights reserved.</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        <div className="min-h-full flex flex-col items-center justify-center py-12 px-6 sm:px-10 lg:px-12">
          <div className="w-full max-w-md mx-auto">
            <div className="lg:hidden mb-8 flex justify-center">
              <Image src="/images/black-logo.png" alt="ShopAm" width={140} height={42} className="object-contain" />
            </div>

            {done ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Password updated!</h2>
                <p className="text-gray-500">Redirecting you to sign in…</p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">New password</h2>
                  <p className="text-sm text-gray-500">Enter your new password below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full pl-4 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FA3728] outline-none transition-colors bg-white text-gray-900"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FA3728] outline-none transition-colors bg-white text-gray-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !password || !confirmPassword}
                    className="w-full py-4 bg-gradient-to-r from-[#FA3728] to-[#E31B23] text-white rounded-xl font-bold text-base transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Updating…</> : 'Update password'}
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#FA3728] border-t-transparent rounded-full animate-spin" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
