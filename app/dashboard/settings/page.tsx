'use client';

import { useRef, useState } from 'react';
import { Camera, Check, FileText, Loader2, LogOut, Pencil, ShieldCheck, Store, User } from 'lucide-react';
import { authService } from '@/lib/api';
import Field from '../components/Field';
import Modal from '../components/Modal';
import Switch from '../components/Switch';

function Row({ title, subtitle, action }: { title: string; subtitle: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3.5 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-xs text-slate-600">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: typeof Store; title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
      <Icon size={16} className="text-ink" />
      <h3 className="text-sm font-bold text-ink">{title}</h3>
    </div>
  );
}

export default function SettingsPage() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    bio: 'Authentic African fashion and accessories.',
    category: "Women's Fashion",
    location: 'Lagos, Nigeria',
  });
  const [business, setBusiness] = useState({
    name: 'ShopAm Store',
    cac: 'RC-1234567',
    tin: 'TIN-9876543',
    phone: '0800 000 0000',
    address: 'Victoria Island, Lagos',
  });
  const [cacFile, setCacFile] = useState<string | null>(null);

  const [store, setStore] = useState({ acceptOrders: true, visible: true });
  const [notifs, setNotifs] = useState({ orders: true, messages: true, payouts: true });

  const coverRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const cacRef = useRef<HTMLInputElement>(null);
  const [, setCover] = useState<string | null>(null);
  const [, setPhoto] = useState<string | null>(null);

  const save = (close: () => void) => {
    setSaving(true);
    // TODO: wire to the vendor profile / business endpoints when stable.
    setTimeout(() => {
      setSaving(false);
      close();
    }, 500);
  };

  const signOut = () => {
    authService.logout().finally(() => {
      window.location.href = '/auth/signin';
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-ink">Settings</h2>
        <p className="mt-1 text-sm text-slate-600">Manage your profile, business and preferences.</p>
      </div>

      {/* Profile */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <SectionTitle icon={User} title="Profile" />
        <Row
          title="Update profile"
          subtitle="Cover photo, profile photo, bio, category & location"
          action={
            <button onClick={() => setProfileOpen(true)} className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-ink">
              <Pencil size={13} /> Update
            </button>
          }
        />
      </section>

      {/* Business + KYC */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <SectionTitle icon={Store} title="Business" />
        <Row
          title="Update business details"
          subtitle="Business name, CAC, TIN, phone & address"
          action={
            <button onClick={() => setBusinessOpen(true)} className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-ink">
              <Pencil size={13} /> Update
            </button>
          }
        />
        <Row
          title="KYC — CAC document"
          subtitle={cacFile ? 'Document attached' : 'Upload your CAC certificate to get verified'}
          action={
            <>
              <button onClick={() => cacRef.current?.click()} className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-ink">
                <FileText size={13} /> {cacFile ? 'Replace' : 'Upload'}
              </button>
              <input
                ref={cacRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setCacFile(f.name);
                }}
              />
            </>
          }
        />
        <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-600">
          <ShieldCheck size={14} className="text-emerald-500" /> Email verified — business verification pending review.
        </div>
      </section>

      {/* Store */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <SectionTitle icon={Store} title="Store" />
        <Row title="Accept new orders" subtitle="Allow buyers to place new orders" action={<Switch checked={store.acceptOrders} onChange={() => setStore((s) => ({ ...s, acceptOrders: !s.acceptOrders }))} />} />
        <Row title="Visible in search" subtitle="Show your shop in discovery" action={<Switch checked={store.visible} onChange={() => setStore((s) => ({ ...s, visible: !s.visible }))} />} />
      </section>

      {/* Notifications */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <SectionTitle icon={Check} title="Notifications" />
        <Row title="New orders" subtitle="Get notified on new order requests" action={<Switch checked={notifs.orders} onChange={() => setNotifs((n) => ({ ...n, orders: !n.orders }))} />} />
        <Row title="New messages" subtitle="Buyer messages and replies" action={<Switch checked={notifs.messages} onChange={() => setNotifs((n) => ({ ...n, messages: !n.messages }))} />} />
        <Row title="Payout updates" subtitle="Withdrawals and settlements" action={<Switch checked={notifs.payouts} onChange={() => setNotifs((n) => ({ ...n, payouts: !n.payouts }))} />} />
      </section>

      <p className="pb-2 text-center text-[11px] text-slate-500">Some settings are saved locally until the backend endpoints are finalised.</p>

      {/* Sign out */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <button onClick={signOut} className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
          <LogOut size={17} /> Sign out
        </button>
      </section>

      {/* Update Profile dialog */}
      <Modal
        open={profileOpen}
        title="Update profile"
        description="This is what buyers see on your shop."
        onClose={() => setProfileOpen(false)}
        footer={
          <button onClick={() => save(() => setProfileOpen(false))} disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FA3728] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#E31B23] disabled:opacity-60">
            {saving && <Loader2 size={16} className="animate-spin" />}
            Save changes
          </button>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <button onClick={() => coverRef.current?.click()} className="flex h-24 flex-1 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 transition-colors hover:border-[#FA3728] hover:text-[#FA3728]">
              <Camera size={18} /> <span className="text-[11px] font-medium">Cover photo</span>
            </button>
            <button onClick={() => photoRef.current?.click()} className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 transition-colors hover:border-[#FA3728] hover:text-[#FA3728]">
              <Camera size={18} /> <span className="text-[11px] font-medium">Photo</span>
            </button>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && setCover(URL.createObjectURL(e.target.files[0]))} />
            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && setPhoto(URL.createObjectURL(e.target.files[0]))} />
          </div>
          <Field label="Bio" value={profile.bio} onChange={(v) => setProfile((p) => ({ ...p, bio: v }))} textarea rows={3} />
          <Field label="Category" value={profile.category} onChange={(v) => setProfile((p) => ({ ...p, category: v }))} />
          <Field label="Location" value={profile.location} onChange={(v) => setProfile((p) => ({ ...p, location: v }))} />
        </div>
      </Modal>

      {/* Update Business dialog */}
      <Modal
        open={businessOpen}
        title="Update business details"
        description="Your registered business information."
        onClose={() => setBusinessOpen(false)}
        footer={
          <button onClick={() => save(() => setBusinessOpen(false))} disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FA3728] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#E31B23] disabled:opacity-60">
            {saving && <Loader2 size={16} className="animate-spin" />}
            Save changes
          </button>
        }
      >
        <div className="space-y-4">
          <Field label="Business name" value={business.name} onChange={(v) => setBusiness((b) => ({ ...b, name: v }))} />
          <Field label="CAC registration" value={business.cac} onChange={(v) => setBusiness((b) => ({ ...b, cac: v }))} />
          <Field label="Tax ID (TIN)" value={business.tin} onChange={(v) => setBusiness((b) => ({ ...b, tin: v }))} />
          <Field label="Phone" value={business.phone} onChange={(v) => setBusiness((b) => ({ ...b, phone: v }))} inputMode="tel" />
          <Field label="Business address" value={business.address} onChange={(v) => setBusiness((b) => ({ ...b, address: v }))} textarea rows={2} />
        </div>
      </Modal>
    </div>
  );
}
