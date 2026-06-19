'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, Loader2 } from 'lucide-react';
import { ordersService } from '@/lib/api';
import type { Order } from '@/lib/api';

// Tailored statuses from the VENDOR'S perspective
function vendorStatusLabel(order: Order): string {
  switch (order.status) {
    case 'pending_vendor_review': return 'Action Needed: Review new order';
    case 'pending_customer_approval': return 'Waiting for customer approval';
    case 'awaiting_shipping_details': return 'Waiting for customer address';
    case 'shipping_set': return 'Action Needed: Set shipping fee';
    case 'awaiting_payment': return 'Waiting for customer payment';
    case 'paid': return 'Paid! Ready to fulfill';
    case 'shipped': return 'Shipped';
    case 'delivered': return 'Delivered — awaiting confirmation';
    case 'disputed': return 'Under dispute';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    default: return order.status;
  }
}

// Generate consistent avatar colors based on the Customer ID
function avatarColor(id: string): string {
  const colors = ['bg-[#FA3728]', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];
  return colors[(id || 'a').charCodeAt(0) % colors.length];
}

export default function VendorChatsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the vendor's specific orders
    // NOTE: Make sure this uses the method that fetches orders where the vendor is the owner
    ordersService.getVendorOrders()
      .then((data: any) => {
        setOrders(data.results ?? data ?? []);
      })
      .catch(() => {
        setError('Failed to load chats. Please try again.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const activeChats = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const pastChats = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');

  return (
    <div className="px-4 py-2 md:p-8 max-w-3xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500">Chat with customers regarding their active orders.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#FA3728]" />
        </div>
      ) : error ? (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center bg-white rounded-2xl border border-gray-100 shadow-sm border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
            <MessageSquare size={28} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mt-2">No messages yet</h3>
          <p className="text-sm text-gray-500 max-w-xs">When customers place orders, your chat threads with them will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
          
          {activeChats.length > 0 && (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-5 pt-5 pb-2">Active Chats</p>
              <div className="divide-y divide-gray-100">
                {activeChats.map((order, i) => (
                  <ChatRow key={order.id} order={order} index={i} />
                ))}
              </div>
            </>
          )}
          
          {pastChats.length > 0 && (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-5 pt-5 pb-2 mt-4">Completed & Cancelled</p>
              <div className="divide-y divide-gray-100">
                {pastChats.map((order, i) => (
                  <ChatRow key={order.id} order={order} index={i} />
                ))}
              </div>
            </>
          )}
          
        </div>
      )}
    </div>
  );
}

function ChatRow({ order, index }: { order: Order; index: number }) {
  // Notice we use the CUSTOMER'S name here, so the vendor sees who they are talking to
  const customerName = order.customer || 'Customer';
  const initials = customerName.slice(0, 2).toUpperCase();
  const colorCls = avatarColor(order.customer || 'default');
  
  // Highlighting steps where the VENDOR needs to take action
  const needsAction = ['pending_vendor_review', 'shipping_set'].includes(order.status);
  const firstItem = order.items?.[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.04 }}
    >
      <Link href={`/chats/${order.id}`} className="flex items-center gap-4 p-4 sm:p-5 hover:bg-gray-50 transition-colors group">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 text-white ${colorCls}`}>
          {initials}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-[#FA3728] transition-colors truncate">
              {customerName}
            </h3>
            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
              {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-500 truncate">
              {firstItem ? `${firstItem.product_details?.title || 'Item'} ×${firstItem.quantity}` : 'Order details...'}
            </p>
            {needsAction && (
              <span className="flex-shrink-0 w-2 h-2 bg-[#FA3728] rounded-full shadow-[0_0_0_4px_rgba(250,55,40,0.1)]" />
            )}
          </div>
          
          <p className={`text-xs mt-1 font-medium ${needsAction ? 'text-[#FA3728]' : 'text-gray-400'}`}>
            {vendorStatusLabel(order)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}