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
  Shield,
  Upload,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

type Step = 'business' | 'personal' | 'cac' | 'success';

export default function VendorSignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('business');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [businessData, setBusinessData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
  });

  const [personalData, setPersonalData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [cacData, setCacData] = useState({
    cacNumber: '',
    tinNumber: '',
    certificateFile: null as File | null,
  });

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCacData({ ...cacData, certificateFile: file });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setCurrentStep('success');
  };

  // Redirect to dashboard
  const goToDashboard = () => {
    router.push('/dashboard');
  };

  // Step progress
  const steps = [
    { key: 'business', label: 'Business Profile', icon: Building },
    { key: 'personal', label: 'Personal Info', icon: User },
    { key: 'cac', label: 'CAC Registration', icon: Shield },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: 'var(--primary-red)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Link href="/auth" className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <span className="font-bold text-2xl" style={{ color: 'var(--primary-red)' }}>SA</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">ShopAm</h1>
                <p className="text-sm opacity-90">Vendor Dashboard</p>
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
                          isActive ? 'bg-white text-crimson' : 'bg-white/10'
                        }`}
                      >
                        {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                      </div>
                      <div>
                        <p className={`font-semibold ${isActive ? 'text-lg' : ''}`}>
                          {step.label}
                        </p>
                        <p className="text-sm opacity-75">Step {index + 1} of 3</p>
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

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 overflow-y-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-6">
            <Link href="/auth" className="inline-flex items-center gap-2 theme-text-secondary mb-4">
              <ArrowLeft size={20} />
              <span>Back</span>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Business Profile */}
            {currentStep === 'business' && (
              <motion.div
                key="business"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 theme-text-primary">Business Profile</h2>
                  <p className="theme-text-secondary">Tell us about your business</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 theme-text-primary">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={businessData.name}
                      onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                      placeholder="e.g., Sarah's African Crafts"
                      className="theme-input w-full px-4 py-3 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 theme-text-primary">
                      Business Description *
                    </label>
                    <textarea
                      value={businessData.description}
                      onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                      placeholder="Describe what you sell..."
                      rows={4}
                      className="theme-input w-full px-4 py-3 rounded-lg resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 theme-text-primary">
                      Business Address *
                    </label>
                    <input
                      type="text"
                      value={businessData.address}
                      onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                      placeholder="123 Victoria Island, Lagos, Nigeria"
                      className="theme-input w-full px-4 py-3 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 theme-text-primary">
                      Business Phone *
                    </label>
                    <input
                      type="tel"
                      value={businessData.phone}
                      onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                      placeholder="+234 801 234 5678"
                      className="theme-input w-full px-4 py-3 rounded-lg"
                      required
                    />
                  </div>

                  <button
                    onClick={() => setCurrentStep('personal')}
                    disabled={!businessData.name || !businessData.description || !businessData.address || !businessData.phone}
                    className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{ backgroundColor: 'var(--primary-red)' }}
                  >
                    Continue
                    <ArrowRight size={20} />
                  </button>

                  <p className="text-center text-sm theme-text-secondary mt-4">
                    Already a vendor?{' '}
                    <Link href="/auth/signin" className="theme-red hover:underline font-medium">
                      Sign In
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => setCurrentStep('business')}
                  className="flex items-center gap-2 theme-text-secondary mb-6 hover:opacity-80"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 theme-text-primary">Personal Information</h2>
                  <p className="theme-text-secondary">Create your account</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 theme-text-primary">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={personalData.fullName}
                      onChange={(e) => setPersonalData({ ...personalData, fullName: e.target.value })}
                      placeholder="Sarah Adelewo"
                      className="theme-input w-full px-4 py-3 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 theme-text-primary">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={personalData.email}
                      onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                      placeholder="sarah@email.com"
                      className="theme-input w-full px-4 py-3 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 theme-text-primary">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={personalData.password}
                        onChange={(e) => setPersonalData({ ...personalData, password: e.target.value })}
                        placeholder="Create a strong password"
                        className="theme-input w-full px-4 py-3 rounded-lg pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 theme-text-secondary hover:opacity-80"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <p className="text-xs theme-text-secondary mt-2">
                      At least 8 characters with numbers and symbols
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentStep('cac')}
                    disabled={!personalData.fullName || !personalData.email || !personalData.password}
                    className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{ backgroundColor: 'var(--primary-red)' }}
                  >
                    Continue
                    <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: CAC Registration */}
            {currentStep === 'cac' && (
              <motion.div
                key="cac"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => setCurrentStep('personal')}
                  className="flex items-center gap-2 theme-text-secondary mb-6 hover:opacity-80"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 theme-text-primary">CAC Registration</h2>
                  <p className="theme-text-secondary">Verify your business (Optional - can complete later)</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 theme-text-primary">
                      CAC Registration Number
                    </label>
                    <input
                      type="text"
                      value={cacData.cacNumber}
                      onChange={(e) => setCacData({ ...cacData, cacNumber: e.target.value })}
                      placeholder="Enter your CAC number"
                      className="theme-input w-full px-4 py-3 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 theme-text-primary">
                      Tax Identification Number (TIN)
                    </label>
                    <input
                      type="text"
                      value={cacData.tinNumber}
                      onChange={(e) => setCacData({ ...cacData, tinNumber: e.target.value })}
                      placeholder="Enter your TIN"
                      className="theme-input w-full px-4 py-3 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 theme-text-primary">
                      CAC Certificate Upload
                    </label>
                    <div className="theme-card border-2 border-dashed rounded-xl p-8 text-center hover:border-primary transition-all cursor-pointer"
                      style={{ borderColor: 'var(--border-primary)' }}
                      onClick={() => document.getElementById('cac-file-input')?.click()}
                    >
                      <input
                        id="cac-file-input"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Upload size={32} className="mx-auto mb-3 theme-text-secondary" />
                      {cacData.certificateFile ? (
                        <div className="theme-text-primary">
                          <CheckCircle size={20} className="inline theme-red mr-2" />
                          {cacData.certificateFile.name}
                        </div>
                      ) : (
                        <>
                          <p className="theme-text-primary mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm theme-text-secondary">
                            PDF, JPG, or PNG (Max 5MB)
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--primary-red-light)' }}>
                    <p className="text-sm theme-text-secondary">
                      <strong className="theme-red">Note:</strong> CAC verification is optional during sign-up. You can complete this later in your dashboard settings to unlock premium features.
                    </p>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{ backgroundColor: 'var(--primary-red)' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Complete Sign Up
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-lg font-medium theme-text-secondary hover:opacity-80 transition-all"
                  >
                    Skip for now
                  </button>
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {currentStep === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--primary-red-light)' }}>
                  <CheckCircle size={48} style={{ color: 'var(--primary-red)' }} />
                </div>

                <h2 className="text-3xl font-bold mb-3 theme-text-primary">
                  Welcome to ShopAm! 🎉
                </h2>
                <p className="theme-text-secondary mb-8 text-lg">
                  Your vendor account has been created successfully.<br />
                  Let's get you started!
                </p>

                <div className="space-y-4 mb-8">
                  <div className="theme-card p-4 rounded-xl text-left">
                    <h3 className="font-semibold mb-2 theme-text-primary">What's Next?</h3>
                    <ul className="space-y-2 text-sm theme-text-secondary">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="theme-red mt-0.5 flex-shrink-0" />
                        <span>Set up your store and payment details</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="theme-red mt-0.5 flex-shrink-0" />
                        <span>Add your first products</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="theme-red mt-0.5 flex-shrink-0" />
                        <span>Start receiving orders</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={goToDashboard}
                  className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
                  style={{ backgroundColor: 'var(--primary-red)', boxShadow: 'var(--primary-red-glow)' }}
                >
                  Go to Dashboard
                  <ArrowRight size={20} />
                </button>

                <p className="text-sm theme-text-secondary mt-6">
                  A verification email has been sent to <strong>{personalData.email}</strong>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}