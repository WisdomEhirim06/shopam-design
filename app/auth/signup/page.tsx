'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Building,
  User,
  Eye,
  EyeOff,
  CheckCircle,
  Mail,
  Lock,
  Phone,
} from 'lucide-react';
import { authService } from '@/lib/api';
import Image from 'next/image';

type Step = 'personal' | 'business' | 'success';
type BusinessCategory = 'retail' | 'wholesale' | 'service' | 'food' | 'fashion' | 'tech' | 'beauty' | 'other';

export default function VendorSignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [personalData, setPersonalData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    first_name: '',
    last_name: '',
  });

  const [businessData, setBusinessData] = useState({
    business_name: '',
    business_category: 'retail' as BusinessCategory,
    business_address: '',
    cac_registration: '',
    tin: '',
  });

  const businessCategories = [
    { value: 'retail', label: 'Retail' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'service', label: 'Service' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'fashion', label: 'Fashion & Apparel' },
    { value: 'tech', label: 'Technology & Electronics' },
    { value: 'beauty', label: 'Beauty & Cosmetics' },
    { value: 'other', label: 'Other' },
  ];

  // Handle form submission
  const handleSubmit = async () => {
    setError('');

    // Validation
    if (personalData.password !== personalData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (personalData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!personalData.phone) {
      setError('Phone number is required');
      return;
    }

    setIsSubmitting(true);

    // Normalise phone to international format (+234XXXXXXXXXX)
    let phone = personalData.phone.trim().replace(/\s+/g, '');
    if (phone.startsWith('0')) phone = '+234' + phone.slice(1);
    else if (phone.startsWith('234') && !phone.startsWith('+')) phone = '+' + phone;

    try {
      await authService.registerVendor({
        email: personalData.email,
        password: personalData.password,
        first_name: personalData.first_name,
        last_name: personalData.last_name,
        phone,
        business_name: businessData.business_name,
        business_category: businessData.business_category,
        business_address: businessData.business_address,
        cac_registration: businessData.cac_registration || undefined,
        tin: businessData.tin || undefined,
      });

      setIsSubmitting(false);
      router.push('/dashboard');
    } catch (err: any) {
      setIsSubmitting(false);

      // Vendor must verify email before login
      if (err.response?.data?.error === 'EMAIL_NOT_VERIFIED' || err.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        setCurrentStep('success');
        return;
      }

      if (err.response?.data) {
        const errors = err.response.data;
        const firstKey = Object.keys(errors)[0];
        const firstMsg = Array.isArray(errors[firstKey]) ? errors[firstKey][0] : errors[firstKey];
        setError(`${firstKey}: ${firstMsg}`);
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    }
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  const steps = [
    { key: 'personal', label: 'Personal Info', icon: User },
    { key: 'business', label: 'Business Details', icon: Building },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#8B0000]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-shopping.jpg" 
            alt="Vendors background" 
            fill 
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#800000] via-[#A50F15] to-[#800000] opacity-90 mix-blend-multiply"></div>
        </div>

        {/* Content - Aligned with Form */}
        <div className="relative z-10 flex flex-col justify-center items-start p-10 text-white w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md"
          >
            {/* Logo and Registration Text */}
            <div className="mb-8">
              <Image 
                src="/images/logo.png" 
                alt="ShopAm Logo" 
                width={110} 
                height={36} 
                className="object-contain brightness-0 invert" 
              />
              <p className="mt-3 text-xs font-semibold tracking-widest uppercase opacity-70">
                Vendor Registration
              </p>
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              Sell Smarter.<br />Serve Better.
            </h2>
            <p className="text-lg opacity-90 font-light leading-relaxed">
              Join thousands of successful vendors on<br />
              <span className="font-semibold">ShopAm</span> and grow your business today.
            </p>
          </motion.div>

          {/* Footer - Aligned Bottom */}
          <div className="absolute bottom-12 left-16 opacity-60">
            <p className="text-sm">© 2026 ShopAm. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="flex-1 w-full lg:w-1/2 overflow-y-auto bg-white">
        <div className="min-h-full w-full flex flex-col items-center justify-start lg:justify-center py-12 lg:py-20 px-6 sm:px-10 lg:px-12">
          <div className="w-full max-w-md mx-auto">
          {/* Mobile Header */}
          {currentStep === 'personal' && (
            <div className="lg:hidden mb-6 flex justify-center w-full relative">
              <Link href="/">
                <Image src="/images/black-logo.png" alt="ShopAm Logo" width={110} height={36} className="object-contain" />
              </Link>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Personal Info */}
            {currentStep === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Personal Information</h2>
                  <p className="text-sm text-gray-600">Create your vendor account</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Name Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        required
                        value={personalData.first_name}
                        onChange={(e) => setPersonalData({ ...personalData, first_name: e.target.value })}
                        className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={personalData.last_name}
                        onChange={(e) => setPersonalData({ ...personalData, last_name: e.target.value })}
                        className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={personalData.email}
                      onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                      className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={personalData.phone}
                      onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                      className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
                    />
                  </div>


                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={personalData.password}
                        onChange={(e) => setPersonalData({ ...personalData, password: e.target.value })}
                        className="w-full pl-4 pr-12 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={personalData.confirmPassword}
                        onChange={(e) => setPersonalData({ ...personalData, confirmPassword: e.target.value })}
                        className="w-full pl-4 pr-12 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!personalData.first_name || !personalData.last_name || !personalData.email || !personalData.phone || !personalData.password || !personalData.confirmPassword) {
                      setError('Please fill in all required fields');
                      return;
                    }
                    setError('');
                    setCurrentStep('business');
                  }}
                  className="w-full mt-6 py-3 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-lg font-semibold"
                >
                  Continue
                </button>

                <p className="text-center text-gray-600 text-sm mt-4">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-[#FA3728] hover:underline font-medium">
                    Sign In
                  </Link>
                </p>
              </motion.div>
            )}

            {/* Step 2: Business Details */}
            {currentStep === 'business' && (
              <motion.div
                key="business"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6 lg:mb-8 pt-4 lg:pt-0">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Business Details</h2>
                  <p className="text-gray-600">Tell us about your business</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                    <input
                      type="text"
                      required
                      value={businessData.business_name}
                      onChange={(e) => setBusinessData({ ...businessData, business_name: e.target.value })}
                      placeholder="e.g. Acme Stores"
                      className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
                    />
                  </div>

                  {/* Business Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Category *</label>
                    <select
                      value={businessData.business_category}
                      onChange={(e) => setBusinessData({ ...businessData, business_category: e.target.value as BusinessCategory })}
                      className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900 appearance-none bg-no-repeat bg-right"
                      style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E")', backgroundPosition: 'calc(100% - 1rem) center', backgroundSize: '1.2em 1.2em' }}
                    >
                      {businessCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Business Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Address *</label>
                    <input
                      type="text"
                      required
                      value={businessData.business_address}
                      onChange={(e) => setBusinessData({ ...businessData, business_address: e.target.value })}
                      placeholder="Full physical address"
                      className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
                    />
                  </div>

                  {/* CAC Registration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CAC <span className="text-gray-400 font-normal">(Opt)</span></label>
                      <input
                        type="text"
                        value={businessData.cac_registration}
                        onChange={(e) => setBusinessData({ ...businessData, cac_registration: e.target.value })}
                        className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">TIN <span className="text-gray-400 font-normal">(Opt)</span></label>
                      <input
                        type="text"
                        value={businessData.tin}
                        onChange={(e) => setBusinessData({ ...businessData, tin: e.target.value })}
                        className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pb-8">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-[#FA3728] to-[#E31B23] hover:shadow-lg transform hover:-translate-y-0.5 text-white rounded-xl font-bold transition-all disabled:opacity-50 text-lg"
                  >
                    {isSubmitting ? 'Creating Store...' : 'Launch My Store'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Success Screen */}
            {currentStep === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mb-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                  <p className="text-gray-600">Your vendor account is created. Click the verification link in your email to activate it, then sign in.</p>
                </div>

                <button
                  onClick={goToDashboard}
                  className="w-full py-3 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-lg font-semibold"
                >
                  Go to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}