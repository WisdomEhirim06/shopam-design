'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { authService } from '@/lib/api';
import AuthShell from '../../components/auth/AuthShell';
import PersonalInfoStep from './PersonalInfoStep';
import BusinessStep from './BusinessStep';
import { normalizeNigerianPhone } from './phone';
import type { PersonalData, BusinessData } from './data';

type Step = 'personal' | 'business' | 'success';

export default function VendorSignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async () => {
    setError('');

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

  const title =
    currentStep === 'business'
      ? 'Business details'
      : currentStep === 'success'
      ? 'Check your email'
      : 'Create your vendor account';

  const subtitle =
    currentStep === 'business'
      ? 'Tell us about your business'
      : currentStep === 'success'
      ? undefined
      : 'Step 1 of 2 · Your personal information';

  return (
    <AuthShell
      title={title}
      subtitle={subtitle}
      footer={
        currentStep === 'personal' ? (
          <>
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-semibold text-[#FA3728] hover:underline">
              Sign In
            </Link>
          </>
        ) : undefined
      }
    >
      <AnimatePresence mode="wait">
        {currentStep === 'personal' && (
          <PersonalInfoStep
            personalData={personalData}
            onChange={setPersonalData}
            error={error}
            onContinue={() => {
              if (
                !personalData.first_name ||
                !personalData.last_name ||
                !personalData.email ||
                !personalData.phone ||
                !personalData.password ||
                !personalData.confirmPassword
              ) {
                setError('Please fill in all required fields');
                return;
              }
              setError('');
              setCurrentStep('business');
            }}
          />
        )}

        {currentStep === 'business' && (
          <BusinessStep
            businessData={businessData}
            onChange={setBusinessData}
            error={error}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onBack={() => {
              setError('');
              setCurrentStep('personal');
            }}
          />
        )}

        {currentStep === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500">
              <CheckCircle2 size={40} />
            </div>
            <p className="text-sm text-slate-500">
              Your vendor account is created. Click the verification link in your email to activate it, then sign in.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#FA3728] text-sm font-semibold text-white transition-all hover:bg-[#E31B23]"
            >
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
