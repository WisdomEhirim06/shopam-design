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

type Step = 'personal' | 'business' | 'success';
type BusinessCategory = 'retail' | 'wholesale' | 'service' | 'food' | 'fashion' | 'tech' | 'beauty' | 'electronics' | 'other';

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
    business_category: 'retail' as BusinessCategory,
    cac_registration: '',
    tin: '',
  });

  const businessCategories = [
    { value: 'retail', label: 'Retail' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'service', label: 'Service' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'fashion', label: 'Fashion & Apparel' },
    { value: 'tech', label: 'Technology' },
    { value: 'beauty', label: 'Beauty & Cosmetics' },
    { value: 'electronics', label: 'Electronics' },
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

    try {
      // Step 1: Register user account first
      const userResponse = await authService.registerUser({
        username: personalData.username,
        email: personalData.email,
        password: personalData.password,
        phone: personalData.phone,
        first_name: personalData.first_name || undefined,
        last_name: personalData.last_name || undefined,
      });

      console.log('User created:', userResponse.user);

      // Step 2: Register as vendor
      const vendorPayload = {
        user: userResponse.user.id,
        business_category: businessData.business_category,
        cac_registration: businessData.cac_registration || undefined,
        tin: businessData.tin || undefined,
        password: personalData.password,
      };

      const vendorResponse = await fetch('https://shopam.onrender.com/api/accounts/vendor/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userResponse.access}`,
        },
        body: JSON.stringify(vendorPayload),
      });

      if (!vendorResponse.ok) {
        const errorData = await vendorResponse.json();
        throw new Error(errorData.message || 'Vendor registration failed');
      }

      setIsSubmitting(false);
      
      // Auto-login and redirect instead of going to 'success' step
      // Mock saving tokens and logging in
      localStorage.setItem('access_token', userResponse.access || 'mock_vendor_token');
      localStorage.setItem('user', JSON.stringify({ ...userResponse.user, is_vendor: true }));
      
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // --- OFFLINE PROTOTYPE BYPASS ---
      if (err.message === 'Failed to fetch' || err.message === 'Network Error' || String(err.message).toLowerCase().includes('timeout')) {
        console.warn('Backend unavailable. Mocking vendor registration for testing.');
        localStorage.setItem('access_token', 'mock_vendor_token');
        localStorage.setItem('user', JSON.stringify({ id: 'v1', is_vendor: true, username: personalData.username }));
        setIsSubmitting(false);
        router.push('/dashboard');
        return;
      }

      setIsSubmitting(false);

      if (err.response?.data?.username) {
        setError(`Username: ${err.response.data.username[0]}`);
      } else if (err.response?.data?.email) {
        setError(`Email: ${err.response.data.email[0]}`);
      } else if (err.response?.data?.phone) {
        setError(`Phone: ${err.response.data.phone[0]}`);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
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
    <div className="min-h-screen flex">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#FA3728] to-[#E31B23] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center">
                <img src="/images/shopam-logo.png" width={100} height={100}></img>
              </div>
              <div>
                <h1 className="text-2xl font-bold">ShopAm</h1>
                <p className="text-sm opacity-90">Vendor Registration</p>
              </div>
            </Link>
          </div>

          <div className="space-y-8">
            <h2 className="text-5xl font-bold leading-tight">
              Sell Smarter.<br />
              Serve Better.
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of successful vendors on ShopAm
            </p>

            {/* Progress Steps */}
            {currentStep !== 'success' && (
              <div className="space-y-4 pt-8">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = step.key === currentStep;
                  const isCompleted = index < currentStepIndex;

                  return (
                    <div
                      key={step.key}
                      className={`flex items-center gap-4 ${isActive ? 'opacity-100' : isCompleted ? 'opacity-75' : 'opacity-40'
                        }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-white text-[#FA3728]' : 'bg-white/10'
                          }`}
                      >
                        {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                      </div>
                      <div>
                        <p className={`font-semibold ${isActive ? 'text-lg' : ''}`}>
                          {step.label}
                        </p>
                        <p className="text-sm opacity-75">Step {index + 1} of 2</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <p className="text-sm opacity-75">© 2026 ShopAm. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto bg-white">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Header */}
          {currentStep === 'personal' && (
            <div className="lg:hidden mb-12 flex justify-center w-full relative">
              <Link href="/">
                <img src="/images/black-logo.png" alt="ShopAm Logo" width="120" height="40" className="object-contain" />
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
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h2>
                  <p className="text-gray-600">Create your vendor account</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                    <input
                      type="text"
                      required
                      value={personalData.username}
                      onChange={(e) => setPersonalData({ ...personalData, username: e.target.value })}
                      className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
                    />
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
                    if (!personalData.username || !personalData.email || !personalData.phone || !personalData.password || !personalData.confirmPassword) {
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
                  {/* Business Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Category *</label>
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

                  {/* CAC Registration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CAC Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <input
                      type="text"
                      value={businessData.cac_registration}
                      onChange={(e) => setBusinessData({ ...businessData, cac_registration: e.target.value })}
                      className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
                    />
                  </div>

                  {/* TIN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">TIN <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <input
                      type="text"
                      value={businessData.tin}
                      onChange={(e) => setBusinessData({ ...businessData, tin: e.target.value })}
                      className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      CAC and TIN are optional but help build trust with customers
                    </p>
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ShopAm!</h2>
                  <p className="text-gray-600">Your vendor account has been created successfully</p>
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
  );
}