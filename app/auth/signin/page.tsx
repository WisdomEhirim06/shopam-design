'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { authService } from '@/lib/api';
import { isValidEmail } from '@/lib/validation';
import AuthShell from '../../components/auth/AuthShell';
import FloatingInput from '../../components/auth/FloatingInput';
import AccountTypeDialog from '../../components/auth/AccountTypeDialog';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const returnUrl =
    rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
      ? rawRedirect
      : null;
  const justVerified = searchParams.get('verified') === '1';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [choiceOpen, setChoiceOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'idle') return;
    setError('');

    const errs: { email?: string; password?: string } = {};
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(formData.email)) errs.email = 'Enter a valid email address';
    if (!formData.password) errs.password = 'Password is required';
    setFieldErrors(errs);
    if (errs.email || errs.password) return;

    setStatus('loading');
    try {
      const response = await authService.login({
        username: formData.email.trim(),
        password: formData.password,
      });

      const isVendor = !!response.user?.is_vendor;
      setStatus('success');
      window.setTimeout(() => {
        router.push(returnUrl ?? (isVendor ? '/dashboard' : '/explore'));
      }, 900);
    } catch (err: any) {
      setStatus('idle');
      const data = err.response?.data;

      if (data?.error === 'EMAIL_NOT_VERIFIED' || data?.code === 'EMAIL_NOT_VERIFIED' || data?.detail === 'Email not verified') {
        router.push('/auth/user-verify');
        return;
      }

      const msg = data?.message || data?.detail || data?.error || data?.non_field_errors?.[0];
      if (msg) {
        setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      } else if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else if (err.response?.status === 400) {
        setError('Please check your credentials and try again.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  const disabled = status !== 'idle';

  return (
    <>
      <AuthShell
        title="Sign In"
        subtitle="Welcome back! Enter your details to continue to your account."
        footer={
          <>
            New here?{' '}
            <button
              type="button"
              onClick={() => setChoiceOpen(true)}
              className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-[#FA3728] hover:decoration-[#FA3728]"
            >
              Create an account
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5" noValidate>
          {justVerified && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              Your email is verified. Sign in to continue.
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <FloatingInput
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(v) => {
              setFormData({ ...formData, email: v });
              if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
            }}
            error={fieldErrors.email}
            autoComplete="email"
            inputMode="email"
            disabled={disabled}
          />

          <FloatingInput
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(v) => {
              setFormData({ ...formData, password: v });
              if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
            }}
            error={fieldErrors.password}
            autoComplete="current-password"
            disabled={disabled}
          />

          <div className="flex justify-end pt-0.5">
            <Link
              href="/auth/forgot-password"
              className="text-xs sm:text-sm font-medium text-slate-500 transition-colors hover:text-[#FA3728]"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={disabled}
            className={`flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-full text-sm sm:text-base font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed ${status === 'success' ? 'bg-emerald-600' : 'bg-[#FA3728] hover:bg-[#E31B23] disabled:opacity-80'
              }`}
          >
            {status === 'loading' && <Loader2 size={18} className="animate-spin" />}
            {status === 'success' && <Check size={18} strokeWidth={3} />}
            <span>{status === 'loading' ? 'Signing in…' : status === 'success' ? 'Signed in' : 'Sign in'}</span>
          </button>
        </form>
      </AuthShell>

      <AccountTypeDialog open={choiceOpen} onClose={() => setChoiceOpen(false)} />
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA]">
          <Loader2 size={32} className="animate-spin text-[#FA3728]" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
