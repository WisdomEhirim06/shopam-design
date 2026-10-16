import type { Metadata } from 'next';
import AppBar from '@/app/components/ui/AppBar';
import BottomNav from '@/app/components/BottomNav';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How ShopAm collects, uses and protects your data.',
};

const SECTIONS = [
  { title: 'What we collect', body: 'Account details (name, email, phone), order history, and the messages you exchange with vendors.' },
  { title: 'How we use it', body: 'To run your orders, keep you signed in, send service updates, and improve ShopAm.' },
  { title: 'Sharing', body: 'We share only what a vendor needs to fulfil your order. We never sell your personal data.' },
  { title: 'Your choices', body: 'You can update your details in Settings, control notifications, or deactivate your account at any time.' },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas pb-28 md:pb-16">
      <AppBar title="Privacy Policy" />
      <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 sm:px-6">
        <p className="text-xs text-slate-500">Last updated: January 2026</p>
        {SECTIONS.map((s) => (
          <section key={s.title} className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <h2 className="text-sm font-bold text-ink">{s.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.body}</p>
          </section>
        ))}
        <p className="px-1 text-xs text-slate-500">
          This is a summary for the design preview. Final legal copy will be published before launch.
        </p>
      </div>
      <BottomNav />
    </div>
  );
}
