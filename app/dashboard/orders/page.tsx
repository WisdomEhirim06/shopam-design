'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, MoreVertical, Check, X, Send } from 'lucide-react';

type OrderStatus = 'All' | 'Pending' | 'Confirmed' | 'Completed';

interface OrderItem {
  name: string;
  price: string;
  quantity: number;
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

interface ConversationMessage {
  id: string;
  type: 'order_card' | 'text';
  timestamp: string;
  orderStatus?: 'Pending' | 'Accepted' | 'Declined';
  // for order_card
  buyerName?: string;
  items?: OrderItem[];
  total?: string;
  // for text
  content?: string;
  fromBuyer?: boolean;
}

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
        orderStatus: 'Pending',
        buyerName: 'Mama Nkechi Kitchen',
        items: [{ name: 'Jollof Rice Platter', price: '₦3,500', quantity: 1 }],
        total: '₦3,500',
      },
      {
        id: 'm2',
        type: 'order_card',
        timestamp: '20:45',
        orderStatus: 'Pending',
        buyerName: 'Mama Nkechi Kitchen',
        items: [{ name: 'Jollof Rice Platter', price: '₦3,500', quantity: 1 }],
        total: '₦3,500',
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
        orderStatus: 'Accepted',
        buyerName: 'Adaeze M.',
        items: [{ name: 'African Print Dress', price: '₦28,000', quantity: 1 }],
        total: '₦28,000',
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
        orderStatus: 'Accepted',
        buyerName: 'Tunde K.',
        items: [{ name: 'Pattern Basket Set', price: '₦12,500', quantity: 2 }],
        total: '₦25,000',
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

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('All');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const tabs: OrderStatus[] = ['All', 'Pending', 'Confirmed', 'Completed'];

  const filteredOrders =
    activeTab === 'All' ? orders : orders.filter((o) => o.status === activeTab);

  const handleAccept = (orderId: string, messageId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status: 'Confirmed' as OrderStatus,
          messages: order.messages.map((msg) =>
            msg.id === messageId ? { ...msg, orderStatus: 'Accepted' as const } : msg
          ),
        };
      })
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: 'Confirmed',
              messages: prev.messages.map((msg) =>
                msg.id === messageId ? { ...msg, orderStatus: 'Accepted' } : msg
              ),
            }
          : null
      );
    }
  };

  const handleDecline = (orderId: string, messageId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status: 'Pending' as OrderStatus,
          messages: order.messages.map((msg) =>
            msg.id === messageId ? { ...msg, orderStatus: 'Declined' as const } : msg
          ),
        };
      })
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              messages: prev.messages.map((msg) =>
                msg.id === messageId ? { ...msg, orderStatus: 'Declined' } : msg
              ),
            }
          : null
      );
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedOrder) return;
    const newMsg: ConversationMessage = {
      id: `m${Date.now()}`,
      type: 'text',
      timestamp: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
      content: messageInput.trim(),
      fromBuyer: false,
    };
    const updated = {
      ...selectedOrder,
      messages: [...selectedOrder.messages, newMsg],
    };
    setSelectedOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? updated : o)));
    setMessageInput('');
  };

  // ─── Conversation Detail View ───────────────────────────────────────────────
  if (selectedOrder) {
    return (
      <div className="flex flex-col h-screen max-h-screen bg-gray-50 md:h-auto md:max-h-none md:min-h-[85vh]">
        {/* Conversation Header */}
        <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 flex-shrink-0">
          <button
            onClick={() => setSelectedOrder(null)}
            className="p-1 -ml-1 text-gray-600"
          >
            <ArrowLeft size={22} strokeWidth={2} />
          </button>

          <div
            className={`w-10 h-10 rounded-full ${selectedOrder.avatarColor} text-white flex items-center justify-center font-bold text-base flex-shrink-0`}
          >
            {selectedOrder.avatar}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm leading-tight">
              {selectedOrder.name}
            </p>
            <p className="text-xs text-gray-400">Buyer</p>
          </div>

          <button className="p-1 text-gray-400">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {selectedOrder.messages.map((msg) => {
            if (msg.type === 'order_card') {
              const isPending = msg.orderStatus === 'Pending';
              const isAccepted = msg.orderStatus === 'Accepted';
              const isDeclined = msg.orderStatus === 'Declined';

              return (
                <div key={msg.id} className="space-y-1">
                  {/* timestamp */}
                  <p className="text-center text-[11px] text-gray-400 mb-2">{msg.timestamp}</p>

                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-w-sm mx-auto">
                    {/* Order card header */}
                    <div className="flex items-center justify-between px-4 pt-4 pb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-full ${selectedOrder.avatarColor} text-white flex items-center justify-center font-bold text-xs`}
                        >
                          {selectedOrder.avatar}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {msg.buyerName}
                        </span>
                      </div>
                      {isPending && (
                        <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      )}
                      {isAccepted && (
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Accepted
                        </span>
                      )}
                      {isDeclined && (
                        <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          Declined
                        </span>
                      )}
                    </div>

                    {/* Items */}
                    <div className="px-4 pb-3 space-y-2">
                      {msg.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] text-gray-400 font-medium">IMG</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {item.price} × {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-gray-900">{item.price}</p>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Total</span>
                      <span className="text-base font-bold text-gray-900">{msg.total}</span>
                    </div>

                    {/* Action buttons — only shown when Pending */}
                    {isPending && (
                      <div className="grid grid-cols-2 border-t border-gray-100">
                        <button
                          onClick={() => handleDecline(selectedOrder.id, msg.id)}
                          className="flex items-center justify-center gap-1.5 py-3.5 text-sm font-semibold text-gray-500 border-r border-gray-100"
                        >
                          <X size={15} strokeWidth={2.5} />
                          Decline
                        </button>
                        <button
                          onClick={() => handleAccept(selectedOrder.id, msg.id)}
                          className="flex items-center justify-center gap-1.5 py-3.5 text-sm font-semibold text-[#FA3728]"
                        >
                          <Check size={15} strokeWidth={2.5} />
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // Text message
            return (
              <div
                key={msg.id}
                className={`flex ${msg.fromBuyer ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.fromBuyer
                      ? 'bg-white border border-gray-100 text-gray-900 rounded-tl-sm'
                      : 'bg-[#FA3728] text-white rounded-tr-sm'
                  }`}
                >
                  {msg.content}
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.fromBuyer ? 'text-gray-400' : 'text-white/70'
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none border border-gray-200 focus:border-gray-300"
          />
          <button
            onClick={handleSendMessage}
            className="w-10 h-10 bg-[#FA3728] rounded-full flex items-center justify-center text-white flex-shrink-0"
          >
            <Send size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  }

  // ─── Orders List View ────────────────────────────────────────────────────────
  return (
    <div className="px-4 py-2 md:p-8 space-y-6 max-w-lg mx-auto md:max-w-none">
      {/* Header Area */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
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

      {/* Segmented Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full"
      >
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

      {/* Orders List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3 pb-8"
      >
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 font-medium">No orders found.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer"
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
                    <span className="text-xs text-gray-400 whitespace-nowrap font-medium">
                      {order.time}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex flex-col">
                      <p className="text-xs md:text-sm text-gray-500 truncate mb-1">
                        {order.item}
                      </p>
                      <span className="font-bold text-gray-900 text-sm md:text-base">
                        {order.price}
                      </span>
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