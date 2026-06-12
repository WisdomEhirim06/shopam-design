'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, ShoppingBag } from 'lucide-react';
import { ordersService } from '@/lib/api';
import type { Order } from '@/lib/api';

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
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    setIsAuthenticated(true);
    ordersService.getOrderHistory()
      .then((data) => {
        setOrders(data.results ?? []);
      })
      .catch(() => {
        setError('Failed to load orders. Please try again.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const pastOrders = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-4">
            <Link href="/explore" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Orders & Chats</h1>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto w-full">
        {isAuthenticated === false ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
              <ShoppingBag size={28} className="text-gray-400" />
            </div>
            <p className="font-semibold text-gray-700">Sign in to view your orders</p>
            <p className="text-sm text-gray-400">Track your purchases and chat with vendors.</p>
            <Link
              href={`/auth/signin?redirect=/chats`}
              className="mt-2 px-6 py-2.5 bg-[#FA3728] text-white rounded-full font-semibold text-sm hover:bg-[#E31B23] transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#FA3728]" />
          </div>
        ) : (
          <div className="md:my-6 md:bg-white md:rounded-2xl md:shadow-sm overflow-hidden">
            {error && (
              <div className="mx-5 mt-5 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
                {error}
              </div>
            )}
            {!error && activeOrders.length === 0 && pastOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <ShoppingBag size={28} className="text-gray-400" />
                </div>
                <p className="font-semibold text-gray-700">No orders yet</p>
                <p className="text-sm text-gray-400">When you place an order it will appear here.</p>
                <Link href="/explore" className="mt-2 text-sm font-semibold text-[#FA3728] hover:underline">
                  Start shopping
                </Link>
              </div>
            )}
            {activeOrders.length > 0 && (
              <>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-5 pt-5 pb-2">Active</p>
                <div className="divide-y divide-gray-100">
                  {activeOrders.map((order, i) => (
                    <OrderRow key={order.id} order={order} index={i} />
                  ))}
                </div>
              </>
            )}
            {pastOrders.length > 0 && (
              <>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-5 pt-5 pb-2">Past Orders</p>
                <div className="divide-y divide-gray-100">
                  {pastOrders.map((order, i) => (
                    <OrderRow key={order.id} order={order} index={i} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function OrderRow({ order, index }: { order: Order; index: number }) {
  const initials = (order.vendor_name || '??').slice(0, 2).toUpperCase();
  const colorCls = avatarColor(order.vendor);
  const needsAction = ['pending_customer_approval', 'awaiting_shipping_details', 'awaiting_payment', 'delivered'].includes(order.status);
  const firstItem = order.items[0];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
      <Link href={`/chats/${order.id}`} className="flex items-center gap-4 p-4 sm:p-5 hover:bg-gray-50 transition-colors group">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 text-white ${colorCls}`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-[#FA3728] transition-colors truncate">
              {order.vendor_name}
            </h3>
            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
              {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-500 truncate">
              {firstItem ? `${firstItem.product_details.title} ×${firstItem.quantity}` : '—'}
            </p>
            {needsAction && (
              <span className="flex-shrink-0 w-2 h-2 bg-[#FA3728] rounded-full" />
            )}
          </div>
          <p className={`text-xs mt-0.5 font-medium ${needsAction ? 'text-[#FA3728]' : 'text-gray-400'}`}>
            {statusLabel(order)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
