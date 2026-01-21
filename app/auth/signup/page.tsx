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
      setCurrentStep('success');
    } catch (err: any) {
      console.error('Registration error:', err);
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
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <span className="font-bold text-2xl text-[#FA3728]">SA</span>
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
                      className={`flex items-center gap-4 ${
                        isActive ? 'opacity-100' : isCompleted ? 'opacity-75' : 'opacity-40'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isActive ? 'bg-white text-[#FA3728]' : 'bg-white/10'
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 overflow-y-auto bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FA3728] mb-4">
              <ArrowLeft size={20} />
              <span>Back</span>
            </Link>
          </div>

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
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        required
                        value={personalData.username}
                        onChange={(e) => setPersonalData({ ...personalData, username: e.target.value })}
                        placeholder="Choose a username"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        required
                        value={personalData.email}
                        onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        required
                        value={personalData.phone}
                        onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                        placeholder="+234 800 000 0000"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name (Optional)</label>
                    <input
                      type="text"
                      value={personalData.first_name}
                      onChange={(e) => setPersonalData({ ...personalData, first_name: e.target.value })}
                      placeholder="First name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name (Optional)</label>
                    <input
                      type="text"
                      value={personalData.last_name}
                      onChange={(e) => setPersonalData({ ...personalData, last_name: e.target.value })}
                      placeholder="Last name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={personalData.password}
                        onChange={(e) => setPersonalData({ ...personalData, password: e.target.value })}
                        placeholder="Create a password (min 8 characters)"
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={personalData.confirmPassword}
                        onChange={(e) => setPersonalData({ ...personalData, confirmPassword: e.target.value })}
                        placeholder="Confirm your password"
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
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
                  className="w-full mt-6 py-3 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight size={20} />
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
                <div className="mb-8">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-transparent outline-none"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">CAC Registration Number (Optional)</label>
                    <input
                      type="text"
                      value={businessData.cac_registration}
                      onChange={(e) => setBusinessData({ ...businessData, cac_registration: e.target.value })}
                      placeholder="Enter CAC number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* TIN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">TIN Number (Optional)</label>
                    <input
                      type="text"
                      value={businessData.tin}
                      onChange={(e) => setBusinessData({ ...businessData, tin: e.target.value })}
                      placeholder="Enter TIN"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA3728] focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      CAC and TIN are optional but help build trust with customers
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setCurrentStep('personal')}
                    className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-lg font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
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