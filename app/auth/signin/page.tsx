'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import { authService } from '@/lib/api';

export default function VendorSignInPage() {
  const router = useRouter();
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

      console.log('Login successful:', response.user);

      // Check if user is a vendor
      if (!response.user.is_vendor) {
        setError('Please use customer sign-in page');
        setIsSubmitting(false);
        return;
      }

      // Redirect to vendor dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);

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
    <div data-theme="light" className="min-h-screen flex bg-gray-50">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: 'var(--primary-red)' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Content - CENTERED */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white w-full">
          {/* Main Content */}
          <div className="space-y-8 max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-5xl font-bold mb-4 leading-tight">
                Welcome Back!
              </h2>
              <p className="text-xl opacity-90 font-light">
                Sign in to manage your store
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: '10,000+', label: 'Active Vendors' },
                { value: '50,000+', label: 'Products Listed' },
                { value: '₦5M+', label: 'Daily Sales' },
                { value: '24/7', label: 'Support' },
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs opacity-90">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Logo - Top */}
          <Link href="/auth" className="absolute top-8 left-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="font-bold text-lg" style={{ color: 'var(--primary-red)' }}>SA</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">ShopAm</h1>
              <p className="text-xs opacity-90">Vendor Dashboard</p>
            </div>
          </Link>

          {/* Footer - Bottom */}
          <div className="absolute bottom-8 opacity-75">
            <p className="text-sm">© 2026 ShopAm. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-12 flex justify-between items-center w-full relative">
            <Link href="/" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#FA3728] transition-colors absolute left-0">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex-1 flex justify-center">
              <Image src="/images/black-logo.png" alt="ShopAm Logo" width={100} height={100} className="object-contain" />
            </div>
          </div>

          {/* Desktop Back Button */}
          <Link
            href="/"
            className="hidden lg:inline-flex items-center gap-2 text-gray-600 hover:text-[#FA3728] transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 theme-text-primary">Sign In</h2>
              <p className="theme-text-secondary">
                Welcome back! Please enter your credentials
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2 theme-text-primary">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="theme-input w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FA3728] outline-none transition-colors"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium theme-text-primary">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="theme-input w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FA3728] outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 theme-text-secondary hover:opacity-80 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      className="w-4 h-4 rounded theme-input cursor-pointer"
                      style={{ accentColor: 'var(--primary-red)' }}
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm theme-text-secondary cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm theme-red hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
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

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary" style={{ borderColor: 'var(--border-primary)' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 theme-text-secondary" style={{ backgroundColor: 'var(--bg-primary)' }}>
                  Don't have an account?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm theme-text-secondary mt-6">
              New to ShopAm?{' '}
              <Link href="/auth/signup" className="text-[#FA3728] hover:underline font-semibold">
                Create Vendor Account
              </Link>
            </p>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-primary text-center text-sm theme-text-secondary" style={{ borderColor: 'var(--border-primary)' }}>
              <p>
                Need help?{' '}
                <a href="#" className="theme-red hover:underline">Contact Support</a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}