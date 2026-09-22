'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { authService } from '@/lib/api';
import { isValidEmail } from '@/lib/validation';
import AuthShell from '../../components/auth/AuthShell';
import FloatingInput from '../../components/auth/FloatingInput';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'idle') return;
    setError('');

    if (!email.trim()) {
      setFieldError('Email is required');
      return;
    }
    if (!isValidEmail(email)) {
      setFieldError('Enter a valid email address');
      return;
    }
    setFieldError('');
    setStatus('loading');

    try {
      await authService.forgotPassword({ email: email.trim() });
      setStatus('sent');
    } catch (err: any) {
      setStatus('idle');
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to send reset link. Please check your email address.'
      );
    }
  };

  if (status === 'sent') {
    return (
      <AuthShell
        title="Check your email"
        subtitle={<>We sent a password reset link to <span className="font-semibold text-ink">{email}</span>.</>}
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500">
            <CheckCircle2 size={32} />
          </div>
          <p className="text-sm text-slate-500">
            Didn&apos;t receive it? Check your spam folder or request a new link.
          </p>
          <button
            type="button"
            onClick={() => { setStatus('idle'); setEmail(''); }}
            className="text-sm font-semibold text-[#FA3728] hover:underline"
          >
            Try again
          </button>
          <Link href="/auth/signin" className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-[#FA3728]">
            <ArrowLeft size={16} /> Back to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="Enter the email linked to your account and we'll send a reset link."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <FloatingInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(v) => { setEmail(v); if (fieldError) setFieldError(''); }}
          error={fieldError}
          autoComplete="email"
          inputMode="email"
          disabled={status !== 'idle'}
        />

        <button
          type="submit"
          disabled={status !== 'idle'}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#FA3728] text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#E31B23] disabled:opacity-80"
        >
          {status === 'loading' ? (
            <><Loader2 size={18} className="animate-spin" /> Sending…</>
          ) : (
            'Send reset link'
          )}
        </button>

        <Link href="/auth/signin" className="flex items-center justify-center gap-2 pt-1 text-sm text-slate-500 transition-colors hover:text-[#FA3728]">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </form>
    </AuthShell>
  );
}
