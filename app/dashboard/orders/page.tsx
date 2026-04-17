'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowLeft, Send, Check, X, Truck, CheckCircle2, MoreVertical
} from 'lucide-react';

/* ─────────────── Types ─────────────── */
type OrderStatus = 'All' | 'Pending' | 'Confirmed' | 'Completed';

interface OrderItem {
  name: string;
  price: string;
  quantity: number;
  image?: string;
}

type ConvMsgType =
  | 'order_card'
  | 'text'
  | 'delivery_details'
  | 'shipping_notification'
  | 'payment_success';

interface ConversationMessage {
  id: string;
  type: ConvMsgType;
  timestamp: string;
  fromBuyer?: boolean;
  // order_card fields
  orderStatus?: 'Pending' | 'Accepted' | 'Declined' | 'Delivery Details Set' | 'Shipping Fee Set';
  buyerName?: string;
  items?: OrderItem[];
  total?: number;
  shippingFee?: number;
  address?: string;
  // text
  content?: string;
}

interface Order {
  id: string;
  name: string;
  item: string;
  items: OrderItem[];
  price: string;
  time: string;
  status: OrderStatus;
  avatar: string;
  avatarColor: string;
  unreadCount?: number;
  messages: ConversationMessage[];
}

/* ─────────────── Seed Data ─────────────── */
const initialOrders: Order[] = [
  {
    id: '1',
    name: 'Mama Nkechi Kitchen',
    item: 'Jollof Rice Platter × 1',
    items: [{ name: 'Jollof Rice Platter', price: '₦3,500', quantity: 1 }],
    price: '₦3,500',
    time: '20:45',
    status: 'Pending',
    avatar: 'M',
    avatarColor: 'bg-[#FA3728]',
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        type: 'order_card',
        timestamp: '20:44',
        fromBuyer: true,
        orderStatus: 'Pending',
        buyerName: 'Mama Nkechi Kitchen',
        items: [{ name: 'Jollof Rice Platter', price: '₦3,500', quantity: 1 }],
        total: 3500,
      },
    ],
  },
  {
    id: '2',
    name: 'Adaeze M.',
    item: 'African Print Dress × 1',
    items: [{ name: 'African Print Dress', price: '₦28,000', quantity: 1 }],
    price: '₦28,000',
    time: '18:30',
    status: 'Confirmed',
    avatar: 'A',
    avatarColor: 'bg-emerald-500',
    messages: [
      {
        id: 'm1',
        type: 'order_card',
        timestamp: '18:30',
        fromBuyer: true,
        orderStatus: 'Accepted',
        buyerName: 'Adaeze M.',
        items: [{ name: 'African Print Dress', price: '₦28,000', quantity: 1 }],
        total: 28000,
      },
      {
        id: 'm2',
        type: 'text',
        timestamp: '18:32',
        content: "Your order has been confirmed! We'll prepare it for delivery.",
        fromBuyer: false,
      },
    ],
  },
  {
    id: '3',
    name: 'Tunde K.',
    item: 'Basket Set × 2',
    items: [{ name: 'Pattern Basket Set', price: '₦12,500', quantity: 2 }],
    price: '₦25,000',
    time: 'Yesterday',
    status: 'Completed',
    avatar: 'T',
    avatarColor: 'bg-blue-500',
    messages: [
      {
        id: 'm1',
        type: 'order_card',
        timestamp: 'Yesterday',
        fromBuyer: true,
        orderStatus: 'Accepted',
        buyerName: 'Tunde K.',
        items: [{ name: 'Pattern Basket Set', price: '₦12,500', quantity: 2 }],
        total: 25000,
      },
      {
        id: 'm2',
        type: 'text',
        timestamp: 'Yesterday',
        content: 'Order delivered and completed. Thank you!',
        fromBuyer: false,
      },
    ],
  },
];

