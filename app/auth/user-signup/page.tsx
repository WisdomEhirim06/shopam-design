'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, ShoppingBag, Shield, Zap } from 'lucide-react';

export default function UserSignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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

    if (!formData.agreeToTerms) {
      setError('Please agree to terms and conditions');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Redirect to verification
    setIsSubmitting(false);
    router.push('/auth/user-verify');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Red Brand Section */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#FA3728] to-[#E31B23] relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 border-4 border-white/20 rotate-45"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 border-4 border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 transform -translate-y-1/2"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full p-8 lg:p-16 text-white">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <ShoppingBag className="text-[#FA3728]" size={24} />
            </div>
            <span className="text-3xl font-bold">ShopAm</span>
          </Link>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Welcome to<br />Your Safest way<br />To Shop Online
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-md">
              Join thousands of shoppers and discover amazing local products today.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 max-w-md"
          >
            {[
              { icon: Shield, text: 'Safe and secure shopping experience' },
              { icon: ShoppingBag, text: 'Access to verified local vendors' },
              { icon: Zap, text: 'Fast and easy checkout process' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon size={18} />
                </div>
                <span className="text-sm lg:text-base">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FA3728] transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">Join ShopAm community today</p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-transparent outline-none transition-all text-gray-900"
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
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-transparent outline-none transition-all text-gray-900"
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
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-transparent outline-none transition-all text-gray-900"
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
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-transparent outline-none transition-all text-gray-900"
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
                className="mt-1 w-4 h-4 text-[#FA3728] border-gray-300 rounded focus:ring-[#FA3728]"
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

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or sign up with</span>
              </div>
            </div>

            {/* Social Sign Up */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-[#FA3728] transition-all font-medium text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-[#FA3728] transition-all font-medium text-gray-700"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-gray-600">
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
  );
}