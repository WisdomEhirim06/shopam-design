'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '@/lib/api';

export default function ProfileEditPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    username: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        // Try fetching fresh profile from server
        const profile = await authService.refreshProfile();
        setForm({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: profile.phone || '',
          username: profile.username || '',
        });
      } catch {
        // Fall back to localStorage
        const cached = authService.getCurrentUser();
        if (!cached) { router.push('/auth/user-signin'); return; }
        setForm({
          first_name: cached.first_name || '',
          last_name: cached.last_name || '',
          phone: cached.phone || '',
          username: cached.username || '',
        });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await authService.updateProfile({
        first_name: form.first_name || undefined,
        last_name: form.last_name || undefined,
        phone: form.phone || undefined,
        username: form.username || undefined,
      });
      setSuccess(true);
      setTimeout(() => router.push('/profile'), 1800);
    } catch (err: any) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const msg = Object.values(data).flat().join(' ');
        setError(msg || 'Failed to update profile.');
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FA3728] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 h-16 flex items-center gap-3 sticky top-0 z-20">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-gray-600 hover:text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Edit Profile</h1>
      </div>

      <div className="max-w-md mx-auto px-6 mt-8">
        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-16 text-center">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Updated</h2>
            <p className="text-gray-500">Your changes have been saved.</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
            )}

            {[
              { label: 'First Name', key: 'first_name', placeholder: 'John' },
              { label: 'Last Name', key: 'last_name', placeholder: 'Doe' },
              { label: 'Username', key: 'username', placeholder: '@johndoe' },
              { label: 'Phone', key: 'phone', placeholder: '+234 800 000 0000' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                  {label}
                </label>
                <input
                  type={key === 'phone' ? 'tel' : 'text'}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 focus:ring-2 focus:ring-[#FA3728] focus:border-transparent outline-none transition-all"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FA3728] text-white rounded-2xl py-4 font-bold shadow-lg shadow-red-100 hover:bg-[#E31B23] transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <><Loader2 size={20} className="animate-spin" /> Saving…</>
              ) : (
                'Save Changes'
              )}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
