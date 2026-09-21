'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import type { PersonalData } from './data';

export default function PersonalInfoStep({
  personalData,
  onChange,
  error,
  showPassword,
  onTogglePassword,
  showConfirmPassword,
  onToggleConfirmPassword,
  onContinue,
}: {
  personalData: PersonalData;
  onChange: (d: PersonalData) => void;
  error: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  showConfirmPassword: boolean;
  onToggleConfirmPassword: () => void;
  onContinue: () => void;
}) {
  return (
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
              onChange={(e) => onChange({ ...personalData, first_name: e.target.value })}
              className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              required
              value={personalData.last_name}
              onChange={(e) => onChange({ ...personalData, last_name: e.target.value })}
              className="w-full px-4 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
            />
          </div>
        </div>

        {/* Middle Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name <span className="text-gray-400 font-normal">(Opt)</span></label>
          <input
            type="text"
            value={personalData.middle_name}
            onChange={(e) => onChange({ ...personalData, middle_name: e.target.value })}
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
            onChange={(e) => onChange({ ...personalData, email: e.target.value })}
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
            onChange={(e) => onChange({ ...personalData, phone: e.target.value })}
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
              onChange={(e) => onChange({ ...personalData, password: e.target.value })}
              className="w-full pl-4 pr-12 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
            />
            <button
              type="button"
              onClick={onTogglePassword}
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
              onChange={(e) => onChange({ ...personalData, confirmPassword: e.target.value })}
              className="w-full pl-4 pr-12 py-3 !border-2 !border-gray-300 rounded-xl focus:!border-[#FA3728] outline-none transition-colors !bg-white !text-gray-900"
            />
            <button
              type="button"
              onClick={onToggleConfirmPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
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
  );
}
