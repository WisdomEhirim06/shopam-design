'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { authService } from '@/lib/api';
import AuthShell from '../../components/auth/AuthShell';
import FloatingInput from '../../components/auth/FloatingInput';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'idle') return;
    setError('');

    const errs: { password?: string; confirm?: string } = {};
    if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (confirmPassword !== password) errs.confirm = 'Passwords do not match';
    setFieldErrors(errs);
    if (errs.password || errs.confirm) return;

    setStatus('loading');
    try {
      await authService.resetPassword({ email, reset_token: token, password });
      setStatus('done');
      window.setTimeout(() => router.push('/auth/signin'), 2500);
    } catch (err: any) {
      setStatus('idle');
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Reset failed. The link may have expired.'
      );
    }
  };

  if (!token || !email) {
    return (
      <AuthShell align="center" title="Invalid reset link" subtitle="This password reset link is missing or has expired.">
        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="inline-flex h-11 sm:h-12 items-center justify-center rounded-full bg-[#FA3728] px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#E31B23] hover:shadow-md"
          >
            Request a new link
          </Link>
        </div>
      </AuthShell>
    );
  }

  if (status === 'done') {
    return (
      <AuthShell align="center" title="Password updated" subtitle="Redirecting you to sign in…">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500">
            <CheckCircle2 size={32} />
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong password you haven't used before.">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5" noValidate>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <FloatingInput
          id="new-password"
          label="New password"
          type="password"
          value={password}
          onChange={(v) => { setPassword(v); if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined }); }}
          error={fieldErrors.password}
          autoComplete="new-password"
          disabled={status !== 'idle'}
        />

        <FloatingInput
          id="confirm-password"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(v) => { setConfirmPassword(v); if (fieldErrors.confirm) setFieldErrors({ ...fieldErrors, confirm: undefined }); }}
          error={fieldErrors.confirm}
          autoComplete="new-password"
          disabled={status !== 'idle'}
        />

        <button
          type="submit"
          disabled={status !== 'idle'}
          className="flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-full bg-[#FA3728] text-sm sm:text-base font-semibold text-white shadow-sm transition-all hover:bg-[#E31B23] hover:shadow-md active:scale-[0.99] disabled:opacity-80"
        >
          {status === 'loading' ? (
            <><Loader2 size={18} className="animate-spin" /> Updating…</>
          ) : (
            'Update password'
          )}
        </button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA]">
          <Loader2 size={32} className="animate-spin text-[#FA3728]" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
