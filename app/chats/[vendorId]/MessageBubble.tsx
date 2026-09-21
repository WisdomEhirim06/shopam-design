'use client';

import { motion } from 'framer-motion';
import { Truck, Check, CheckCircle2 } from 'lucide-react';
import type { Message } from './chat-logic';

export default function MessageBubble({
  message,
  index,
  isVendor,
  vendorInitials,
  onOpenPayment,
  onVendorAccept,
  onVendorDecline,
  onSetDeliveryAddress,
  onSetShippingFee,
}: {
  message: Message;
  index: number;
  isVendor: boolean;
  vendorInitials: string;
  onOpenPayment: () => void;
  onVendorAccept: () => void;
  onVendorDecline: () => void;
  onSetDeliveryAddress: (msgId: string | number) => void;
  onSetShippingFee: (msgId: string | number) => void;
}) {
  const isSelf = message.sender === 'user';

  return (
    <motion.div
      key={`${message.id}-${index}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 ${isSelf ? 'justify-end' : 'justify-start'}`}
    >
      {/* Vendor avatar on left */}
      {!isSelf && (
        <div className="w-7 h-7 rounded-full bg-[#FA3728]/10 flex items-center justify-center text-[#FA3728] font-bold text-xs flex-shrink-0 mb-1">
          {vendorInitials}
        </div>
      )}

      {message.type === 'text' ? (
        /* ── Text bubble ── */
        <div
          className={`max-w-[72%] sm:max-w-[60%] rounded-2xl px-4 py-2.5 shadow-sm ${
            isSelf
              ? 'bg-[#FA3728] text-white rounded-br-sm'
              : 'bg-white text-gray-800 rounded-bl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
          <p className={`text-[10px] mt-1 text-right ${isSelf ? 'text-white/70' : 'text-gray-400'}`}>
            {message.time}
          </p>
        </div>

      ) : message.type === 'payment_success' ? (
        /* ── Payment success chat card ── */
        <div className="max-w-[75%] sm:max-w-[60%] bg-white rounded-2xl px-4 py-3 shadow-sm border border-emerald-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-base">
              🎉
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800">Payment Successful!</p>
              <p className="text-xs text-gray-500">Buyer has successfully purchased this order</p>
            </div>
          </div>
          <p className="text-[10px] mt-2 text-right text-gray-400">{message.time}</p>
        </div>

      ) : message.type === 'shipping_notification' ? (
        /* ── Shipping fee notification card (vendor → buyer) ── */
        <div className="max-w-[80%] sm:max-w-[22rem] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
              <Truck size={14} />
            </div>
            <p className="text-sm font-bold text-gray-900">Shipping Fee Set</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-1.5">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Shipping Fee</span>
              <span className="font-medium text-gray-800">₦{(message.shippingFee ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span>Total to Pay</span>
              <span className="text-[#FA3728]">₦{message.total.toLocaleString()}</span>
            </div>
          </div>

          {message.status === 'Awaiting Payment' && !isVendor && (
            <div className="flex flex-col gap-2">
              <button
                onClick={onOpenPayment}
                className="w-full py-2.5 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-xl font-semibold text-sm transition-all shadow-sm flex justify-center items-center gap-2"
              >
                Proceed to Pay
              </button>
            </div>
          )}

          {message.status === 'Awaiting Payment' && isVendor && (
            <div className="px-3 py-2 bg-amber-50 rounded-lg border border-amber-100 text-center">
              <p className="text-xs font-semibold text-amber-700">Awaiting payment from buyer</p>
            </div>
          )}

          {message.status === 'Paid' && (
            <div className="px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
              <p className="text-xs font-semibold text-emerald-700">✓ Payment received</p>
            </div>
          )}

          <p className="text-[10px] mt-2 text-right text-gray-400">{message.time}</p>
        </div>

      ) : (
        /* ── Order Card ── */
        <div className="max-w-[80%] sm:max-w-[22rem] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-50">
            <span className="font-bold text-gray-900 text-xs">Order Summary</span>
            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
              message.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#FA3728]/10 text-[#FA3728]'
            }`}>
              {message.status}
            </span>
          </div>

          <div className="space-y-2.5">
            {message.items.map((item, idx) => (
              <div key={idx} className="flex gap-2.5 items-center">
                {item.image ? (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-xs truncate">{item.name}</h4>
                  <p className="text-gray-400 text-[11px] mt-0.5">₦{item.price.toLocaleString()} × {item.quantity}</p>
                </div>
                <div className="font-bold text-gray-900 text-xs flex-shrink-0">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-50 space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Subtotal</span>
              <span>₦{message.items.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString()}</span>
            </div>
            {message.shippingFee !== undefined && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>Shipping</span>
                <span>₦{message.shippingFee.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold pt-0.5">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">₦{(message.total + (message.shippingFee || 0)).toLocaleString()}</span>
            </div>
          </div>

          {/* ── State: Pending ── */}
          {message.status === 'Pending' && (
            <div className="mt-3">
              {isVendor ? (
                <div className="flex flex-row gap-2">
                  <button
                    onClick={onVendorAccept}
                    className="flex-1 py-2 bg-[#FA3728] text-white rounded-xl text-[10px] font-bold shadow-sm hover:bg-[#E31B23] flex items-center justify-center gap-1"
                  >
                    <Check size={12} strokeWidth={3} /> Accept
                  </button>
                  <button
                    onClick={onVendorDecline}
                    className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-xl text-[10px] font-bold border border-gray-200 hover:bg-gray-100"
                  >
                    Decline
                  </button>
                </div>
              ) : (
                <div className="px-3 py-3.5 bg-amber-50 rounded-lg border border-amber-100 text-center">
                  <p className="text-xs font-semibold text-amber-800 tracking-tight">Awaiting vendor confirmation</p>
                </div>
              )}
            </div>
          )}

          {/* ── State: Accepted ── */}
          {message.status === 'Accepted' && (
            <div className="mt-3">
              {isVendor ? (
               <div className="px-3 py-2 bg-blue-50 rounded-lg border border-blue-100 text-center">
                <p className="text-xs font-semibold text-blue-800">Awaiting buyer delivery details</p>
               </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-semibold mb-2 text-gray-700">Select fulfillment method</p>
                  <div className="flex gap-2 mb-2.5">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#FA3728] text-white rounded-md text-xs font-semibold">
                      <Truck size={12} /> Delivery
                    </button>
                  </div>
                  <input
                    type="text"
                    id={`address-${message.id}`}
                    placeholder="Enter delivery address"
                    className="w-full text-xs p-2.5 rounded-md border border-gray-300 mb-2.5 outline-none focus:border-[#FA3728] text-gray-900"
                  />
                  <button
                    onClick={() => onSetDeliveryAddress(message.id)}
                    className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold transition-colors flex justify-center"
                  >
                    Submit Details
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── State: Delivery Details Set ── */}
          {message.status === 'Delivery Details Set' && (
            <div className="mt-3">
             {isVendor ? (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="mb-2.5 text-xs text-gray-600 bg-white p-2 rounded border border-gray-100">
                  <span className="font-semibold text-gray-800">Delivery Address:</span><br />
                  {message.address}
                </div>
                <p className="text-xs font-semibold mb-2 text-gray-700">Set shipping fee (₦):</p>
                <input
                  type="number"
                  id={`fee-${message.id}`}
                  placeholder="e.g. 500"
                  className="w-full text-xs p-2.5 rounded-md border border-gray-300 mb-2.5 outline-none focus:border-[#FA3728] text-gray-900"
                />
                <button
                  onClick={() => onSetShippingFee(message.id)}
                  className="w-full py-2 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-lg text-xs font-semibold transition-colors flex justify-center"
                >
                  Set Shipping Fee
                </button>
              </div>
             ) : (
              <div className="px-3 py-2 bg-blue-50 rounded-lg border border-blue-100 text-center">
                <p className="text-xs font-semibold text-blue-800">Awaiting shipping fee from vendor</p>
              </div>
             )}
            </div>
          )}

          {/* ── State: Paid ── */}
          {message.status === 'Paid' && (
            <div className="mt-3 px-3 py-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <p className="text-xs font-bold text-emerald-800">
                {isVendor ? 'Payment Received' : 'Payment Sent'}
              </p>
            </div>
          )}

          <p className="text-[10px] mt-2 text-right text-gray-400">{message.time}</p>
        </div>
      )}
    </motion.div>
  );
}
