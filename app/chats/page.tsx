'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ordersService } from '@/lib/api';
import type { Order } from '@/lib/api';

const DEMO_ORDERS: Order[] = [
  {
    id: 'demo-order-1',
    customer: 'demo-customer',
    vendor: 'demo-vendor-1',
    vendor_name: "Mama Nkechi's Kitchen",
    status: 'pending_vendor_review',
    shipping_type: null,
    shipping_address: null,
    shipping_fee: '0',
    grand_total: '3500',
    items: [
      {
        id: 'demo-item-1',
        product: 'demo-prod-1',
        product_details: {
          id: 'demo-prod-1', owner: 'demo-vendor-1', owner_name: "Mama Nkechi's Kitchen",
          title: 'Jollof Rice Platter', description: '', price: '3500',
          tax_inclusive: false, item_type: 'product', addons: [],
          created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
          average_rating: '0', review_count: '0',
        },
        quantity: 1, vendor_proposed_quantity: null, active_quantity: '1',
        selected_addons: [], addon_details: [], total_price: '3500',
      },
    ],
    confirmation_code: '', delivery_proof_image: null, delivered_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-order-2',
    customer: 'demo-customer',
    vendor: 'demo-vendor-2',
    vendor_name: 'TechHub NG',
    status: 'awaiting_payment',
    shipping_type: 'delivery',
    shipping_address: '5 Adeola Odeku, Victoria Island, Lagos',
    shipping_fee: '2000',
    grand_total: '32000',
    items: [
      {
        id: 'demo-item-2',
        product: 'demo-prod-2',
        product_details: {
          id: 'demo-prod-2', owner: 'demo-vendor-2', owner_name: 'TechHub NG',
          title: 'Wireless Earbuds Pro', description: '', price: '15000',
          tax_inclusive: false, item_type: 'product', addons: [],
          created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
          average_rating: '0', review_count: '0',
        },
        quantity: 2, vendor_proposed_quantity: null, active_quantity: '2',
        selected_addons: [], addon_details: [], total_price: '30000',
      },
    ],
    confirmation_code: '', delivery_proof_image: null, delivered_at: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

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
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    ordersService.getOrderHistory()
      .then((data) => {
        if (data.results?.length) {
          setOrders(data.results);
        } else {
          setOrders(DEMO_ORDERS);
          setIsDemo(true);
        }
      })
      .catch(() => {
        setOrders(DEMO_ORDERS);
        setIsDemo(true);
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
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#FA3728]" />
          </div>
        ) : (
          <div className="md:my-6 md:bg-white md:rounded-2xl md:shadow-sm overflow-hidden">
            {isDemo && (
              <div className="mx-5 mt-5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 font-medium">
                Demo mode — place a real order to see it here.
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
