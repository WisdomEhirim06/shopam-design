'use client';

import { useEffect, useState } from 'react';
import {
  ChevronRight,
  KeyRound,
  Loader2,
  LogOut,
  ShieldCheck,
  Trash2,
  User,
} from 'lucide-react';
import { authService } from '@/lib/api';
import AppBar from '@/app/components/ui/AppBar';
import Field from '@/app/components/ui/Field';
import Modal from '@/app/components/ui/Modal';
import Switch from '@/app/components/ui/Switch';
import BottomNav from '@/app/components/BottomNav';

type IconType = React.ComponentType<{ size?: number }>;

function SettingRow({
  icon: Icon,
  title,
  subtitle,
  onClick,
  danger,
}: {
  icon: IconType;
  title: string;
  subtitle?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3.5 border-b border-slate-100 px-4 py-3.5 text-left transition-colors last:border-0 hover:bg-slate-50/60"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          danger ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'
        }`}
      >
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-sm font-semibold ${danger ? 'text-red-600' : 'text-ink'}`}>{title}</span>
        {subtitle && <span className="mt-0.5 block text-xs text-slate-600">{subtitle}</span>}
      </span>
      <ChevronRight size={16} className={danger ? 'text-red-300' : 'text-slate-400'} />
    </button>
  );
}

