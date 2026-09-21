'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { authService } from '@/lib/api';
import Image from 'next/image';
import PersonalInfoStep from './PersonalInfoStep';
import BusinessStep from './BusinessStep';
import { normalizeNigerianPhone } from './phone';
import type { PersonalData, BusinessData, BusinessCategory } from './data';

type Step = 'personal' | 'business' | 'success';

export default function VendorSignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [personalData, setPersonalData] = useState<PersonalData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    first_name: '',
    middle_name: '',
    last_name: '',
  });

  const [businessData, setBusinessData] = useState<BusinessData>({
    business_name: '',
    business_category: 'fashion',
    business_address: '',
    cac_registration: '',
    tin: '',
    logo: null,
    logoPreview: '',
  });

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

    const phone = normalizeNigerianPhone(personalData.phone);

    try {
      await authService.registerVendor({
        email: personalData.email,
        password: personalData.password,
        first_name: personalData.first_name,
        middle_name: personalData.middle_name || undefined,
        last_name: personalData.last_name,
        phone,
        phone_country_code: '234',
        business_name: businessData.business_name,
        business_category: businessData.business_category,
        business_address: businessData.business_address,
        cac_registration: businessData.cac_registration || undefined,
        tin: businessData.tin || undefined,
        logo: businessData.logo || undefined,
      });

      setIsSubmitting(false);
      router.push(`/auth/user-verify?email=${encodeURIComponent(personalData.email)}`);
    } catch (err: any) {
      setIsSubmitting(false);
      console.error('Vendor registration error:', err.response?.status, err.response?.data);

      const data = err.response?.data;
      if (!data) {
        setError(err.message || 'Registration failed. Please try again.');
      } else if (typeof data === 'string') {
        setError('Server error. Please try again later.');
      } else if (data.detail) {
        setError(data.detail);
      } else if (data.message) {
        setError(data.message);
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        const firstKey = Object.keys(data)[0];
        const firstMsg = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
        setError(`${firstKey}: ${firstMsg}`);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

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
                <PersonalInfoStep
                  personalData={personalData}
                  onChange={setPersonalData}
                  error={error}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  showConfirmPassword={showConfirmPassword}
                  onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  onContinue={() => {
                    if (!personalData.first_name || !personalData.last_name || !personalData.email || !personalData.phone || !personalData.password || !personalData.confirmPassword) {
                      setError('Please fill in all required fields');
                      return;
                    }
                    setError('');
                    setCurrentStep('business');
                  }}
                />
              )}

              {/* Step 2: Business Details */}
              {currentStep === 'business' && (
                <BusinessStep
                  businessData={businessData}
                  onChange={setBusinessData}
                  error={error}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                />
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
