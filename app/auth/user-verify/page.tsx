'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, ShoppingBag } from 'lucide-react';

export default function UserVerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Timer for resend code
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return; // Only numbers

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split('');
    setCode([...newCode, ...Array(6 - newCode.length).fill('')]);
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(newCode.length, 5);
    inputRefs[nextIndex].current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Success - redirect to explore or home
    setIsSubmitting(false);
    router.push('/explore');
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setResendTimer(60);
    // Call API to resend code
    console.log('Resending verification code...');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Red Brand Section */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#FA3728] to-[#E31B23] relative overflow-hidden flex items-center justify-center p-8">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <ShoppingBag className="text-[#FA3728]" size={32} />
            </div>
            <span className="text-4xl font-bold">ShopAm</span>
          </Link>

          {/* Illustration */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-48 h-48 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Mail size={80} className="text-white" />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-4">Check Your Email</h2>
            <p className="text-lg opacity-90">
              We've sent a verification code to your email address. Enter it below to complete your registration.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Verification Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/auth/user-signin"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FA3728] transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Sign In</span>
          </Link>

          {/* Form Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Verify Code
            </h2>
            <p className="text-gray-600">
              We have sent a verification code to your email
            </p>
            <p className="text-sm text-gray-500 mt-2">
              <strong className="text-gray-900">example@email.com</strong>
            </p>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter 6-Digit Code
              </label>
              <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-[#FA3728] outline-none transition-all text-gray-900"
                  />
                ))}
              </div>
            </div>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              {resendTimer > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend code in <span className="font-semibold text-[#FA3728]">{resendTimer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-[#FA3728] hover:underline font-semibold"
                >
                  Resend Code
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || code.join('').length !== 6}
              className="w-full py-3.5 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? 'Verifying...' : 'Verify'}
            </button>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Having trouble?{' '}
                <Link href="/help" className="text-[#FA3728] hover:underline font-medium">
                  Contact Support
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
