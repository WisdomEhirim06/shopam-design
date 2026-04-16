'use client';

import { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, MapPin, Truck, CreditCard, Building2, X, CheckCircle2, Loader2 } from 'lucide-react';
import { authService } from '@/lib/api';

/* ─────────────── Types ─────────────── */
type MessageItem = {
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Message = {
  id: number;
  type: 'order' | 'text' | 'shipping_notification' | 'payment_success';
  sender: 'user' | 'vendor';
  vendor: string;
  status: string;
  items: MessageItem[];
  total: number;
  shippingFee?: number;
  deliveryOption?: string;
  address?: string;
  time: string;
  text?: string;
};

/* ─────────────── Card Input Helpers ─────────────── */
function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

/* ─────────────── Main Component ─────────────── */
export default function VendorChatPage({ params }: { params: Promise<{ vendorId: string }> }) {
  const unwrappedParams = use(params);
  const vendorId = unwrappedParams.vendorId;
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'order',
      sender: 'user',
      vendor: 'Mama Nkechi Kitchen',
      status: 'Pending',
      items: [
        {
          name: 'Jollof Rice Platter',
          price: 3500,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=600'
        }
      ],
      total: 3500,
      time: '20:44'
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isVendor, setIsVendor] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ── Payment state ── */
  const [paymentTargetId, setPaymentTargetId] = useState<number | null>(null);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | null>(null);

  /* Card dialog */
  const [cardStep, setCardStep] = useState<'details' | 'otp' | 'success' | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* Bank transfer */
  const [bankStep, setBankStep] = useState<'details' | 'verifying' | 'success' | null>(null);
  const [countdown, setCountdown] = useState(30);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push(`/auth/user-signin?redirect=/chats/${vendorId}`);
      return;
    }
    const currentUser = authService.getCurrentUser();
    setIsVendor(currentUser?.is_vendor || false);
  }, [router, vendorId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* Cleanup countdown on unmount */
  useEffect(() => () => { if (countdownRef.current) clearInterval(countdownRef.current); }, []);

  const vendorName = vendorId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const vendorInitials = vendorId.charAt(0).toUpperCase();

  const updateMsg = (msgId: number, newStatus: string, updates: Partial<Message> = {}) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: newStatus, ...updates } : m));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'text',
      sender: 'user',
      vendor: vendorName,
      status: '',
      items: [],
      total: 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: newMessage
    }]);
    setNewMessage('');
  };

  /* ── Shipping fee set → inject notification card from vendor ── */
  const handleSetShippingFee = (msgId: number, fee: number, total: number) => {
    updateMsg(msgId, 'Shipping Fee Set', { shippingFee: fee, total: total + fee });
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'shipping_notification',
      sender: 'vendor',
      vendor: vendorName,
      status: 'Awaiting Payment',
      items: [],
      total: total + fee,
      shippingFee: fee,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  /* ── Open payment sheet ── */
  const openPayment = (msgId: number) => {
    setPaymentTargetId(msgId);
    setShowPaymentSheet(true);
    setPaymentMethod(null);
    setCardStep(null);
    setBankStep(null);
  };

  /* ── Decline shipping ── */
  const handleDeclineShipping = (msgId: number) => {
    updateMsg(msgId, 'Declined');
  };

  /* ── Card payment ── */
  const handleCardPay = () => {
    if (!cardNumber || !expiry || !cvv) return;
    setCardStep('otp');
  };

  const handleOtpChange = (val: string, idx: number) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleVerifyOtp = () => {
    if (otp.every(d => d)) setCardStep('success');
  };

  const handleCardSuccess = () => {
    setCardStep(null);
    setPaymentMethod(null);
    setShowPaymentSheet(false);
    injectPaymentSuccess();
  };

  /* ── Bank transfer ── */
  const handleISentIt = () => {
    setBankStep('verifying');
    setCountdown(30);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setBankStep('success');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBankSuccess = () => {
    setBankStep(null);
    setPaymentMethod(null);
    setShowPaymentSheet(false);
    injectPaymentSuccess();
  };

  /* ── Inject success message into chat ── */
  const injectPaymentSuccess = () => {
    if (paymentTargetId) updateMsg(paymentTargetId, 'Paid');
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'payment_success',
      sender: 'user',
      vendor: vendorName,
      status: 'Paid',
      items: [],
      total: 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  /* ── Get pay amount for a target message ── */
  const payAmount = paymentTargetId ? messages.find(m => m.id === paymentTargetId)?.total ?? 0 : 0;

  /* ────────────────────────────────── RENDER ────────────────────────────────── */
  return (
    <div className="flex flex-col h-[100dvh] bg-[#ece5dd]">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 flex-shrink-0 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 sm:h-20 gap-4">
            <Link href="/chats" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FA3728]/10 flex items-center justify-center text-[#FA3728] font-bold">
                {vendorInitials}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight truncate">{vendorName}</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Vendor</p>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 rounded-full border border-blue-100">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">✓</span>
                    </div>
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Messages ── */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-5 max-w-3xl mx-auto w-full">
        <div className="flex flex-col gap-3">
          {messages.map((message) => {
            const isSelf = message.sender === 'user';
            return (
              <motion.div
                key={message.id}
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
                    <p className={`text-[10px] mt-2 text-right text-gray-400`}>{message.time}</p>
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
                          onClick={() => openPayment(message.id)}
                          className="w-full py-2.5 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-xl font-semibold text-sm transition-all shadow-sm"
                        >
                          Proceed to Pay
                        </button>
                        <button
                          onClick={() => handleDeclineShipping(message.id)}
                          className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm transition-all border border-gray-200"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {message.status === 'Awaiting Payment' && isVendor && (
                      <div className="px-3 py-2 bg-amber-50 rounded-lg border border-amber-100 text-center">
                        <p className="text-xs font-semibold text-amber-700">Awaiting payment from buyer</p>
                      </div>
                    )}

                    {message.status === 'Declined' && (
                      <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-center">
                        <p className="text-xs font-semibold text-gray-500">Order was declined by buyer</p>
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
                    {/* Card header */}
                    <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#FA3728]/10 text-[#FA3728] flex items-center justify-center text-[10px] font-bold">
                          {vendorInitials}
                        </div>
                        <span className="font-semibold text-gray-900 text-xs">{message.vendor}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                        message.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#FA3728]/10 text-[#FA3728]'
                      }`}>
                        {message.status}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="space-y-2.5">
                      {message.items.map((item, index) => (
                        <div key={index} className="flex gap-2.5 items-center">
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

                    {/* Totals */}
                    <div className="mt-3 pt-2.5 border-t border-gray-50 space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Subtotal</span>
                        <span>₦{message.items.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString()}</span>
                      </div>
                      {message.shippingFee !== undefined && (
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Shipping</span>
                          <span>₦{message.shippingFee.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold">
                        <span>Total</span>
                        <span className="text-[#FA3728]">₦{message.total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* ── State: Pending ── */}
                    {message.status === 'Pending' && (
                      <div className="mt-3">
                        {isVendor ? (
                          <div className="flex flex-col gap-1.5">
                            <button onClick={() => updateMsg(message.id, 'Accepted')} className="w-full py-2 bg-[#FA3728] text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-[#E31B23]">Accept</button>
                            <div className="flex gap-1.5">
                              <button className="flex-1 py-2 bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-amber-600">Modify</button>
                              <button className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold border hover:bg-gray-100">Decline</button>
                            </div>
                          </div>
                        ) : (
                          <div className="px-3 py-2 bg-amber-50 rounded-lg border border-amber-100 text-center">
                            <p className="text-xs font-semibold text-amber-800">Awaiting vendor confirmation</p>
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
                              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 bg-white text-gray-700 rounded-md text-xs font-semibold">
                                <MapPin size={12} /> Pickup
                              </button>
                            </div>
                            <input
                              type="text"
                              id={`address-${message.id}`}
                              placeholder="Enter delivery address"
                              className="w-full text-xs p-2.5 rounded-md border border-gray-300 mb-2.5 outline-none focus:border-[#FA3728] text-gray-900"
                            />
                            <button
                              onClick={() => {
                                const address = (document.getElementById(`address-${message.id}`) as HTMLInputElement)?.value;
                                updateMsg(message.id, 'Delivery Details Set', { deliveryOption: 'Delivery', address });
                              }}
                              className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold transition-colors"
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
                              {message.address || 'User Address'}
                            </div>
                            <p className="text-xs font-semibold mb-2 text-gray-700">Set shipping fee (₦):</p>
                            <input
                              type="number"
                              id={`fee-${message.id}`}
                              placeholder="e.g. 500"
                              className="w-full text-xs p-2.5 rounded-md border border-gray-300 mb-2.5 outline-none focus:border-[#FA3728] text-gray-900"
                            />
                            <button
                              onClick={() => {
                                const fee = parseInt((document.getElementById(`fee-${message.id}`) as HTMLInputElement)?.value || '0');
                                handleSetShippingFee(message.id, fee, message.total);
                              }}
                              className="w-full py-2 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-lg text-xs font-semibold transition-colors"
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
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* ── Input ── */}
      <footer className="bg-white border-t border-gray-100 p-3 sm:p-4 flex-shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-10">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden focus-within:border-[#FA3728] focus-within:ring-1 focus-within:ring-[#FA3728] transition-all">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }
                }}
                placeholder="Type a message..."
                className="w-full bg-transparent px-5 py-3.5 outline-none resize-none max-h-32 text-sm text-gray-800 placeholder-gray-400"
                rows={1}
                style={{ minHeight: '52px' }}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="w-[52px] h-[52px] bg-[#FA3728] text-white rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E31B23] transition-colors"
            >
              <Send size={20} className="ml-1" />
            </button>
          </form>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════
          PAYMENT BOTTOM SHEET
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPaymentSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => { setShowPaymentSheet(false); setPaymentMethod(null); }}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl px-5 pt-4 pb-10 max-w-lg mx-auto"
            >
              {/* Handle */}
              <div className="w-10 h-1.5 rounded-full bg-gray-200 mx-auto mb-5" />

              {!paymentMethod && (
                <>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Choose Payment Method</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Total: <span className="font-bold text-[#FA3728]">₦{payAmount.toLocaleString()}</span>
                  </p>

                  {/* Stacked horizontal cards */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => { setPaymentMethod('card'); setCardStep('details'); }}
                      className="flex items-center gap-4 w-full p-4 border-2 border-gray-100 rounded-2xl hover:border-[#FA3728] hover:bg-[#FA3728]/5 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#FA3728]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FA3728]/15">
                        <CreditCard size={22} className="text-[#FA3728]" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-900 text-sm">Card Payment</p>
                        <p className="text-xs text-gray-500 mt-0.5">Credit or Debit card</p>
                      </div>
                      <div className="ml-auto text-gray-300 group-hover:text-[#FA3728] transition-colors">›</div>
                    </button>

                    <button
                      onClick={() => { setPaymentMethod('bank'); setBankStep('details'); }}
                      className="flex items-center gap-4 w-full p-4 border-2 border-gray-100 rounded-2xl hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100">
                        <Building2 size={22} className="text-blue-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-900 text-sm">Bank Transfer</p>
                        <p className="text-xs text-gray-500 mt-0.5">Transfer via Monnify</p>
                      </div>
                      <div className="ml-auto text-gray-300 group-hover:text-blue-400 transition-colors">›</div>
                    </button>
                  </div>
                </>
              )}

              {/* ── BANK TRANSFER: Details ── */}
              {paymentMethod === 'bank' && bankStep === 'details' && (
                <>
                  <div className="flex items-center gap-2 mb-5">
                    <button onClick={() => setPaymentMethod(null)} className="p-1.5 rounded-full hover:bg-gray-100">
                      <ArrowLeft size={18} className="text-gray-600" />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900">Bank Transfer</h2>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-5">
                    <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide mb-4">Transfer Details (Monnify)</p>
                    <div className="space-y-3">
                      {[
                        { label: 'Bank Name', value: 'Wema Bank' },
                        { label: 'Account Number', value: '8012345678' },
                        { label: 'Account Name', value: 'ShopAm / ' + vendorName },
                        { label: 'Amount', value: `₦${payAmount.toLocaleString()}` },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-xs text-gray-500">{label}</span>
                          <span className={`text-xs font-bold ${label === 'Amount' ? 'text-[#FA3728]' : 'text-gray-900'}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 text-center mb-5">
                    Transfer exactly <span className="font-bold text-gray-700">₦{payAmount.toLocaleString()}</span> to the account above, then tap the button below.
                  </p>

                  <button
                    onClick={handleISentIt}
                    className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-sm transition-all shadow-md"
                  >
                    I've Sent It
                  </button>
                </>
              )}

              {/* ── BANK TRANSFER: Verifying ── */}
              {paymentMethod === 'bank' && bankStep === 'verifying' && (
                <div className="flex flex-col items-center py-6 gap-5">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                    <Loader2 size={80} className="text-blue-400 animate-spin absolute inset-0" strokeWidth={1.5} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-black text-blue-600">{countdown}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900 text-base">Verifying Transfer…</p>
                    <p className="text-sm text-gray-400 mt-1">Please wait while we confirm your payment</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-400 rounded-full"
                      initial={{ width: '100%' }}
                      animate={{ width: `${(countdown / 30) * 100}%` }}
                      transition={{ duration: 1, ease: 'linear' }}
                    />
                  </div>
                </div>
              )}

              {/* ── BANK TRANSFER: Success ── */}
              {paymentMethod === 'bank' && bankStep === 'success' && (
                <SuccessPanel amount={payAmount} onDone={handleBankSuccess} />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          CARD PAYMENT DIALOGS
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {paymentMethod === 'card' && cardStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 sm:pb-6 max-h-[90dvh] overflow-y-auto"
            >
              {/* ── Card Details ── */}
              {cardStep === 'details' && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Card Payment</h2>
                    <button
                      onClick={() => { setCardStep(null); setPaymentMethod(null); }}
                      className="p-1.5 rounded-full hover:bg-gray-100"
                    >
                      <X size={18} className="text-gray-500" />
                    </button>
                  </div>

                  {/* Card visual */}
                  <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-[#FA3728] to-[#c0290e] p-5 mb-6 relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-10 translate-x-10" />
                    <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/10 translate-y-10 -translate-x-5" />
                    <p className="text-white/60 text-xs font-medium mb-2">CARD NUMBER</p>
                    <p className="text-white font-mono text-lg tracking-widest">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </p>
                    <div className="absolute bottom-5 left-5 right-5 flex justify-between text-white text-xs">
                      <span>{expiry || 'MM/YY'}</span>
                      <span className="font-bold text-base tracking-widest">CVV: {cvv ? '•••' : '•••'}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1.5">Card Number</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono tracking-wider outline-none focus:border-[#FA3728] focus:ring-1 focus:ring-[#FA3728] transition-all"
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">Expiry Date</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={5}
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={e => setExpiry(formatExpiry(e.target.value))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-[#FA3728] focus:ring-1 focus:ring-[#FA3728] transition-all"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">CVV</label>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={3}
                          placeholder="•••"
                          value={cvv}
                          onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-[#FA3728] focus:ring-1 focus:ring-[#FA3728] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCardPay}
                    disabled={!cardNumber || !expiry || !cvv}
                    className="mt-6 w-full py-3.5 bg-[#FA3728] hover:bg-[#E31B23] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm transition-all shadow-md"
                  >
                    Pay ₦{payAmount.toLocaleString()}
                  </button>
                </>
              )}

              {/* ── OTP ── */}
              {cardStep === 'otp' && (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => setCardStep('details')} className="p-1.5 rounded-full hover:bg-gray-100">
                      <ArrowLeft size={18} className="text-gray-600" />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900">Enter OTP</h2>
                  </div>

                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#FA3728]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📱</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">We sent a 6-digit code to your registered phone number</p>
                    <p className="text-xs text-gray-400 mt-1">Enter the code below to verify your payment</p>
                  </div>

                  {/* 6-digit OTP boxes */}
                  <div className="flex gap-2.5 justify-center mb-8">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => { otpRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(e.target.value, idx)}
                        onKeyDown={e => handleOtpKeyDown(e, idx)}
                        className={`w-11 h-13 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all ${
                          digit ? 'border-[#FA3728] bg-[#FA3728]/5 text-[#FA3728]' : 'border-gray-200 text-gray-900'
                        } focus:border-[#FA3728]`}
                        style={{ height: '52px' }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={!otp.every(d => d)}
                    className="w-full py-3.5 bg-[#FA3728] hover:bg-[#E31B23] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm transition-all shadow-md"
                  >
                    Verify OTP
                  </button>
                </>
              )}

              {/* ── Card Success ── */}
              {cardStep === 'success' && (
                <SuccessPanel amount={payAmount} onDone={handleCardSuccess} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────── Success Panel (shared) ─────────────── */
function SuccessPanel({ amount, onDone }: { amount: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex flex-col items-center py-6 gap-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 200 }}
        className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center"
      >
        <CheckCircle2 size={48} className="text-emerald-500" strokeWidth={1.5} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <p className="text-xl font-black text-gray-900">Payment Successful!</p>
        <p className="text-2xl font-black text-[#FA3728] mt-1">₦{amount.toLocaleString()}</p>
        <p className="text-sm text-gray-400 mt-2">Your order has been confirmed</p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onDone}
        className="mt-4 px-10 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm transition-all shadow-md"
      >
        Done
      </motion.button>
    </div>
  );
}
