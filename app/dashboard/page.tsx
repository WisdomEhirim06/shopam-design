'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Bell, Package, Wallet, ShoppingBag, TrendingUp } from 'lucide-react';
import { authService, notificationsService, ordersService, productsService } from '@/lib/api';
import type { Notification, Order, ProductService } from '@/lib/api';
import { money } from '@/lib/order-steps';

const EARNINGS = { total: 452000, available: 182500, pending: 93500, thisMonth: 64000 };

const TRANSACTIONS = [
  { id: 1, label: 'Order #101 settled', amount: 8400, type: 'credit', date: 'Today, 14:20' },
  { id: 2, label: 'Order #98 settled', amount: 12500, type: 'credit', date: 'Yesterday' },
  { id: 3, label: 'Platform fee', amount: -900, type: 'debit', date: 'Yesterday' },
  { id: 4, label: 'Payout to bank', amount: -40000, type: 'debit', date: 'Oct 12' },
];

function StatCard({ label, value, hint, icon: Icon, tone }: { label: string; value: string; hint?: string; icon: typeof Wallet; tone: 'ink' | 'red' | 'slate' }) {
  const tones = {
    ink: 'bg-ink text-white',
    red: 'bg-[#FA3728]/10 text-[#FA3728]',
    slate: 'bg-slate-100 text-slate-600',
  }[tone];
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones}`}>
          <Icon size={17} />
        </span>
        {hint && <span className="text-[10px] font-semibold text-slate-400">{hint}</span>}
      </div>
      <p className="mt-3 text-xl font-black tracking-tight text-ink">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

export default function VendorHomePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<ProductService[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    ordersService.getVendorOrders().then((r) => setOrders(r.results.slice(0, 3))).catch(() => {});
    productsService.getMyProducts().then((r) => setProducts(Array.isArray(r) ? r : [])).catch(() => {});
    notificationsService.list().then(setNotifications).catch(() => {});
  }, []);

  const user = authService.getCurrentUser();
  const firstName = user?.first_name || 'Vendor';
  const lowStock = products.filter((p) => Number((p as unknown as { stock?: number }).stock ?? 0) <= 5).length;

  const statusLabel = (s: string) => {
    switch (s) {
      case 'pending_vendor_review': return 'New request';
      case 'awaiting_payment': return 'Awaiting payment';
      case 'paid': return 'Paid';
      case 'shipped': return 'Shipped';
      case 'disputed': return 'Disputed';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Declined';
      default: return s;
    }
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-ink">Good day, {firstName}</h2>
          <p className="mt-1 text-sm text-slate-500">Here&apos;s how your shop is doing.</p>
        </div>
        <Link href="/dashboard/products" className="hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#FA3728] sm:flex">
          <Package size={15} /> Add product
        </Link>
      </div>

      {/* Earnings */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Money</h3>
          <Link href="/dashboard/earnings" className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#FA3728]">
            View earnings <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={Wallet} label="Total earned" value={money(EARNINGS.total)} tone="ink" />
          <StatCard icon={TrendingUp} label="Available balance" value={money(EARNINGS.available)} tone="red" />
          <StatCard icon={ArrowUpRight} label="Pending payout" value={money(EARNINGS.pending)} tone="slate" />
          <StatCard icon={ShoppingBag} label="This month" value={money(EARNINGS.thisMonth)} tone="slate" />
        </div>
      </section>

      {/* Notifications */}
      <section>
        <h3 className="mb-3 text-sm font-bold text-ink">Notifications</h3>
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          {notifications.length === 0 ? (
            <div className="flex items-center gap-2 px-4 py-6 text-sm text-slate-400">
              <Bell size={16} /> No notifications yet.
            </div>
          ) : (
            notifications.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-start gap-3 border-b border-slate-50 px-4 py-3 last:border-0">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.is_read ? 'bg-slate-200' : 'bg-[#FA3728]'}`} />
                <p className="flex-1 text-[13px] leading-snug text-slate-600">
                  <span className="font-semibold text-ink">{item.actor?.username ?? 'ShopAm'}</span> {item.verb}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Inventory */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Inventory</h3>
          <Link href="/dashboard/products" className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#FA3728]">
            Manage <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xl font-black text-ink">{products.length}</p>
            <p className="text-xs text-slate-500">Total products</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xl font-black text-ink">{lowStock}</p>
            <p className="text-xs text-slate-500">Low stock</p>
          </div>
        </div>
      </section>

      {/* Recent orders */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Recent orders</h3>
          <Link href="/dashboard/orders" className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#FA3728]">
            All orders <ArrowRight size={13} />
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          {orders.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate-400">No orders yet.</p>
          ) : (
            orders.map((order) => (
              <Link key={order.id} href="/dashboard/orders" className="flex items-center justify-between border-b border-slate-50 px-4 py-3 last:border-0 hover:bg-slate-50/60">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-ink">{order.vendor_name || 'Buyer'}</p>
                  <p className="text-[11px] text-slate-400">{statusLabel(order.status)}</p>
                </div>
                <span className="text-[13px] font-bold text-ink">{money(Number(order.grand_total) || 0)}</span>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Transactions */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Recent transactions</h3>
          <Link href="/dashboard/earnings" className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#FA3728]">
            All <ArrowRight size={13} />
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          {TRANSACTIONS.map((t) => (
            <div key={t.id} className="flex items-center justify-between border-b border-slate-50 px-4 py-3 last:border-0">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink">{t.label}</p>
                <p className="text-[11px] text-slate-400">{t.date}</p>
              </div>
              <span className={`text-[13px] font-bold ${t.amount >= 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                {t.amount >= 0 ? '+' : ''}{money(Math.abs(t.amount))}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
