'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Shield, Zap, ShoppingBag } from 'lucide-react';
import { authService } from '@/lib/api';
import { Suspense } from 'react';

function UserSignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('redirect') || '/explore';
  const justVerified = searchParams.get('verified') === '1';

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

      console.log('Login successful:', response.user);

      // Check if user is a customer (not vendor)
      if (response.user.is_vendor) {
        setError('Please use vendor sign-in page');
        setIsSubmitting(false);
        return;
      }

      // Redirect to explore page after successful login
      router.push(returnUrl);
    } catch (err: any) {
      console.error('Login error:', err);

      // Handle EMAIL_NOT_VERIFIED error
      if (err.response?.data?.error === 'EMAIL_NOT_VERIFIED' || err.response?.data?.code === 'EMAIL_NOT_VERIFIED' || err.response?.data?.detail === 'Email not verified') {
        router.push('/auth/user-verify');
        return;
      }
      
      // Handle different error types
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 400) {
        setError('Please check your credentials');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-theme="light" className="h-screen flex overflow-hidden bg-white">
      {/* Left Side - Red Brand Section */}
      <div className="hidden lg:flex flex-col lg:w-1/2 bg-[#8B0000] relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-2.png" 
            alt="Customer shopping" 
            fill 
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#800000] via-[#A50F15] to-[#800000] opacity-90 mix-blend-multiply"></div>
        </div>

        {/* Content - Aligned to top to match form */}
        <div className="relative z-10 flex flex-col justify-start h-full p-8 lg:p-16 pt-24 lg:pt-32 text-white">
          {/* Logo */}
          <Link href="/" className="mb-8">
            <Image src="/images/logo.png" alt="ShopAm Logo" width={110} height={36} className="object-contain brightness-0 invert" />
          </Link>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight">
              Your Safest Way<br />To Shop Online
            </h1>
            <p className="text-base opacity-85 mb-6 max-w-sm font-light">
              Find trusted vendors, browse local products and shop securely in your community.
            </p>
          </motion.div>
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

          {/* Form Header */}
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
              Sign In to ShopAm
            </h2>
            <p className="text-sm text-gray-600">Connect with your community</p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email verified banner */}
            {justVerified && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
                ✓ Email verified! Sign in to continue.
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] outline-none transition-all text-gray-900"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] outline-none transition-all text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end text-sm mt-2">
              <Link href="/auth/forgot-password" className="text-[#FA3728] hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>



            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/user-signup" className="text-[#FA3728] hover:underline font-semibold">
                Create Account
              </Link>
            </p>

            {/* Vendor Link */}
            <p className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
              Are you a vendor?{' '}
              <Link href="/auth/signin" className="text-[#FA3728] hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserSignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserSignInForm />
    </Suspense>
  );
}