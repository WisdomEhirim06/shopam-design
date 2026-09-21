'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { ordersService } from '@/lib/api/services';
import { transformOrder, type UIOrder, type UIOrderStatus, type ConversationMessage } from './order-transform';
import OrderConversation from './OrderConversation';

/* ─────────────── Main Component ─────────────── */
export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<UIOrderStatus>('All');
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<UIOrder | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [convError, setConvError] = useState('');

  const tabs: UIOrderStatus[] = ['All', 'Pending', 'Confirmed', 'Completed'];
  const filteredOrders = activeTab === 'All' ? orders : orders.filter((o) => o.status === activeTab);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ordersService.getVendorOrders();
      setOrders(data.results.map(transformOrder));
    } catch {
      // keep empty list on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  /* ── Helpers ── */
  const updateConvMsg = (
    orderId: string,
    msgId: string,
    updates: Partial<ConversationMessage>
  ) => {
    const applyTo = (order: UIOrder): UIOrder => ({
      ...order,
      messages: order.messages.map((m) => (m.id === msgId ? { ...m, ...updates } : m)),
    });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? applyTo(o) : o)));
    setSelectedOrder((prev) => (prev?.id === orderId ? applyTo(prev) : prev));
  };

  const appendMsg = (orderId: string, msg: ConversationMessage) => {
    const applyTo = (order: UIOrder): UIOrder => ({
      ...order,
      messages: [...order.messages, msg],
    });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? applyTo(o) : o)));
    setSelectedOrder((prev) => (prev?.id === orderId ? applyTo(prev) : prev));
  };

  /* ── Start delivery (Step 7) ── */
  const handleStartDelivery = async (orderId: string) => {
    try {
      await ordersService.startDelivery(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, apiStatus: 'shipped' } : o))
      );
      setSelectedOrder((prev) =>
        prev?.id === orderId ? { ...prev, apiStatus: 'shipped' } : prev
      );
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        const cardMsgId = `order-${orderId}`;
        updateConvMsg(orderId, cardMsgId, { orderStatus: 'Shipped' });
      }
    } catch {
      setConvError('Failed to mark as shipped. Please try again.');
    }
  };

  /* ── Accept order (Step 2) ── */
  const handleAccept = async (orderId: string, msgId: string) => {
    try {
      await ordersService.vendorReview(orderId, { action: 'accept' });
    } catch {
      setConvError('Failed to accept order. Please try again.');
    }
    updateConvMsg(orderId, msgId, { orderStatus: 'Accepted' });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Confirmed', apiStatus: 'awaiting_shipping_details' } : o))
    );
    setSelectedOrder((prev) =>
      prev?.id === orderId ? { ...prev, status: 'Confirmed', apiStatus: 'awaiting_shipping_details' } : prev
    );
  };

  /* ── Decline order (Step 2 — vendor declines) ── */
  const handleDecline = async (orderId: string, msgId: string) => {
    try {
      await ordersService.vendorReview(orderId, { action: 'decline' });
    } catch {
      setConvError('Failed to decline order. Please try again.');
    }
    updateConvMsg(orderId, msgId, { orderStatus: 'Declined' });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Declined', apiStatus: 'cancelled' } : o))
    );
    setSelectedOrder((prev) =>
      prev?.id === orderId ? { ...prev, status: 'Declined', apiStatus: 'cancelled' } : prev
    );
  };

  /* ── Set shipping fee (Step 5) ── */
  const handleSetShippingFee = async (orderId: string, msgId: string, fee: number, total: number) => {
    try {
      await ordersService.setShippingFee(orderId, fee.toFixed(2));
    } catch {
      setConvError('Failed to set shipping fee. Please try again.');
      return;
    }
    updateConvMsg(orderId, msgId, { orderStatus: 'Shipping Fee Set', shippingFee: fee });
    appendMsg(orderId, {
      id: `shipping-${Date.now()}`,
      type: 'shipping_notification',
      timestamp: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
      fromBuyer: false,
      shippingFee: fee,
      total: total + fee,
    });
  };

  /* ── Send text message ── */
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedOrder) return;
    appendMsg(selectedOrder.id, {
      id: `m${Date.now()}`,
      type: 'text',
      timestamp: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
      content: messageInput.trim(),
      fromBuyer: false,
    });
    setMessageInput('');
  };

  /* ════════════════════════════════════════
     CONVERSATION VIEW
  ════════════════════════════════════════ */
  if (selectedOrder) {
    return (
      <OrderConversation
        order={selectedOrder}
        messageInput={messageInput}
        onMessageInputChange={setMessageInput}
        convError={convError}
        onConvErrorChange={setConvError}
        onBack={() => setSelectedOrder(null)}
        onStartDelivery={handleStartDelivery}
        onAccept={handleAccept}
        onDecline={handleDecline}
        onSetShippingFee={handleSetShippingFee}
        onSendMessage={handleSendMessage}
      />
    );
  }

  /* ════════════════════════════════════════
     ORDERS LIST VIEW
  ════════════════════════════════════════ */
  return (
    <div className="px-4 py-2 md:p-8 space-y-6 max-w-lg mx-auto md:max-w-none">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm md:text-base mt-1">
            {isLoading ? 'Loading…' : `${orders.filter((o) => o.status === 'Pending').length} pending`}
          </p>
        </div>
        <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <Search size={18} strokeWidth={2.5} />
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex bg-white p-1 rounded-full border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[80px] py-2 px-3 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-[#FA3728] text-white shadow-sm' : 'text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3 pb-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#FA3728]" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 font-medium">No orders found.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer active:scale-[0.99] transition-transform"
            >
              <div className="flex gap-4">
                <div
                  className={`w-12 h-12 rounded-full ${order.avatarColor} text-white flex items-center justify-center font-bold flex-shrink-0 text-lg`}
                >
                  {order.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-0.5">
                    <h3 className="font-semibold text-gray-900 truncate pr-4 text-sm md:text-base leading-tight">
                      {order.name}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap font-medium">{order.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex flex-col">
                      <p className="text-xs md:text-sm text-gray-500 truncate mb-1">{order.item}</p>
                      <span className="font-bold text-gray-900 text-sm md:text-base">{order.price}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {order.status === 'Pending' && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] md:text-xs font-bold text-[#FA3728] bg-red-50 px-2 py-0.5 rounded-full">
                            Pending
                          </span>
                          {order.unreadCount && (
                            <span className="flex items-center justify-center w-5 h-5 bg-[#FA3728] text-white text-[10px] font-bold rounded-full">
                              {order.unreadCount}
                            </span>
                          )}
                        </div>
                      )}
                      {order.status === 'Confirmed' && (
                        <span className="text-[10px] md:text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                          Confirmed
                        </span>
                      )}
                      {order.status === 'Completed' && (
                        <span
                          className={`text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full ${
                            order.apiStatus === 'cancelled'
                              ? 'text-gray-500 bg-gray-100'
                              : 'text-blue-500 bg-blue-50'
                          }`}
                        >
                          {order.apiStatus === 'cancelled' ? 'Cancelled' : 'Completed'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
}
