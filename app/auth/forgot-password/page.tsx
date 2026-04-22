'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await authService.forgotPassword({ email });
      setSent(true);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to send reset link. Please check your email address.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-theme="light" className="h-screen flex overflow-hidden bg-gray-50">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#8B0000]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#800000] via-[#A50F15] to-[#800000]" />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white w-full">
          <Link href="/auth" className="absolute top-10 left-12">
            <Image src="/images/logo.png" alt="ShopAm" width={90} height={28} className="object-contain brightness-0 invert" />
          </Link>
          <div className="space-y-4 max-w-sm">
            <h2 className="text-3xl font-bold leading-tight">Forgot your password?</h2>
            <p className="text-base opacity-85 font-light">
              No worries. Enter your email and we'll send you a secure link to reset it.
            </p>
          </div>
          <div className="absolute bottom-12 left-16 opacity-60 text-sm">
            © 2026 ShopAm. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="min-h-full flex flex-col items-center justify-center py-12 px-6 sm:px-10 lg:px-12">
          <div className="w-full max-w-md mx-auto">
            <div className="lg:hidden mb-8 flex justify-center">
              <Image src="/images/black-logo.png" alt="ShopAm" width={140} height={42} className="object-contain" />
            </div>

            <Link href="/auth/signin" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-8 transition-colors">
              <ArrowLeft size={16} />
              Back to sign in
            </Link>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h2>
                <p className="text-gray-500 mb-6">
                  We sent a password reset link to <span className="font-semibold text-gray-800">{email}</span>
                </p>
                <p className="text-sm text-gray-400">
                  Didn't receive it?{' '}
                  <button onClick={() => setSent(false)} className="text-[#FA3728] hover:underline font-medium">
                    Try again
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Reset password</h2>
                  <p className="text-sm text-gray-500">Enter the email linked to your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FA3728] outline-none transition-colors bg-white text-gray-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="w-full py-4 bg-gradient-to-r from-[#FA3728] to-[#E31B23] text-white rounded-xl font-bold text-base transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={18} className="animate-spin" /> Sending…</>
                    ) : (
                      'Send reset link'
                    )}
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
