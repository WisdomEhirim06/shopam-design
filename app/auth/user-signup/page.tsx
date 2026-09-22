'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { authService } from '@/lib/api';
import { isValidEmail } from '@/lib/validation';
import AuthShell from '../../components/auth/AuthShell';
import FloatingInput from '../../components/auth/FloatingInput';
import { normalizeNigerianPhone } from '../signup/phone';

function UserSignUpForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'idle') return;
    setError('');

    const errs: Record<string, string> = {};
    if (!formData.username.trim()) errs.username = 'Username is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(formData.email)) errs.email = 'Enter a valid email address';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (formData.confirmPassword !== formData.password) errs.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) errs.terms = 'Please agree to the terms to continue';
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus('loading');
    const phone = normalizeNigerianPhone(formData.phone);

    try {
      await authService.registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone,
        first_name: formData.first_name || undefined,
        last_name: formData.last_name || undefined,
      });
      setStatus('success');
      window.setTimeout(() => {
        router.push(`/auth/user-verify?email=${encodeURIComponent(formData.email)}`);
      }, 800);
    } catch (err: any) {
      setStatus('idle');
      const data = err.response?.data;
      if (!data) {
        setError(err.message || 'Registration failed. Please try again.');
      } else if (typeof data === 'string') {
        setError('Server error. Please try again later.');
      } else if (data.detail) {
        setError(data.detail);
      } else if (data.username) {
        setError(`Username: ${Array.isArray(data.username) ? data.username[0] : data.username}`);
      } else if (data.email) {
        setError(`Email: ${Array.isArray(data.email) ? data.email[0] : data.email}`);
      } else if (data.phone) {
        setError(`Phone: ${Array.isArray(data.phone) ? data.phone[0] : data.phone}`);
      } else if (data.password) {
        setError(`Password: ${Array.isArray(data.password) ? data.password[0] : data.password}`);
      } else if (data.message) {
        setError(data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  const disabled = status !== 'idle';

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join ShopAm and start shopping from verified vendors."
      footer={
        <div className="space-y-2">
          <p>
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-semibold text-[#FA3728] hover:underline">
              Sign In
            </Link>
          </p>
          <p className="text-slate-400">
            Want to sell on ShopAm?{' '}
            <Link href="/auth/signup" className="font-medium text-[#FA3728] hover:underline">
              Become a vendor
            </Link>
          </p>
        </div>
      }
    >
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <FloatingInput
          id="username"
          label="Username"
          value={formData.username}
          onChange={(v) => { setFormData({ ...formData, username: v }); if (fieldErrors.username) setFieldErrors({ ...fieldErrors, username: '' }); }}
          error={fieldErrors.username}
          autoComplete="username"
          disabled={disabled}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FloatingInput
            id="first_name"
            label="First name (optional)"
            value={formData.first_name}
            onChange={(v) => setFormData({ ...formData, first_name: v })}
            autoComplete="given-name"
            disabled={disabled}
          />
          <FloatingInput
            id="last_name"
            label="Last name (optional)"
            value={formData.last_name}
            onChange={(v) => setFormData({ ...formData, last_name: v })}
            autoComplete="family-name"
            disabled={disabled}
          />
        </div>

        <FloatingInput
          id="email"
          label="Email"
          type="email"
          inputMode="email"
          value={formData.email}
          onChange={(v) => { setFormData({ ...formData, email: v }); if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' }); }}
          error={fieldErrors.email}
          autoComplete="email"
          disabled={disabled}
        />

        <FloatingInput
          id="phone"
          label="Phone number"
          type="tel"
          inputMode="tel"
          value={formData.phone}
          onChange={(v) => { setFormData({ ...formData, phone: v }); if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' }); }}
          error={fieldErrors.phone}
          autoComplete="tel"
          disabled={disabled}
        />

        <FloatingInput
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={(v) => { setFormData({ ...formData, password: v }); if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' }); }}
          error={fieldErrors.password}
          autoComplete="new-password"
          disabled={disabled}
        />

        <FloatingInput
          id="confirmPassword"
          label="Confirm password"
          type="password"
          value={formData.confirmPassword}
          onChange={(v) => { setFormData({ ...formData, confirmPassword: v }); if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: '' }); }}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
          disabled={disabled}
        />

        <div>
          <label className="flex items-start gap-3 text-sm text-slate-500">
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => { setFormData({ ...formData, agreeToTerms: e.target.checked }); if (fieldErrors.terms) setFieldErrors({ ...fieldErrors, terms: '' }); }}
              disabled={disabled}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#FA3728] focus:ring-[#FA3728]"
            />
            <span>
              I agree to the{' '}
              <Link href="/terms" className="font-medium text-[#FA3728] hover:underline">Terms</Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-[#FA3728] hover:underline">Privacy Policy</Link>.
            </span>
          </label>
          {fieldErrors.terms && <p className="mt-1.5 text-xs font-medium text-red-500">{fieldErrors.terms}</p>}
        </div>

        <button
          type="submit"
          disabled={disabled}
          className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white shadow-lg transition-all disabled:cursor-not-allowed ${
            status === 'success' ? 'bg-emerald-600' : 'bg-[#FA3728] hover:bg-[#E31B23] disabled:opacity-80'
          }`}
        >
          {status === 'loading' && <Loader2 size={18} className="animate-spin" />}
          {status === 'success' && <Check size={18} strokeWidth={3} />}
          <span>{status === 'loading' ? 'Creating account…' : status === 'success' ? 'Account created' : 'Create Account'}</span>
        </button>
      </form>
    </AuthShell>
  );
}

export default function UserSignUpPage() {
  return <UserSignUpForm />;
}
