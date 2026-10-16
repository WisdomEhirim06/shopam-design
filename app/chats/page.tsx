'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ShoppingBag } from 'lucide-react';
import { ordersService } from '@/lib/api';
import type { Order } from '@/lib/api';
import AppBar from '@/app/components/ui/AppBar';
import BottomNav from '@/app/components/BottomNav';

function statusLabel(order: Order): string {
  switch (order.status) {
    case 'pending_vendor_review': return 'Waiting for vendor…';
    case 'pending_customer_approval': return 'Vendor made changes — review needed';
    case 'awaiting_shipping_details': return 'Set your shipping details';
    case 'shipping_set': return 'Vendor is setting shipping fee…';
    case 'awaiting_payment': return 'Ready to pay';
    case 'paid': return 'Payment in escrow — vendor packing';
    case 'shipped': return 'On the way to you!';
    case 'delivered': return 'Delivered — confirm receipt';
    case 'disputed': return 'Under dispute';
    case 'completed': return 'Order complete';
    case 'cancelled': return 'Cancelled';
    default: return order.status;
  }
}

function avatarColor(vendorId: string): string {
  const colors = ['bg-[#FA3728]', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];
  return colors[vendorId.charCodeAt(0) % colors.length];
}

export default function ChatsListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    setIsAuthenticated(true);
    ordersService
      .getOrderHistory()
      .then((data) => setOrders(data.results ?? []))
      .catch(() => setError('Failed to load orders. Please try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const pastOrders = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');

  return (
    <div className="min-h-screen bg-canvas pb-28 md:pb-16">
      <AppBar title="Chats" showBack={false} />

      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6">
        {isAuthenticated === false ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <ShoppingBag size={24} />
            </span>
            <p className="text-sm font-bold text-ink">Sign in to view your orders</p>
            <p className="text-xs text-slate-600">Track your purchases and chat with vendors.</p>
            <Link
              href="/auth/signin?redirect=/chats"
              className="mt-1 rounded-full bg-[#FA3728] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#E31B23]"
            >
              Sign in
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-[#FA3728]" size={28} />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        ) : activeOrders.length === 0 && pastOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <ShoppingBag size={24} />
            </span>
            <p className="text-sm font-bold text-ink">No orders yet</p>
            <p className="text-xs text-slate-600">When you place an order it will appear here.</p>
            <Link
              href="/explore"
              className="mt-1 rounded-full bg-[#FA3728] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#E31B23]"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {activeOrders.length > 0 && (
              <section className="space-y-2">
                <h2 className="px-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">Active</h2>
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
                  {activeOrders.map((order, i) => (
                    <OrderRow key={order.id} order={order} index={i} />
                  ))}
                </div>
              </section>
            )}

            {pastOrders.length > 0 && (
              <section className="space-y-2">
                <h2 className="px-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">Past orders</h2>
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
                  {pastOrders.map((order, i) => (
                    <OrderRow key={order.id} order={order} index={i} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function OrderRow({ order, index }: { order: Order; index: number }) {
  const initials = (order.vendor_name || '??').slice(0, 2).toUpperCase();
  const colorCls = avatarColor(order.vendor);
  const needsAction = ['pending_customer_approval', 'awaiting_shipping_details', 'awaiting_payment', 'delivered'].includes(
    order.status
  );
  const firstItem = order.items[0];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
      <Link
        href={`/chats/${order.id}`}
        className="flex items-center gap-3.5 border-b border-slate-100 px-4 py-3.5 transition-colors last:border-0 hover:bg-slate-50/60"
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${colorCls}`}
        >
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate text-sm font-bold text-ink">{order.vendor_name}</h3>
            <span className="shrink-0 text-[11px] text-slate-500">
              {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[13px] text-slate-600">
            {firstItem ? `${firstItem.product_details.title} ×${firstItem.quantity}` : '—'}
          </p>
          <p className={`mt-0.5 truncate text-[11px] font-medium ${needsAction ? 'text-[#FA3728]' : 'text-slate-500'}`}>
            {statusLabel(order)}
          </p>
        </div>
        {needsAction && <span className="h-2 w-2 shrink-0 rounded-full bg-[#FA3728]" />}
      </Link>
    </motion.div>
  );
}
