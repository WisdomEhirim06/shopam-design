'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Camera, CheckCircle, Store } from 'lucide-react';
import { authService } from '@/lib/api';

type BusinessCategory =
  | 'fashion'
  | 'food_drinks'
  | 'beauty_hair'
  | 'home_living'
  | 'baby_kids'
  | 'books_stationery'
  | 'health_wellness';

export default function BecomeVendorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [businessData, setBusinessData] = useState({
    business_name: '',
    business_category: 'fashion' as BusinessCategory,
    business_address: '',
    cac_registration: '',
    tin: '',
    logo: null as File | null,
    logoPreview: '',
  });

  // Values must match BusinessCategoryEnum in the API spec exactly
  const businessCategories = [
    { value: 'fashion', label: 'Fashion' },
    { value: 'food_drinks', label: 'Food & Drinks' },
    { value: 'beauty_hair', label: 'Beauty, Hair & Personal Care' },
    { value: 'home_living', label: 'Home & Living' },
    { value: 'baby_kids', label: 'Baby & Kids' },
    { value: 'books_stationery', label: 'Books & Stationery' },
    { value: 'health_wellness', label: 'Health & Wellness' },
  ];

  const handleSubmit = async () => {
    setError('');

    if (!businessData.business_name || !businessData.business_address) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.upgradeToVendor({
        business_name: businessData.business_name,
        business_category: businessData.business_category,
        business_address: businessData.business_address,
        cac_registration: businessData.cac_registration || undefined,
        tin: businessData.tin || undefined,
        logo: businessData.logo || undefined,
      });

      setIsSubmitting(false);
      setIsDone(true);
    } catch (err: any) {
      setIsSubmitting(false);
      console.error('Vendor upgrade error:', err.response?.status, err.response?.data);

      const data = err.response?.data;
      if (!data) {
        setError(err.message || 'Something went wrong. Please try again.');
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
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const goToVendorDashboard = () => {
    router.push('/vendors/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {!isDone ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-[#FA3728]/10 rounded-xl flex items-center justify-center mb-4">
                  <Store size={24} className="text-[#FA3728]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Become a Vendor</h2>
                <p className="text-sm text-gray-600">
                  Tell us about your business and start selling on ShopAm.
                </p>
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

                {/* Business Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Logo <span className="text-gray-400 font-normal">(Opt)</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#FA3728] flex flex-col items-center justify-center gap-1 transition-colors overflow-hidden relative flex-shrink-0"
                    >
                      {businessData.logoPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={businessData.logoPreview}
                          alt="Logo preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <Camera size={20} className="text-gray-400" />
                          <span className="text-[10px] text-gray-400 font-medium text-center leading-tight">
                            Upload
                          </span>
                        </>
                      )}
                    </button>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setBusinessData({
                          ...businessData,
                          logo: file,
                          logoPreview: URL.createObjectURL(file),
                        });
                      }}
                    />
                    <div>
                      <p className="text-sm text-gray-600">Upload your business logo</p>
                      <p className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 5 MB</p>
                      {businessData.logoPreview && (
                        <button
                          type="button"
                          onClick={() => setBusinessData({ ...businessData, logo: null, logoPreview: '' })}
                          className="text-xs text-red-500 hover:underline mt-1"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Business Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Category *</label>
                  <select
                    value={businessData.business_category}
                    onChange={(e) =>
                      setBusinessData({ ...businessData, business_category: e.target.value as BusinessCategory })
                    }
                    className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900 appearance-none bg-no-repeat bg-right"
                    style={{
                      backgroundImage:
                        'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E")',
                      backgroundPosition: 'calc(100% - 1rem) center',
                      backgroundSize: '1.2em 1.2em',
                    }}
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

                {/* CAC / TIN */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CAC <span className="text-gray-400 font-normal">(Opt)</span>
                    </label>
                    <input
                      type="text"
                      value={businessData.cac_registration}
                      onChange={(e) => setBusinessData({ ...businessData, cac_registration: e.target.value })}
                      className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TIN <span className="text-gray-400 font-normal">(Opt)</span>
                    </label>
                    <input
                      type="text"
                      value={businessData.tin}
                      onChange={(e) => setBusinessData({ ...businessData, tin: e.target.value })}
                      className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-8 py-4 bg-gradient-to-r from-[#FA3728] to-[#E31B23] hover:shadow-lg transform hover:-translate-y-0.5 text-white rounded-xl font-bold transition-all disabled:opacity-50 text-lg"
              >
                {isSubmitting ? 'Setting Up Your Store...' : 'Launch My Store'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You're a Vendor Now!</h2>
              <p className="text-gray-600 mb-8">
                Your store is ready. Head to your vendor dashboard to add products and start selling.
              </p>
              <button
                onClick={goToVendorDashboard}
                className="w-full py-3 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-lg font-semibold transition-colors"
              >
                Go to Vendor Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}