function ToggleRow({
  title,
  subtitle,
  checked,
  onChange,
}: {
  title: string;
  subtitle?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-2.5 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {subtitle && <p className="mt-0.5 text-xs text-slate-600">{subtitle}</p>}
      </div>
      <Switch checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="px-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">{children}</h2>;
}

export default function CustomerSettingsPage() {
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  const [form, setForm] = useState({ first_name: '', last_name: '', username: '', phone: '' });
  const [pw, setPw] = useState({ old_password: '', new_password: '', confirm: '' });
  const [profileError, setProfileError] = useState('');
  const [pwError, setPwError] = useState('');
  const [prefs, setPrefs] = useState({ orders: true, messages: true, promos: false });

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      window.location.href = '/auth/signin';
      return;
    }
    setForm({
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      username: user.username ?? '',
      phone: user.phone ?? '',
    });
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Loader2 className="animate-spin text-[#FA3728]" size={28} />
      </div>
    );
  }

  const saveProfile = async () => {
    setProfileError('');
    setSaving(true);
    try {
      await authService.updateProfile({
        first_name: form.first_name || undefined,
        last_name: form.last_name || undefined,
        username: form.username || undefined,
        phone: form.phone || undefined,
      });
      setProfileOpen(false);
    } catch (err) {
      const data = (err as { response?: { data?: unknown } })?.response?.data;
      setProfileError(
        data && typeof data === 'object'
          ? Object.values(data).flat().join(' ')
          : 'Could not save your profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    setPwError('');
    if (pw.new_password.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    if (pw.new_password !== pw.confirm) {
      setPwError('New passwords do not match.');
      return;
    }
    setSaving(true);
    try {
      await authService.changePassword({ old_password: pw.old_password, new_password: pw.new_password });
      setPw({ old_password: '', new_password: '', confirm: '' });
      setPasswordOpen(false);
    } catch (err) {
      const data = (err as { response?: { data?: { message?: string } } })?.response?.data;
      setPwError(data?.message || 'Could not change password. Check your current password.');
    } finally {
      setSaving(false);
    }
  };

  const signOut = () => {
    authService.logout().finally(() => {
      window.location.href = '/';
    });
  };

  const deactivate = async () => {
    setSaving(true);
    try {
      await authService.deactivateAccount();
    } catch {
      /* ignore */
    } finally {
      window.location.href = '/';
    }
  };

  const primaryBtn =
    'flex w-full items-center justify-center gap-2 rounded-full bg-[#FA3728] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#E31B23] disabled:opacity-60';

  return (
    <div className="min-h-screen bg-canvas pb-28 md:pb-16">
      <AppBar title="Settings" />

      <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6">
        <section className="space-y-2">
          <SectionLabel>Account</SectionLabel>
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            <SettingRow
              icon={User}
              title="Update profile"
              subtitle="Name, username and phone number"
              onClick={() => setProfileOpen(true)}
            />
            <SettingRow
              icon={KeyRound}
              title="Change password"
              subtitle="Keep your account secure"
              onClick={() => setPasswordOpen(true)}
            />
          </div>
        </section>

        <section className="space-y-2">
          <SectionLabel>Notifications</SectionLabel>
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            <ToggleRow
              title="Order updates"
              subtitle="Status changes on your orders"
              checked={prefs.orders}
              onChange={() => setPrefs((p) => ({ ...p, orders: !p.orders }))}
            />
            <ToggleRow
              title="Chat messages"
              subtitle="New messages from vendors"
              checked={prefs.messages}
              onChange={() => setPrefs((p) => ({ ...p, messages: !p.messages }))}
            />
            <ToggleRow
              title="Promotions & offers"
              subtitle="Deals from shops you follow"
              checked={prefs.promos}
              onChange={() => setPrefs((p) => ({ ...p, promos: !p.promos }))}
            />
          </div>
        </section>

        <section className="space-y-2">
          <SectionLabel>Privacy</SectionLabel>
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            <SettingRow
              icon={ShieldCheck}
              title="Account & data"
              subtitle="We never share your personal data"
              onClick={() => {}}
            />
            <SettingRow
              icon={Trash2}
              title="Deactivate account"
              subtitle="Temporarily disable your account"
              onClick={() => setDeactivateOpen(true)}
              danger
            />
          </div>
        </section>

        <section>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={17} /> Sign out
          </button>
        </section>

        <p className="pb-2 text-center text-[11px] text-slate-500">ShopAm · Account settings</p>
      </div>

      {/* Update profile */}
      <Modal
        open={profileOpen}
        title="Update profile"
        description="Your public account details."
        onClose={() => setProfileOpen(false)}
        footer={
          <button onClick={saveProfile} disabled={saving} className={primaryBtn}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            Save changes
          </button>
        }
      >
        <div className="space-y-4">
          {profileError && (
            <div className="rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-600">{profileError}</div>
          )}
          <Field label="First name" value={form.first_name} onChange={(v) => setForm({ ...form, first_name: v })} autoComplete="given-name" />
          <Field label="Last name" value={form.last_name} onChange={(v) => setForm({ ...form, last_name: v })} autoComplete="family-name" />
          <Field label="Username" value={form.username} onChange={(v) => setForm({ ...form, username: v })} />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} inputMode="tel" autoComplete="tel" />
        </div>
      </Modal>

      {/* Change password */}
      <Modal
        open={passwordOpen}
        title="Change password"
        onClose={() => setPasswordOpen(false)}
        footer={
          <button onClick={savePassword} disabled={saving} className={primaryBtn}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            Update password
          </button>
        }
      >
        <div className="space-y-4">
          {pwError && (
            <div className="rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-600">{pwError}</div>
          )}
          <Field label="Current password" type="password" value={pw.old_password} onChange={(v) => setPw({ ...pw, old_password: v })} autoComplete="current-password" />
          <Field label="New password" type="password" value={pw.new_password} onChange={(v) => setPw({ ...pw, new_password: v })} autoComplete="new-password" />
          <Field label="Confirm new password" type="password" value={pw.confirm} onChange={(v) => setPw({ ...pw, confirm: v })} autoComplete="new-password" />
        </div>
      </Modal>

      {/* Deactivate */}
      <Modal
        open={deactivateOpen}
        title="Deactivate account"
        description="You can reactivate by signing in again."
        onClose={() => setDeactivateOpen(false)}
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setDeactivateOpen(false)}
              className="flex-1 rounded-full border border-slate-200 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={deactivate}
              disabled={saving}
              className="flex-1 rounded-full bg-red-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              Deactivate
            </button>
          </div>
        }
      >
        <p className="text-sm text-slate-600">
          This will sign you out and temporarily disable your account. Your data is kept safe and restored if you sign
          back in.
        </p>
      </Modal>

      <BottomNav />
    </div>
  );
}
