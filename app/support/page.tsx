import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle, LifeBuoy } from 'lucide-react';
import AppBar from '@/app/components/ui/AppBar';
import BottomNav from '@/app/components/BottomNav';

export const metadata: Metadata = {
  title: 'Help & Support',
  description: 'Get help with your ShopAm account, orders and payments.',
};

const LINKS = [
  { icon: MessageCircle, title: 'Order & delivery help', copy: 'Questions about an order, shipping or delivery.', href: '/chats' },
  { icon: LifeBuoy, title: 'Report a problem', copy: 'Raise a dispute for a delivered order.', href: '/chats' },
  { icon: Mail, title: 'Email us', copy: 'support@shopam.net — we reply within 24 hours.', href: 'mailto:support@shopam.net' },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-canvas pb-28 md:pb-16">
      <AppBar title="Help & Support" />
      <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 sm:px-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink">How can we help?</h1>
          <p className="mt-1 text-sm text-slate-600">
            Find answers or reach the ShopAm team. We&rsquo;re here every day.
          </p>
        </div>

        <div className="space-y-3">
          {LINKS.map(({ icon: Icon, title, copy, href }) => (
            <Link
              key={title}
              href={href}
              className="flex items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 transition-colors hover:border-slate-300"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FA3728]/10 text-[#FA3728]">
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-ink">{title}</span>
                <span className="mt-0.5 block text-xs text-slate-600">{copy}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
