import type { Metadata } from 'next';
import AppBar from '@/app/components/ui/AppBar';
import BottomNav from '@/app/components/BottomNav';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern your use of ShopAm.',
};

const SECTIONS = [
  { title: 'Using ShopAm', body: 'By creating an account you agree to provide accurate information and to keep your login secure. You are responsible for activity on your account.' },
  { title: 'Buying & selling', body: 'Orders are placed between buyers and vendors. ShopAm facilitates payments and communication but is not a party to the sale.' },
  { title: 'Payments & refunds', body: 'Payments are held securely until an order is confirmed as delivered. Refunds and disputes follow the order timeline.' },
  { title: 'Acceptable use', body: 'Do not post unlawful, misleading or harmful content. We may suspend accounts that break these rules.' },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-canvas pb-28 md:pb-16">
      <AppBar title="Terms of Service" />
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