/* ─────────────── Main Component ─────────────── */
export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('All');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const tabs: OrderStatus[] = ['All', 'Pending', 'Confirmed', 'Completed'];
  const filteredOrders = activeTab === 'All' ? orders : orders.filter((o) => o.status === activeTab);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedOrder?.messages]);

  /* ── Helpers ── */
  const updateConvMsg = (
    orderId: string,
    msgId: string,
    updates: Partial<ConversationMessage>
  ) => {
    const applyTo = (order: Order): Order => ({
      ...order,
      messages: order.messages.map((m) => (m.id === msgId ? { ...m, ...updates } : m)),
    });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? applyTo(o) : o)));
    setSelectedOrder((prev) => (prev?.id === orderId ? applyTo(prev) : prev));
  };

  const appendMsg = (orderId: string, msg: ConversationMessage) => {
    const applyTo = (order: Order): Order => ({
      ...order,
      messages: [...order.messages, msg],
    });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? applyTo(o) : o)));
    setSelectedOrder((prev) => (prev?.id === orderId ? applyTo(prev) : prev));
  };

  /* ── Accept / Decline order ── */
  const handleAccept = (orderId: string, msgId: string) => {
    updateConvMsg(orderId, msgId, { orderStatus: 'Accepted' });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Confirmed' } : o))
    );
    setSelectedOrder((prev) =>
      prev?.id === orderId ? { ...prev, status: 'Confirmed' } : prev
    );
  };

  const handleDecline = (orderId: string, msgId: string) => {
    updateConvMsg(orderId, msgId, { orderStatus: 'Declined' });
  };

  /* ── Set shipping fee → inject shipping_notification card ── */
  const handleSetShippingFee = (orderId: string, msgId: string, fee: number, total: number) => {
    updateConvMsg(orderId, msgId, { orderStatus: 'Shipping Fee Set', shippingFee: fee });
    appendMsg(orderId, {
      id: `shipping-${Date.now()}`,
      type: 'shipping_notification',
      timestamp: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
      fromBuyer: false,
      orderStatus: 'Shipping Fee Set',
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
      <div className="flex flex-col h-[100dvh] bg-[#ece5dd]">
        {/* Header */}
        <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 flex-shrink-0 shadow-sm">
          <button onClick={() => setSelectedOrder(null)} className="p-1 -ml-1 text-gray-600">
            <ArrowLeft size={22} strokeWidth={2} />
          </button>
          <div
            className={`w-10 h-10 rounded-full ${selectedOrder.avatarColor} text-white flex items-center justify-center font-bold text-base flex-shrink-0`}
          >
            {selectedOrder.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{selectedOrder.name}</p>
            <p className="text-xs text-gray-400">Buyer</p>
          </div>
          <button className="p-1 text-gray-400">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-5">
          <div className="flex flex-col gap-3 max-w-3xl mx-auto">
            {selectedOrder.messages.map((msg) => {
              /* fromBuyer = true → left side; fromBuyer = false (vendor) → right side */
              const isSelf = !msg.fromBuyer; // vendor is "self" in this view

              if (msg.type === 'order_card') {
                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                    {/* Buyer avatar on left */}
                    {!isSelf && (
                      <div
                        className={`w-7 h-7 rounded-full ${selectedOrder.avatarColor} text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mb-1`}
                      >
                        {selectedOrder.avatar}
                      </div>
                    )}

                    <div className="max-w-[80%] sm:max-w-[22rem] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      {/* Card header */}
                      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-50">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full ${selectedOrder.avatarColor} text-white flex items-center justify-center text-[10px] font-bold`}
                          >
                            {selectedOrder.avatar}
                          </div>
                          <span className="font-semibold text-gray-900 text-xs">{msg.buyerName}</span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                            msg.orderStatus === 'Accepted' || msg.orderStatus === 'Shipping Fee Set'
                              ? 'bg-emerald-50 text-emerald-600'
                              : msg.orderStatus === 'Declined'
                              ? 'bg-gray-100 text-gray-500'
                              : 'bg-[#FA3728]/10 text-[#FA3728]'
                          }`}
                        >
                          {msg.orderStatus === 'Shipping Fee Set' ? 'Accepted' : msg.orderStatus}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2.5">
                        {msg.items?.map((item, idx) => (
                          <div key={idx} className="flex gap-2.5 items-center">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] text-gray-400 font-medium">IMG</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5">{item.price} × {item.quantity}</p>
                            </div>
                            <p className="text-xs font-bold text-gray-900 flex-shrink-0">{item.price}</p>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="mt-3 pt-2.5 border-t border-gray-50 space-y-1">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Subtotal</span>
                          <span>₦{(msg.total ?? 0).toLocaleString()}</span>
                        </div>
                        {msg.shippingFee !== undefined && (
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Shipping</span>
                            <span>₦{msg.shippingFee.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-bold">
                          <span>Total</span>
                          <span className="text-[#FA3728]">₦{(msg.total ?? 0).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Vendor actions — only when Pending */}
                      {msg.orderStatus === 'Pending' && (
                        <div className="mt-3 flex flex-row gap-2">
                          <button
                            onClick={() => handleAccept(selectedOrder.id, msg.id)}
                            className="flex-1 py-2 bg-[#FA3728] text-white rounded-xl text-[10px] font-bold shadow-sm hover:bg-[#E31B23] flex items-center justify-center gap-1"
                          >
                            <Check size={12} strokeWidth={3} />
                            Accept
                          </button>
                          <button className="flex-1 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-bold shadow-sm hover:bg-amber-600">
                            Modify
                          </button>
                          <button
                            onClick={() => handleDecline(selectedOrder.id, msg.id)}
                            className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-xl text-[10px] font-bold border border-gray-200 hover:bg-gray-100"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {/* Accepted → show shipping fee input */}
                      {msg.orderStatus === 'Accepted' && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-xs font-semibold mb-2 text-gray-700">Set shipping fee (₦):</p>
                          <input
                            type="number"
                            id={`fee-${msg.id}`}
                            placeholder="e.g. 500"
                            className="w-full text-xs p-2.5 rounded-md border border-gray-300 mb-2.5 outline-none focus:border-[#FA3728] text-gray-900"
                          />
                          <button
                            onClick={() => {
                              const fee = parseInt(
                                (document.getElementById(`fee-${msg.id}`) as HTMLInputElement)?.value || '0'
                              );
                              handleSetShippingFee(selectedOrder.id, msg.id, fee, msg.total ?? 0);
                            }}
                            className="w-full py-2 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Truck size={12} className="inline mr-1" />
                            Set Shipping Fee
                          </button>
                        </div>
                      )}

                      {/* Declined */}
                      {msg.orderStatus === 'Declined' && (
                        <div className="mt-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-center">
                          <p className="text-xs font-semibold text-gray-500">Order declined</p>
                        </div>
                      )}

                      {/* Shipping fee set — awaiting payment */}
                      {msg.orderStatus === 'Shipping Fee Set' && (
                        <div className="mt-3 px-3 py-2 bg-amber-50 rounded-lg border border-amber-100 text-center">
                          <p className="text-xs font-semibold text-amber-700">Awaiting payment from buyer</p>
                        </div>
                      )}

                      <p className="text-[10px] mt-2 text-right text-gray-400">{msg.timestamp}</p>
                    </div>
                  </div>
                );
              }

              if (msg.type === 'shipping_notification') {
                /* Always vendor-sent → right side */
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[80%] sm:max-w-[22rem] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                          <Truck size={14} />
                        </div>
                        <p className="text-sm font-bold text-gray-900">Shipping Fee Sent</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 mb-2 space-y-1.5">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Shipping Fee</span>
                          <span className="font-medium text-gray-800">₦{(msg.shippingFee ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                          <span>New Total</span>
                          <span className="text-[#FA3728]">₦{(msg.total ?? 0).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="px-3 py-2 bg-amber-50 rounded-lg border border-amber-100 text-center">
                        <p className="text-xs font-semibold text-amber-700">Awaiting buyer's payment</p>
                      </div>
                      <p className="text-[10px] mt-2 text-right text-gray-400">{msg.timestamp}</p>
                    </div>
                  </div>
                );
              }

              if (msg.type === 'payment_success') {
                return (
                  <div key={msg.id} className="flex justify-start items-end gap-2">
                    <div
                      className={`w-7 h-7 rounded-full ${selectedOrder.avatarColor} text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mb-1`}
                    >
                      {selectedOrder.avatar}
                    </div>
                    <div className="max-w-[75%] sm:max-w-[60%] bg-white rounded-2xl px-4 py-3 shadow-sm border border-emerald-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" strokeWidth={1.5} />
                        <div>
                          <p className="text-sm font-bold text-emerald-800">Payment Received!</p>
                          <p className="text-xs text-gray-500">Buyer has successfully paid for this order</p>
                        </div>
                      </div>
                      <p className="text-[10px] mt-2 text-right text-gray-400">{msg.timestamp}</p>
                    </div>
                  </div>
                );
              }

              /* Text message */
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                  {!isSelf && (
                    <div
                      className={`w-7 h-7 rounded-full ${selectedOrder.avatarColor} text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mb-1`}
                    >
                      {selectedOrder.avatar}
                    </div>
                  )}
                  <div
                    className={`max-w-[72%] sm:max-w-[60%] rounded-2xl px-4 py-2.5 shadow-sm ${
                      isSelf
                        ? 'bg-[#FA3728] text-white rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-1 text-right ${isSelf ? 'text-white/70' : 'text-gray-400'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-100 px-3 sm:px-4 py-3 flex items-center gap-2 flex-shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden focus-within:border-[#FA3728] focus-within:ring-1 focus-within:ring-[#FA3728] transition-all">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="w-full bg-transparent px-5 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="w-[48px] h-[48px] bg-[#FA3728] text-white rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E31B23] transition-colors"
          >
            <Send size={18} strokeWidth={2.5} className="ml-0.5" />
          </button>
        </div>
      </div>
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
            {orders.filter((o) => o.status === 'Pending').length} pending
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
        {filteredOrders.length === 0 ? (
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
                        <span className="text-[10px] md:text-xs font-bold text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full">
                          Completed
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