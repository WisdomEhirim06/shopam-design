'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { BUSINESS_CATEGORIES, type BusinessData } from './data';

export default function BusinessStep({
  businessData,
  onChange,
  error,
  isSubmitting,
  onSubmit,
}: {
  businessData: BusinessData;
  onChange: (d: BusinessData) => void;
  error: string;
  isSubmitting: boolean;
  onSubmit: () => void;
}) {
  const logoInputRef = useRef<HTMLInputElement>(null);

  return (
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
            onChange={(e) => onChange({ ...businessData, business_name: e.target.value })}
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
                onChange({
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
                  onClick={() => onChange({ ...businessData, logo: null, logoPreview: '' })}
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
            onChange={(e) => onChange({ ...businessData, business_category: e.target.value as any })}
            className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900 appearance-none bg-no-repeat bg-right"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E")', backgroundPosition: 'calc(100% - 1rem) center', backgroundSize: '1.2em 1.2em' }}
          >
            {BUSINESS_CATEGORIES.map((cat) => (
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
            onChange={(e) => onChange({ ...businessData, business_address: e.target.value })}
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
              onChange={(e) => onChange({ ...businessData, cac_registration: e.target.value })}
              className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">TIN <span className="text-gray-400 font-normal">(Opt)</span></label>
            <input
              type="text"
              value={businessData.tin}
              onChange={(e) => onChange({ ...businessData, tin: e.target.value })}
              className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 pb-8">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-[#FA3728] to-[#E31B23] hover:shadow-lg transform hover:-translate-y-0.5 text-white rounded-xl font-bold transition-all disabled:opacity-50 text-lg"
        >
          {isSubmitting ? 'Creating Store...' : 'Launch My Store'}
        </button>
      </div>
    </motion.div>
  );
}
