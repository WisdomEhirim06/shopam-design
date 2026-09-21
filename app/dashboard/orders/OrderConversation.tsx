'use client';

import { useEffect, useRef } from 'react';
import { ArrowLeft, Send, Check, X, Truck, CheckCircle2, MoreVertical } from 'lucide-react';
import type { UIOrder } from './order-transform';

interface OrderConversationProps {
  order: UIOrder;
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  convError: string;
  onConvErrorChange: (value: string) => void;
  onBack: () => void;
  onStartDelivery: (orderId: string) => void;
  onAccept: (orderId: string, msgId: string) => void;
  onDecline: (orderId: string, msgId: string) => void;
  onSetShippingFee: (orderId: string, msgId: string, fee: number, total: number) => void;
  onSendMessage: () => void;
}

export default function OrderConversation({
  order,
  messageInput,
  onMessageInputChange,
  convError,
  onConvErrorChange,
  onBack,
  onStartDelivery,
  onAccept,
  onDecline,
  onSetShippingFee,
  onSendMessage,
}: OrderConversationProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [order.messages]);

  return (
    <div className="flex flex-col h-[100dvh] bg-[#ece5dd]">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 flex-shrink-0 shadow-sm">
        <button onClick={onBack} className="p-1 -ml-1 text-gray-600">
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div
          className={`w-10 h-10 rounded-full ${order.avatarColor} text-white flex items-center justify-center font-bold text-base flex-shrink-0`}
        >
          {order.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{order.name}</p>
          <p className="text-xs text-gray-400">Buyer</p>
        </div>
        <button className="p-1 text-gray-400">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Error Banner */}
      {convError && (
        <div className="flex-shrink-0 bg-red-50 border-b border-red-100 px-4 py-2.5 flex items-center justify-between">
          <span className="text-red-600 text-sm">{convError}</span>
          <button onClick={() => onConvErrorChange('')} className="ml-3 font-bold text-red-400 hover:text-red-600 text-lg leading-none">×</button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-5">
        <div className="flex flex-col gap-3 max-w-3xl mx-auto">
          {order.messages.map((msg) => {
            const isSelf = !msg.fromBuyer;

            if (msg.type === 'order_card') {
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                  {!isSelf && (
                    <div
                      className={`w-7 h-7 rounded-full ${order.avatarColor} text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mb-1`}
                    >
                      {order.avatar}
                    </div>
                  )}

                  <div className="max-w-[80%] sm:max-w-[22rem] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    {/* Card header */}
                    <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full ${order.avatarColor} text-white flex items-center justify-center text-[10px] font-bold`}
                        >
                          {order.avatar}
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

                    {/* Totals */}
                    <div className="mt-3 pt-2.5 border-t border-gray-50 space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Subtotal</span>
                        <span>₦{(msg.total ?? 0).toLocaleString('en-NG')}</span>
                      </div>
                      {msg.shippingFee !== undefined && (
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Shipping</span>
                          <span>₦{msg.shippingFee.toLocaleString('en-NG')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold">
                        <span>Total</span>
                        <span className="text-[#FA3728]">₦{(msg.total ?? 0).toLocaleString('en-NG')}</span>
                      </div>
                    </div>

                    {/* Vendor actions — only for pending_vendor_review */}
                    {msg.orderStatus === 'Pending' && (
                      <div className="mt-3 flex flex-row gap-2">
                        <button
                          onClick={() => onAccept(order.id, msg.id)}
                          className="flex-1 py-2 bg-[#FA3728] text-white rounded-xl text-[10px] font-bold shadow-sm hover:bg-[#E31B23] flex items-center justify-center gap-1"
                        >
                          <Check size={12} strokeWidth={3} />
                          Accept
                        </button>
                        <button className="flex-1 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-bold shadow-sm hover:bg-amber-600">
                          Modify
                        </button>
                        <button
                          onClick={() => onDecline(order.id, msg.id)}
                          className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-xl text-[10px] font-bold border border-gray-200 hover:bg-gray-100"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {/* Accepted → shipping fee input (Step 5) */}
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
                            onSetShippingFee(order.id, msg.id, fee, msg.total ?? 0);
                          }}
                          className="w-full py-2 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Truck size={12} className="inline mr-1" />
                          Set Shipping Fee
                        </button>
                      </div>
                    )}

                    {msg.orderStatus === 'Declined' && (
                      <div className="mt-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-center">
                        <p className="text-xs font-semibold text-gray-500">Order declined</p>
                      </div>
                    )}

                    {msg.orderStatus === 'Shipping Fee Set' && order.apiStatus === 'awaiting_payment' && (
                      <div className="mt-3 px-3 py-2 bg-amber-50 rounded-lg border border-amber-100 text-center">
                        <p className="text-xs font-semibold text-amber-700">Awaiting payment from buyer</p>
                      </div>
                    )}

                    {msg.orderStatus === 'Shipping Fee Set' && order.apiStatus === 'paid' && (
                      <div className="mt-3">
                        <button
                          onClick={() => onStartDelivery(order.id)}
                          className="w-full py-2 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-lg text-xs font-semibold transition-colors flex justify-center items-center gap-1"
                        >
                          <Truck size={12} className="inline mr-1" />
                          Mark as Shipped
                        </button>
                      </div>
                    )}

                    {msg.orderStatus === 'Shipped' && (
                      <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100 text-center">
                        <p className="text-xs font-semibold text-blue-700">Order shipped — awaiting buyer confirmation</p>
                      </div>
                    )}

                    <p className="text-[10px] mt-2 text-right text-gray-400">{msg.timestamp}</p>
                  </div>
                </div>
              );
            }

            if (msg.type === 'shipping_notification') {
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
                        <span className="font-medium text-gray-800">₦{(msg.shippingFee ?? 0).toLocaleString('en-NG')}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold">
                        <span>New Total</span>
                        <span className="text-[#FA3728]">₦{(msg.total ?? 0).toLocaleString('en-NG')}</span>
                      </div>
                    </div>
                    <div className="px-3 py-2 bg-amber-50 rounded-lg border border-amber-100 text-center">
                      <p className="text-xs font-semibold text-amber-700">Awaiting buyer&apos;s payment</p>
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
                    className={`w-7 h-7 rounded-full ${order.avatarColor} text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mb-1`}
                  >
                    {order.avatar}
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
                    className={`w-7 h-7 rounded-full ${order.avatarColor} text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mb-1`}
                  >
                    {order.avatar}
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
            onChange={(e) => onMessageInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="Type a message..."
            className="w-full bg-transparent px-5 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
        </div>
        <button
          onClick={onSendMessage}
          disabled={!messageInput.trim()}
          className="w-[48px] h-[48px] bg-[#FA3728] text-white rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E31B23] transition-colors"
        >
          <Send size={18} strokeWidth={2.5} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
}
