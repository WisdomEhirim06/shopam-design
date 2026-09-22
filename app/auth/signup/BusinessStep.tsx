'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';
import FloatingInput from '../../components/auth/FloatingInput';
import FloatingSelect from '../../components/auth/FloatingSelect';
import { BUSINESS_CATEGORIES, type BusinessData } from './data';

export default function BusinessStep({
  businessData,
  onChange,
  error,
  isSubmitting,
  onSubmit,
  onBack,
}: {
  businessData: BusinessData;
  onChange: (d: BusinessData) => void;
  error: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const logoInputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      key="business"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Logo */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Business logo <span className="font-normal normal-case text-slate-400">(optional)</span>
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 transition-colors hover:border-[#FA3728]"
            >
              {businessData.logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={businessData.logoPreview} alt="Logo preview" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <Camera size={20} className="text-slate-400" />
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
                onChange({ ...businessData, logo: file, logoPreview: URL.createObjectURL(file) });
              }}
            />
            <div className="text-sm text-slate-500">
              <p>PNG or JPG, up to 5 MB</p>
              {businessData.logoPreview && (
                <button
                  type="button"
                  onClick={() => onChange({ ...businessData, logo: null, logoPreview: '' })}
                  className="mt-1 text-xs font-medium text-red-500 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <FloatingInput
          id="business_name"
          label="Business name"
          value={businessData.business_name}
          onChange={(v) => onChange({ ...businessData, business_name: v })}
          autoComplete="organization"
        />

        <FloatingSelect
          id="business_category"
          label="Store category"
          value={businessData.business_category}
          onChange={(v) => onChange({ ...businessData, business_category: v as BusinessData['business_category'] })}
          options={BUSINESS_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
        />

        <FloatingInput
          id="business_address"
          label="Business address"
          value={businessData.business_address}
          onChange={(v) => onChange({ ...businessData, business_address: v })}
          autoComplete="street-address"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FloatingInput
            id="cac_registration"
            label="CAC (optional)"
            value={businessData.cac_registration}
            onChange={(v) => onChange({ ...businessData, cac_registration: v })}
          />
          <FloatingInput
            id="tin"
            label="TIN (optional)"
            value={businessData.tin}
            onChange={(v) => onChange({ ...businessData, tin: v })}
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#FA3728] text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#E31B23] active:scale-[0.99] disabled:opacity-80"
        >
          {isSubmitting ? (
            <><Loader2 size={18} className="animate-spin" /> Creating store…</>
          ) : (
            'Launch my store'
          )}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium text-slate-500 transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    </motion.div>
  );
}
