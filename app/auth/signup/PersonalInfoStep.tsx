'use client';

import { motion } from 'framer-motion';
import FloatingInput from '../../components/auth/FloatingInput';
import type { PersonalData } from './data';

export default function PersonalInfoStep({
  personalData,
  onChange,
  error,
  onContinue,
}: {
  personalData: PersonalData;
  onChange: (d: PersonalData) => void;
  error: string;
  onContinue: () => void;
}) {
  return (
    <motion.div
      key="personal"
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FloatingInput
            id="first_name"
            label="First name"
            value={personalData.first_name}
            onChange={(v) => onChange({ ...personalData, first_name: v })}
            autoComplete="given-name"
          />
          <FloatingInput
            id="last_name"
            label="Last name"
            value={personalData.last_name}
            onChange={(v) => onChange({ ...personalData, last_name: v })}
            autoComplete="family-name"
          />
        </div>

        <FloatingInput
          id="middle_name"
          label="Middle name (optional)"
          value={personalData.middle_name}
          onChange={(v) => onChange({ ...personalData, middle_name: v })}
          autoComplete="additional-name"
        />

        <FloatingInput
          id="email"
          label="Email"
          type="email"
          inputMode="email"
          value={personalData.email}
          onChange={(v) => onChange({ ...personalData, email: v })}
          autoComplete="email"
        />

        <FloatingInput
          id="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          value={personalData.phone}
          onChange={(v) => onChange({ ...personalData, phone: v })}
          autoComplete="tel"
        />

        <FloatingInput
          id="password"
          label="Password"
          type="password"
          value={personalData.password}
          onChange={(v) => onChange({ ...personalData, password: v })}
          autoComplete="new-password"
        />

        <FloatingInput
          id="confirmPassword"
          label="Confirm password"
          type="password"
          value={personalData.confirmPassword}
          onChange={(v) => onChange({ ...personalData, confirmPassword: v })}
          autoComplete="new-password"
        />
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-[#FA3728] text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#E31B23] active:scale-[0.99]"
      >
        Continue
      </button>
    </motion.div>
  );
}
