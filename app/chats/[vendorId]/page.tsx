'use client';

import { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, MapPin, Truck, CreditCard, Building2, X, Check, CheckCircle2, Loader2, RefreshCcw } from 'lucide-react';
import { authService, ordersService, messagesService, paymentsService } from '@/lib/api';
import type { Order } from '@/lib/api';

/* ─────────────── Types ─────────────── */
type MessageItem = {
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Message = {
  id: string | number;
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
  created_at?: string;
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
  const orderId = unwrappedParams.vendorId; // The ID is actually the orderId now!
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isVendor, setIsVendor] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ── Payment state ── */
  const [checkoutId, setCheckoutId] = useState<string>('');
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
      router.push(`/auth/user-signin?redirect=/chats/${orderId}`);
      return;
    }
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setIsVendor(user?.is_vendor || false);
    refreshOrder();
  }, [router, orderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* Cleanup countdown on unmount */
  useEffect(() => () => { if (countdownRef.current) clearInterval(countdownRef.current); }, []);

  const refreshOrder = async () => {
    try {
      setIsLoading(true);
      const fetchedOrder = await ordersService.getOrder(orderId);
      setOrder(fetchedOrder);
      
      // We will also fetch textual thread (between vendor and user).
      // Find the ID of the other user.
      const otherUserId = currentUser?.is_vendor ? fetchedOrder.customer : fetchedOrder.vendor;
      let textThreads: any[] = [];
      try {
        if (otherUserId) {
          textThreads = await messagesService.getThread(otherUserId);
        }
      } catch (err) {
        // Ignored API issue for messages to allow order completion
      }
      
      buildMessagesUI(fetchedOrder, textThreads);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const buildMessagesUI = (o: Order, textThreads: any[]) => {
    const systemMsgs: Message[] = [];
    const vName = o.vendor_name || 'Vendor';
    
    // Evaluate logic for status
    let card1Status = 'Pending'; // 'pending_vendor_review'
    if (['pending_customer_approval', 'awaiting_shipping_details', 'awaiting_payment', 'paid', 'shipped', 'delivered', 'completed'].includes(o.status)) {
      card1Status = 'Accepted';
    }
    if (o.shipping_address) {
      card1Status = 'Delivery Details Set';
    }
    if (o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered') {
      card1Status = 'Paid';
    }

    // Card 1: Order summary
    systemMsgs.push({
      id: 'order_card',
      type: 'order',
      sender: 'user', // customer sent
      vendor: vName,
      status: card1Status,
      items: o.items.map(i => ({
        name: i.product_details.title,
        price: Number(i.product_details.price),
        quantity: i.quantity,
        image: (i.product_details as any).images?.[0]?.image
      })),
      total: Number(o.grand_total) - Number(o.shipping_fee || 0),
      shippingFee: o.shipping_fee ? Number(o.shipping_fee) : undefined,
      time: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      address: o.shipping_address || undefined,
      created_at: o.created_at,
    });

    // Card 2: Shipping Notification
    if (o.shipping_fee && Number(o.shipping_fee) > 0) {
      let shipStatus = 'Awaiting Payment';
      if (['paid', 'shipped', 'delivered', 'completed'].includes(o.status)) {
        shipStatus = 'Paid';
      }
      systemMsgs.push({
        id: 'shipping_card',
        type: 'shipping_notification',
        sender: 'vendor',
        vendor: vName,
        status: shipStatus,
        items: [],
        total: Number(o.grand_total),
        shippingFee: Number(o.shipping_fee),
        time: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        created_at: o.created_at, // Use proper timestamp if available
      });
    }

    // Card 3: Payment Success
    if (['paid', 'shipped', 'delivered', 'completed'].includes(o.status)) {
      systemMsgs.push({
        id: 'payment_success_card',
        type: 'payment_success',
        sender: 'user',
        vendor: vName,
        status: 'Paid',
        items: [],
        total: 0,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        created_at: new Date().toISOString()
      });
    }

    // Append Text Threads
    const textMsgs: Message[] = textThreads.map(msg => ({
      id: msg.id,
      type: 'text' as const,
      sender: msg.sender_id === currentUser?.id ? 'user' : 'vendor',
      vendor: vName,
      status: '',
      items: [],
      total: 0,
      time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: msg.content,
      created_at: msg.created_at,
    }));

    // Sort all by time
    const sorted = [...systemMsgs, ...textMsgs].sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    setMessages(sorted);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !order) return;
    try {
      const otherUserId = isVendor ? order.customer : order.vendor;
      await messagesService.sendMessage({ recipient: otherUserId, content: newMessage });
      setNewMessage('');
      refreshOrder();
    } catch(e) {
      console.error(e);
    }
  };

  /* ────────────────────────────────────────────────────────────────────────── */
  /* API WRAPPERS for Order transitions */
  /* ────────────────────────────────────────────────────────────────────────── */

  const handleVendorAccept = async () => {
    try { setIsLoading(true); await ordersService.vendorReview(orderId, { accepted: true }); await refreshOrder(); } catch(e) { console.error(e); setIsLoading(false);}
  };

  const handleVendorDecline = async () => {
    try { setIsLoading(true); await ordersService.vendorReview(orderId, { accepted: false, rejection_reason: 'Declined' }); await refreshOrder(); } catch(e) { console.error(e); setIsLoading(false);}
  };

  const handleSetDeliveryAddress = async (msgId: string | number) => {
    const address = (document.getElementById(`address-${msgId}`) as HTMLInputElement)?.value;
    if (!address) return;
    try { setIsLoading(true); await ordersService.setShipping(orderId, { shipping_type: 'delivery', shipping_address: address }); await refreshOrder(); } catch(e) { console.error(e); setIsLoading(false);}
  };

  const handleSetShippingFee = async (msgId: string | number) => {
    const fee = parseInt((document.getElementById(`fee-${msgId}`) as HTMLInputElement)?.value || '0');
    if (fee <= 0) return;
    try { setIsLoading(true); await ordersService.setShippingFee(orderId, fee.toString()); await refreshOrder(); } catch(e) { console.error(e); setIsLoading(false);}
  };

  const openPayment = async () => {
    try {
      const res = await paymentsService.initCheckout({ order_id: orderId });
      setCheckoutId((res as any).checkout_id || 'dummy_checkout_id');
      setShowPaymentSheet(true);
      setPaymentMethod(null);
      setCardStep(null);
      setBankStep(null);
    } catch(e) {
      console.error(e);
      alert('Error initializing checkout');
    }
  };

  const handleCardPay = () => {
    if (!cardNumber || !expiry || !cvv) return;
    // Real implementation would submit to stripe/paystack using checkoutId.
    setCardStep('otp');
  };

  const handleVerifyOtp = async () => {
    if (otp.every(d => d)) {
      try {
         setIsLoading(true);
         // Process dummy direct charge via endpoints
         await paymentsService.directCharge({ checkout_id: checkoutId, method: 'card', card_details: { number: cardNumber, expiry_month: '12', expiry_year: '30', cvv } } as any);
         setCardStep('success');
         await refreshOrder();
      } catch (e) {
         console.error(e);
         setIsLoading(false);
      }
    }
  };

  const handleCardSuccess = () => {
    setCardStep(null);
    setPaymentMethod(null);
    setShowPaymentSheet(false);
  };

  const handleISentIt = async () => {
    setBankStep('verifying');
    try {
      await paymentsService.directCharge({ checkout_id: checkoutId, method: 'bank_transfer' } as any);
    } catch (e) {
      console.error(e);
    }
    
    setCountdown(3);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setBankStep('success');
          refreshOrder(); // update order state to paid
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

  /* ────────────────────────────────── RENDER ────────────────────────────────── */
  const vendorName = order?.vendor_name || '...';
  const vendorInitials = vendorName.charAt(0).toUpperCase();
  const payAmount = Number(order?.grand_total || 0);

  return (
    <div className="flex flex-col h-[100dvh] bg-[#ece5dd]">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 flex-shrink-0 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 sm:h-20 gap-4">
            <Link href="/chats" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700">
              <ArrowLeft size={20} />
            </Link>
            <Link href={`/vendors/${order?.vendor || 'new'}`} className="flex items-center gap-3 group flex-1">
              <div className="w-10 h-10 rounded-full bg-[#FA3728]/10 flex items-center justify-center text-[#FA3728] font-bold group-hover:bg-[#FA3728]/20 transition-colors">
                {vendorInitials}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight truncate group-hover:text-[#FA3728] transition-colors">{vendorName}</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Vendor</p>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 rounded-full border border-blue-100">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <button onClick={refreshOrder} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
               <RefreshCcw size={18} className={isLoading ? "animate-spin text-[#FA3728]" : ""} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Messages ── */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-5 max-w-3xl mx-auto w-full">
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-gray-400" /></div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message, i) => {
              const isSelf = message.sender === 'user';
              return (
                <motion.div
                  key={`${message.id}-${i}`}
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
                            onClick={() => openPayment()}
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
                                onClick={handleVendorAccept}
                                className="flex-1 py-2 bg-[#FA3728] text-white rounded-xl text-[10px] font-bold shadow-sm hover:bg-[#E31B23] flex items-center justify-center gap-1"
                              >
                                <Check size={12} strokeWidth={3} /> Accept
                              </button>
                              <button
                                onClick={handleVendorDecline}
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
                                onClick={() => handleSetDeliveryAddress(message.id)}
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
                              onClick={() => handleSetShippingFee(message.id)}
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
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* ── Anchored Message Input ── */}
      <footer className="bg-white border-t border-gray-100 flex-shrink-0 z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3">
          <form onSubmit={handleSendMessage} className="flex items-center gap-1.5">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-[24px] overflow-hidden focus-within:border-[#FA3728] focus-within:ring-1 focus-within:ring-[#FA3728]/20 transition-all">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }
                }}
                placeholder="Type a message..."
                className="w-full bg-transparent px-5 py-3 outline-none resize-none max-h-32 text-[15px] leading-relaxed text-gray-800 placeholder-gray-400"
                rows={1}
                style={{ minHeight: '40px' }}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || isLoading}
              className="w-10 h-10 bg-[#FA3728] text-white rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E31B23] transition-all active:scale-90 shadow-sm"
            >
              <Send size={16} className="translate-x-[1px] translate-y-[-1px]" />
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
                    <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide mb-4">Transfer Details</p>
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

                  <button
                    onClick={handleISentIt}
                    disabled={isLoading}
                    className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-sm transition-all shadow-md flex justify-center items-center"
                  >
                    {isLoading ? <Loader2 className="animate-spin text-white" /> : "I've Sent It"}
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
                  </div>
                </div>
              )}

              {/* ── BANK TRANSFER: Success ── */}
              {paymentMethod === 'bank' && bankStep === 'success' && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Transfer Successful</h3>
                  <button onClick={handleBankSuccess} className="mt-4 w-full py-3 bg-blue-600 text-white rounded-xl font-bold">Done</button>
                </div>
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
                    className="w-full mt-6 py-3.5 bg-[#FA3728] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-[#E31B23] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    Pay ₦{payAmount.toLocaleString()}
                  </button>
                </>
              )}

              {/* ── OTP ── */}
              {cardStep === 'otp' && (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => setCardStep('details')} className="p-1.5 rounded-full hover:bg-gray-100 -ml-2">
                      <ArrowLeft size={18} className="text-gray-600" />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900">Enter OTP</h2>
                  </div>
                  <p className="text-sm text-gray-500 mb-6 text-center">
                    Enter any 6 digits to verify this dummy payment.
                  </p>
                  <div className="flex justify-between gap-2 sm:gap-3 mb-8">
                    {otp.map((d, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={e => handleOtpChange(e.target.value, i)}
                        onKeyDown={e => handleOtpKeyDown(e, i)}
                        className="w-10 h-10 sm:w-12 sm:h-12 border border-gray-200 rounded-xl text-center text-lg font-bold outline-none focus:border-[#FA3728] focus:ring-1 focus:ring-[#FA3728]"
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={!otp.every(d => d) || isLoading}
                    className="w-full py-3.5 bg-[#FA3728] text-white rounded-2xl font-bold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                     {isLoading ? <Loader2 className="animate-spin text-white" /> : "Verify Payment"}
                  </button>
                </>
              )}

              {/* ── Card Success ── */}
              {cardStep === 'success' && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Payment Successful!</h3>
                  <button onClick={handleCardSuccess} className="mt-4 w-full py-3 bg-[#FA3728] text-white rounded-xl font-bold">Done</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
