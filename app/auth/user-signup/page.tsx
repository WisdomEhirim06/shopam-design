'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, ShoppingBag, Shield, Zap } from 'lucide-react';
import { authService } from '@/lib/api';
import { Suspense } from 'react';

function UserSignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('redirect') || '/explore';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to terms and conditions');
      return;
    }

    if (!formData.phone) {
      setError('Phone number is required');
      return;
    }

    if (!formData.username) {
      setError('Username is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Real API call
      const response = await authService.registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        first_name: formData.first_name || undefined,
        last_name: formData.last_name || undefined,
      });

      console.log('Registration successful:', response.user);

      // Redirect to explore page or returnUrl (user is automatically logged in)
      router.push(returnUrl);
    } catch (err: any) {
      console.error('Registration error:', err);

      // --- OFFLINE PROTOTYPE BYPASS ---
      if (err.message === 'Failed to fetch' || err.message === 'Network Error' || String(err.message).toLowerCase().includes('timeout')) {
        console.warn('Backend unavailable. Mocking buyer registration for testing.');
        localStorage.setItem('access_token', 'mock_buyer_token');
        localStorage.setItem('user', JSON.stringify({ id: 'b1', is_vendor: false, is_customer: true, username: formData.username }));
        router.push(returnUrl);
        return;
      }

      // Handle different error types
      if (err.response?.data?.username) {
        setError(`Username: ${err.response.data.username[0]}`);
      } else if (err.response?.data?.email) {
        setError(`Email: ${err.response.data.email[0]}`);
      } else if (err.response?.data?.phone) {
        setError(`Phone: ${err.response.data.phone[0]}`);
      } else if (err.response?.data?.password) {
        setError(`Password: ${err.response.data.password[0]}`);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* Left Side - Red Brand Section */}
      <div className="hidden lg:flex flex-col lg:w-1/2 bg-[#8B0000] relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-1.png" 
            alt="Shopper background" 
            fill 
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000]/90 via-[#A50F15]/85 to-[#8B0000]/95 mix-blend-multiply"></div>
        </div>

        {/* Content - Aligned to top to match form */}
        <div className="relative z-10 flex flex-col justify-start h-full p-8 lg:p-16 pt-24 lg:pt-32 text-white">
          {/* Logo */}
          <Link href="/" className="mb-8">
            <Image src="/images/logo.png" alt="ShopAm Logo" width={110} height={36} className="object-contain brightness-0 invert" />
          </Link>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight">
              Welcome to ShopAm
            </h1>
            <p className="text-base opacity-85 max-w-sm font-light leading-relaxed">
              Discover amazing local vendors and products in your community with ease and security.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Sign Up Form Container */}
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
          <div className="mb-6 mt-4 lg:mt-0">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
              Create Account
            </h2>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Choose a username"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] outline-none transition-all text-gray-900"
                />
              </div>
            </div>

            {/* First Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name (Optional)
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Enter your first name"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] outline-none transition-all text-gray-900"
                />
              </div>
            </div>

            {/* Last Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name (Optional)
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Enter your last name"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] outline-none transition-all text-gray-900"
                />
              </div>
            </div>

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

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 800 000 0000"
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
                  placeholder="Create a password"
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

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] outline-none transition-all text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="mt-1 w-4 h-4 text-[#FA3728] border-2 border-gray-300 rounded focus:ring-[#FA3728]"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-[#FA3728] hover:underline font-medium">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#FA3728] hover:underline font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>



            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/user-signin" className="text-[#FA3728] hover:underline font-semibold">
                Sign In
              </Link>
            </p>

            {/* Vendor Link */}
            <p className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
              Want to sell on ShopAm?{' '}
              <Link href="/auth/signup" className="text-[#FA3728] hover:underline font-medium">
                Become a vendor
              </Link>
            </p>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserSignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserSignUpForm />
    </Suspense>
  );
}