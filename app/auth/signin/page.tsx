'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import { authService } from '@/lib/api';

function VendorSignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justVerified = searchParams.get('verified') === '1';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Real API call
      const response = await authService.login({
        username: formData.email, // Backend accepts email as username
        password: formData.password,
      });

      // Only block if the backend explicitly says is_vendor: false.
      // If the field is absent from the login response, allow through.
      if (response.user.is_vendor === false) {
        setError('This account is not a vendor account. Please use the customer sign-in page.');
        setIsSubmitting(false);
        return;
      }

      // Redirect to vendor dashboard
      router.push('/dashboard');
    } catch (err: any) {
      const data = err.response?.data;
      console.error('Login error:', err.response?.status, data);

      // Handle EMAIL_NOT_VERIFIED error
      if (data?.error === 'EMAIL_NOT_VERIFIED' || data?.code === 'EMAIL_NOT_VERIFIED' || data?.detail === 'Email not verified') {
        router.push('/auth/user-verify');
        return;
      }

      // Show the most specific message the backend gives us
      const msg = data?.message || data?.detail || data?.error || data?.non_field_errors?.[0];
      if (msg) {
        setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      } else if (err.response?.status === 401) {
        setError('Invalid email or password. If you just verified your email, try again — vendor accounts may require admin approval.');
      } else if (err.response?.status === 400) {
        setError(data ? JSON.stringify(data) : 'Please check your credentials');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-theme="light" className="h-screen flex overflow-hidden bg-gray-50">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#8B0000]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-man-shopping.JPG"
            alt="Vendors background"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#800000] via-[#A50F15] to-[#800000] opacity-90 mix-blend-multiply"></div>
        </div>

        {/* Content - Aligned with Form */}
        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white w-full">
          {/* Logo - Top */}
          <Link href="/auth" className="absolute top-10 left-12">
            <Image
              src="/images/logo.png"
              alt="ShopAm Logo"
              width={90}
              height={28}
              className="object-contain brightness-0 invert"
            />
          </Link>

          {/* Main Content */}
          <div className="space-y-6 max-w-sm">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-2 leading-tight">
                Welcome Back!
              </h2>
              <p className="text-base opacity-85 font-light">
                Securely manage your store and reach more customers today.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              {[
                { value: '..', label: 'Trusted Vendors' },
                { value: '..', label: 'Monthly Traffic' },
                { value: 'Secure', label: 'Vendor Payouts' },
                { value: 'Swift', label: 'Payments' },
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                  <p className="text-xl font-bold mb-0.5">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-wider opacity-75 font-semibold">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Footer - Bottom */}
          <div className="absolute bottom-12 left-16 opacity-60">
            <p className="text-sm">© 2026 ShopAm. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form Container */}
      <div className="flex-1 w-full lg:w-1/2 overflow-y-auto bg-white">
        <div className="min-h-full w-full flex flex-col items-center justify-start lg:justify-center py-12 lg:py-20 px-6 sm:px-10 lg:px-12">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Header */}
            <div className="lg:hidden mb-6 flex justify-center w-full relative">
              <Link href="/">
                <Image src="/images/black-logo.png" alt="ShopAm Logo" width={140} height={42} className="object-contain" />
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1 text-gray-900">Sign In</h2>
                <p className="text-sm text-gray-500">
                  Welcome back! Please enter your credentials
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email verified banner */}
                {justVerified && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
                    ✓ Email verified! Sign in to continue.
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FA3728] outline-none transition-colors bg-white text-gray-900"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-4 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FA3728] outline-none transition-colors bg-white text-gray-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:opacity-80 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end text-sm mt-2">
                  <Link
                    href="/auth/forgot-password"
                    className="text-[#FA3728] hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.email || !formData.password}
                  className="w-full py-4 mt-8 bg-gradient-to-r from-[#FA3728] to-[#E31B23] text-white rounded-xl font-bold text-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col items-center gap-4 text-sm text-gray-500">
                <p>
                  New to ShopAm?{' '}
                  <Link href="/auth/signup" className="text-[#FA3728] hover:underline font-semibold text-base">
                    Create Vendor Account
                  </Link>
                </p>
                <p>
                  Need help?{' '}
                  <a href="#" className="text-[#FA3728] hover:underline font-medium">Contact Support</a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VendorSignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-[#FA3728]" /></div>}>
      <VendorSignInForm />
    </Suspense>
  );
}