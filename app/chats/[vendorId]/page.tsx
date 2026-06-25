'use client';

import { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, Lock, Truck, CreditCard, Building2,
  X, Check, CheckCircle2, Loader2, RefreshCcw, Hand,
} from 'lucide-react';
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
  const orderId = unwrappedParams.vendorId;
  const router = useRouter();

  /* ── WebSocket & real-time state ── */
  const ws = useRef<WebSocket | null>(null);
  const [isVendorTyping, setIsVendorTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Track sent message IDs so the WebSocket echo of our own message
   * doesn't re-trigger buildMessagesUI unnecessarily.
   * BUG FIXED: without this, sending a message caused two redundant
   * thread-fetches running concurrently and overwriting each other.
   */
  const seenMessageIds = useRef<Set<string | number>>(new Set());

  /* ── Core state ── */
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isVendor, setIsVendor] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ── Payment state ── */
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [bankDetails, setBankDetails] = useState<{
    bankName: string;
    accountNumber: string;
    accountName: string;
  } | null>(null);
  const [bankDetailsLoading, setBankDetailsLoading] = useState(false);
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
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // ── 1. Initial boot ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push(`/auth/signin?redirect=/chats/${orderId}`);
      return;
    }
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        if (user) {
          setIsVendor(user?.is_vendor || false);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
    refreshOrder();
  }, [router, orderId]);

  // ── 2. WebSocket lifecycle ───────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser || !order) return;

    const otherUserId = currentUser.is_vendor ? order.customer : order.vendor;
    if (!otherUserId) return;

    // Close any socket left open from a previous order
    if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
      ws.current.close(1000, 're-connecting');
    }

    // 1. Get the session ID from your auth cookie
    const match = document.cookie.match(/(?:^|;\s*)sessionid=([^;]*)/);
    const sessionId = match ? decodeURIComponent(match[1]) : '';

    // 2. Connect directly to the ECS backend domain, bypassing Next.js proxy
    const backendDomain = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || 'api.shopam.net'; 
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    const socket = new WebSocket(
  `${wsProtocol}//${backendDomain}/ws/chat/${otherUserId}/?session_id=${sessionId}`
);
    ws.current = socket


    socket.onopen = () => {
      // Connection established — ready for events
    };

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'typing') {
        setIsVendorTyping(data.is_typing);
        // Failsafe: auto-hide the indicator after 3 s in case the stop event drops
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        if (data.is_typing) {
          typingTimeoutRef.current = setTimeout(() => setIsVendorTyping(false), 3000);
        }

      } else if (data.type === 'read_receipt') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.message_id ? { ...msg, status: 'read' } : msg
          )
        );

      } else if (data.type === 'chat_message') {
        // BUG FIXED: the original handler called refreshOrder() here, which
        // re-fetched the entire order + rebuilt the UI on every incoming
        // message. This was expensive, reset scroll position, and cleared the
        // typing indicator state mid-animation.
        //
        // Fix: only re-fetch the text thread (lightweight), then rebuild just
        // the message list. If the server echoes our own message back, skip it.
        const incomingId = data.message?.id;
        if (incomingId && seenMessageIds.current.has(incomingId)) return;

        if (order) {
          try {
            const freshThread = await messagesService.getThread(otherUserId);
            buildMessagesUI(order, freshThread);
          } catch { /* transient — ignore */ }
        }
      }
    };

    // BUG FIXED: there were no onerror / onclose handlers at all.
    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    socket.onclose = (event) => {
      if (event.code !== 1000) {
        console.warn(`WebSocket closed unexpectedly (code ${event.code})`);
      }
    };

    return () => {
      // BUG FIXED: the original cleanup only closed the socket but never
      // cleared typingTimeoutRef, so the typing indicator could fire stale
      // updates after leaving the page.
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      setIsVendorTyping(false);
      socket.close(1000, 'component unmounted');
    };
  }, [currentUser, order]);

  // ── 3. Auto-scroll ───────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isVendorTyping]);

  /* Cleanup poll on unmount */
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  // ── Data fetching ────────────────────────────────────────────────────────

  const refreshOrder = async () => {
    try {
      setIsLoading(true);
      const fetchedOrder = await ordersService.getOrder(orderId);
      setOrder(fetchedOrder);

      const otherUserId = currentUser?.is_vendor ? fetchedOrder.customer : fetchedOrder.vendor;
      let textThreads: any[] = [];
      try {
        if (otherUserId) {
          textThreads = await messagesService.getThread(otherUserId);
        }
      } catch (err) {
        // Ignored — text thread is non-critical
      }

      buildMessagesUI(fetchedOrder, textThreads);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const buildMessagesUI = (o: Order, textThreads: any[]) => {
    // ... (Your existing buildMessagesUI logic remains here unchanged) ...
  };

  // ── 4. Typing indicator emitter ──────────────────────────────────────────

  const handleTypingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ action: 'typing', is_typing: e.target.value.length > 0 })
      );
    }
  };

  // ── 5. Send message ──────────────────────────────────────────────────────

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !order) return;

    const otherUserId = isVendor ? order.customer : order.vendor;

    // Stop typing indicator on the other side before the message lands
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: 'typing', is_typing: false }));
    }

    try {
      const sent = await messagesService.sendMessage({
        recipient: otherUserId,
        content: newMessage,
      });
      setNewMessage('');

      // BUG FIXED: the original code called refreshOrder() after sending,
      // which re-fetched the entire order. This was wasteful and also caused
      // a duplicate render when the WS echo arrived moments later.
      //
      // Fix: mark the ID as seen so the WS handler skips it, then fetch only
      // the text thread and rebuild the message list.
      seenMessageIds.current.add(sent.id);
      const freshThread = await messagesService.getThread(otherUserId);
      buildMessagesUI(order, freshThread);
    } catch (err) {
      console.error(err);
      setActionError('Failed to send message. Please try again.');
    }
  };

  /* ─────────────────────────────────────────────────────────────────────── */
  /* API wrappers for order state transitions                                */
  /* ─────────────────────────────────────────────────────────────────────── */

  const handleVendorAccept = async () => {
    setActionError('');
    try {
      setIsLoading(true);
      await ordersService.vendorReview(orderId, { accepted: true });
      await refreshOrder();
    } catch (e) {
      console.error(e);
      setActionError('Failed to accept order. Please try again.');
      setIsLoading(false);
    }
  };

  const handleVendorDecline = async () => {
    setActionError('');
    try {
      setIsLoading(true);
      await ordersService.vendorReview(orderId, { accepted: false, rejection_reason: 'Declined' });
      await refreshOrder();
    } catch (e) {
      console.error(e);
      setActionError('Failed to decline order. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSetDeliveryAddress = async (msgId: string | number) => {
    const address = (document.getElementById(`address-${msgId}`) as HTMLInputElement)?.value;
    if (!address) return;
    setActionError('');
    try {
      setIsLoading(true);
      await ordersService.setShipping(orderId, {
        shipping_type: 'delivery',
        shipping_address: address,
      });
      await refreshOrder();
    } catch (e) {
      console.error(e);
      setActionError('Failed to submit delivery details. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSetShippingFee = async (msgId: string | number) => {
    const fee = parseInt(
      (document.getElementById(`fee-${msgId}`) as HTMLInputElement)?.value || '0'
    );
    if (fee <= 0) return;
    setActionError('');
    try {
      setIsLoading(true);
      await ordersService.setShippingFee(orderId, fee.toString());
      await refreshOrder();
    } catch (e) {
      console.error(e);
      setActionError('Failed to set shipping fee. Please try again.');
      setIsLoading(false);
    }
  };

  const confirmPaymentDecision = async () => {
    try {
      await ordersService.paymentDecision(orderId, { action: 'pay' });
    } catch (e) {
      console.error('paymentDecision error (non-fatal):', e);
    }
  };

  const openPayment = async () => {
    setActionError('');
    try {
      const res = await paymentsService.initCheckout({ order_id: orderId });
      setTransactionRef(res.transaction_reference);
      setShowPaymentSheet(true);
      setPaymentMethod(null);
      setCardStep(null);
      setBankStep(null);
      setBankDetails(null);
    } catch (e) {
      console.error(e);
      setActionError('Failed to initialize payment. Please try again.');
    }
  };

  const handleSelectBankTransfer = async () => {
    setPaymentMethod('bank');
    setBankStep('details');
    setBankDetails(null);
    setBankDetailsLoading(true);
    try {
      const res = (await paymentsService.bankTransfer({
        transaction_reference: transactionRef,
      })) as Record<string, unknown>;
      setBankDetails({
        bankName: (res.bankName ?? res.bank_name ?? 'Wema Bank') as string,
        accountNumber: (res.accountNumber ?? res.account_number ?? '') as string,
        accountName: (res.accountName ?? res.account_name ?? 'ShopAm') as string,
      });
    } catch (e) {
      console.error(e);
      setActionError('Failed to get transfer details. Please try again.');
      setPaymentMethod(null);
      setBankStep(null);
    } finally {
      setBankDetailsLoading(false);
    }
  };

  const handleISentIt = async () => {
    setBankStep('verifying');
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const status = (await paymentsService.getStatus(transactionRef)) as Record<string, unknown>;
        const paid =
          status?.paymentStatus === 'PAID' ||
          status?.status === 'PAID' ||
          status?.status === 'successful';
        if (paid) {
          clearInterval(pollRef.current!);
          await confirmPaymentDecision();
          setBankStep('success');
          refreshOrder();
        }
      } catch {
        // keep polling — transient errors are expected
      }
    }, 5000);
  };

  const handleBankSuccess = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setBankStep(null);
    setPaymentMethod(null);
    setShowPaymentSheet(false);
  };

  const handleCardPay = async () => {
    if (!cardNumber || !expiry || !cvv) return;
    setActionError('');
    try {
      setIsLoading(true);
      const [expiryMonth, expiryYear] = expiry.split('/');
      await paymentsService.directCharge({
        transaction_reference: transactionRef,
        number: cardNumber.replace(/\s/g, ''),
        expiryMonth: expiryMonth?.trim() || '',
        expiryYear:
          (expiryYear?.trim() || '').length === 2
            ? `20${expiryYear.trim()}`
            : expiryYear?.trim() || '',
        cvv,
      });
      setCardStep('success');
    } catch (err: any) {
      const needsOTP =
        err.response?.data?.responseMessage?.toLowerCase().includes('otp') ||
        err.response?.data?.type === 'OTP_REQUIRED' ||
        err.response?.status === 400;
      if (needsOTP) {
        setCardStep('otp');
      } else {
        setActionError('Card payment failed. Please check your details and try again.');
      }
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.every((d) => d)) return;
    setActionError('');
    try {
      setIsLoading(true);
      await paymentsService.authorizeOTP({
        transaction_reference: transactionRef,
        token_id: 'otp',
        token: otp.join(''),
      });
      setCardStep('success');
    } catch (e) {
      console.error(e);
      setActionError('OTP verification failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCardSuccess = async () => {
    await confirmPaymentDecision();
    setCardStep(null);
    setPaymentMethod(null);
    setShowPaymentSheet(false);
    refreshOrder();
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
            <Link
              href="/chats"
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
            >
              <ArrowLeft size={20} />
            </Link>
            <Link
              href={`/vendors/${order?.vendor || 'new'}`}
              className="flex items-center gap-3 group flex-1"
            >
              <div className="w-10 h-10 rounded-full bg-[#FA3728]/10 flex items-center justify-center text-[#FA3728] font-bold group-hover:bg-[#FA3728]/20 transition-colors">
                {vendorInitials}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight truncate group-hover:text-[#FA3728] transition-colors">
                  {vendorName}
                </h1>
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
            <button
              onClick={refreshOrder}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            >
              <RefreshCcw size={18} className={isLoading ? 'animate-spin text-[#FA3728]' : ''} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Error Banner ── */}
      {actionError && (
        <div className="flex-shrink-0 bg-red-50 border-b border-red-100 px-4 py-2.5 flex items-center justify-between max-w-3xl mx-auto w-full">
          <span className="text-red-600 text-sm">{actionError}</span>
          <button
            onClick={() => setActionError('')}
            className="ml-3 font-bold text-red-400 hover:text-red-600 text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* ── Messages ── */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-5 max-w-3xl mx-auto w-full">
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center mt-10">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
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
                  {/* Vendor avatar */}
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
                      <p
                        className={`text-[10px] mt-1 text-right ${
                          isSelf ? 'text-white/70' : 'text-gray-400'
                        }`}
                      >
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
                    /* ── Shipping fee notification card ── */
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
                          <span className="font-medium text-gray-800">
                            ₦{(message.shippingFee ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                          <span>Total to Pay</span>
                          <span className="text-[#FA3728]">₦{message.total.toLocaleString()}</span>
                        </div>
                      </div>

                      {message.status === 'Awaiting Payment' && !isVendor && (
                        <button
                          onClick={() => openPayment()}
                          className="w-full py-2.5 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-xl font-semibold text-sm transition-all shadow-sm flex justify-center items-center gap-2"
                        >
                          Proceed to Pay
                        </button>
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
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                            message.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-[#FA3728]/10 text-[#FA3728]'
                          }`}
                        >
                          {message.status}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {message.items.map((item, index) => (
                          <div key={index} className="flex gap-2.5 items-center">
                            {item.image ? (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-xs truncate">{item.name}</h4>
                              <p className="text-gray-400 text-[11px] mt-0.5">
                                ₦{item.price.toLocaleString()} × {item.quantity}
                              </p>
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
                          <span>
                            ₦{message.items.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString()}
                          </span>
                        </div>
                        {message.shippingFee !== undefined && (
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Shipping</span>
                            <span>₦{message.shippingFee.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-bold pt-0.5">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">
                            ₦{(message.total + (message.shippingFee || 0)).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* State: Pending */}
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
                              <p className="text-xs font-semibold text-amber-800 tracking-tight">
                                Awaiting vendor confirmation
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* State: Accepted */}
                      {message.status === 'Accepted' && (
                        <div className="mt-3">
                          {isVendor ? (
                            <div className="px-3 py-2 bg-blue-50 rounded-lg border border-blue-100 text-center">
                              <p className="text-xs font-semibold text-blue-800">
                                Awaiting buyer delivery details
                              </p>
                            </div>
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                              <p className="text-xs font-semibold mb-2 text-gray-700">
                                Select fulfillment method
                              </p>
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

                      {/* State: Delivery Details Set */}
                      {message.status === 'Delivery Details Set' && (
                        <div className="mt-3">
                          {isVendor ? (
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                              <div className="mb-2.5 text-xs text-gray-600 bg-white p-2 rounded border border-gray-100">
                                <span className="font-semibold text-gray-800">Delivery Address:</span>
                                <br />
                                {message.address}
                              </div>
                              <p className="text-xs font-semibold mb-2 text-gray-700">
                                Set shipping fee (₦):
                              </p>
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
                              <p className="text-xs font-semibold text-blue-800">
                                Awaiting shipping fee from vendor
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* State: Paid */}
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

            {/* BUG FIXED: isVendorTyping was rendered as plain unstyled text
                `<div className="text-sm text-gray-400 italic mb-2">Typing...</div>`.
                Replaced with an animated three-dot bubble that matches the
                style of the chat bubbles above. */}
            {isVendorTyping && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-[#FA3728]/10 flex items-center justify-center text-[#FA3728] font-bold text-xs flex-shrink-0 mb-1">
                  {vendorInitials}
                </div>
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <span className="flex gap-1 items-center h-3">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}

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
                onChange={handleTypingChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
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
          PAYMENT MODAL — method selection + bank transfer
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPaymentSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-end sm:items-center justify-center sm:px-4 bg-black/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                if (pollRef.current) clearInterval(pollRef.current);
                setShowPaymentSheet(false);
                setPaymentMethod(null);
              }
            }}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sm:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1.5 rounded-full bg-gray-200" />
              </div>

              <div className="px-6 pt-4 pb-[max(env(safe-area-inset-bottom),24px)] sm:pb-8">

                {/* Method Selection */}
                {!paymentMethod && (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-xl font-bold text-gray-900">Pay for Order</h2>
                      <button
                        onClick={() => { setShowPaymentSheet(false); setPaymentMethod(null); }}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X size={18} className="text-gray-500" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                      Total due:{' '}
                      <span className="font-bold text-[#FA3728] text-base">
                        ₦{payAmount.toLocaleString()}
                      </span>
                    </p>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => { setPaymentMethod('card'); setCardStep('details'); }}
                        className="flex items-center gap-4 w-full p-4 border-2 border-gray-100 rounded-2xl hover:border-[#FA3728] hover:bg-[#FA3728]/5 active:scale-[0.98] transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#FA3728]/10 flex items-center justify-center flex-shrink-0">
                          <CreditCard size={22} className="text-[#FA3728]" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-bold text-gray-900 text-sm">Card Payment</p>
                          <p className="text-xs text-gray-500 mt-0.5">Debit or credit card</p>
                        </div>
                        <span className="text-gray-300 group-hover:text-[#FA3728] text-lg transition-colors">›</span>
                      </button>

                      <button
                        onClick={handleSelectBankTransfer}
                        className="flex items-center gap-4 w-full p-4 border-2 border-gray-100 rounded-2xl hover:border-blue-400 hover:bg-blue-50/50 active:scale-[0.98] transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Building2 size={22} className="text-blue-500" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-bold text-gray-900 text-sm">Bank Transfer</p>
                          <p className="text-xs text-gray-500 mt-0.5">Transfer to a virtual account</p>
                        </div>
                        <span className="text-gray-300 group-hover:text-blue-400 text-lg transition-colors">›</span>
                      </button>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-5 flex items-center justify-center gap-1.5">
                      <Lock size={11} />
                      Secured by Monnify
                    </p>
                  </>
                )}

                {/* Bank Transfer: Loading */}
                {paymentMethod === 'bank' && bankStep === 'details' && bankDetailsLoading && (
                  <div className="flex flex-col items-center justify-center py-10 gap-4">
                    <Loader2 size={32} className="animate-spin text-blue-500" />
                    <p className="text-sm text-gray-500">Generating transfer details…</p>
                  </div>
                )}

                {/* Bank Transfer: Details */}
                {paymentMethod === 'bank' && bankStep === 'details' && !bankDetailsLoading && bankDetails && (
                  <>
                    <div className="flex items-center gap-3 mb-5">
                      <button
                        onClick={() => setPaymentMethod(null)}
                        className="p-2 rounded-full hover:bg-gray-100 -ml-2 transition-colors"
                      >
                        <ArrowLeft size={18} className="text-gray-600" />
                      </button>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">Bank Transfer</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Transfer the exact amount below</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-5">
                      <p className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mb-4">
                        Transfer to this account
                      </p>
                      <div className="space-y-3.5">
                        {[
                          { label: 'Bank', value: bankDetails.bankName },
                          { label: 'Account Number', value: bankDetails.accountNumber, mono: true },
                          { label: 'Account Name', value: bankDetails.accountName },
                          { label: 'Amount', value: `₦${payAmount.toLocaleString()}`, highlight: true },
                        ].map(({ label, value, mono, highlight }) => (
                          <div key={label} className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{label}</span>
                            <span
                              className={`text-sm font-bold ${highlight ? 'text-[#FA3728]' : 'text-gray-900'} ${
                                mono ? 'font-mono tracking-wider' : ''
                              }`}
                            >
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5 text-xs text-amber-700 font-medium">
                      Transfer the exact amount. This account expires in 30 minutes.
                    </div>

                    <button
                      onClick={handleISentIt}
                      className="w-full py-4 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white rounded-2xl font-bold text-sm transition-all shadow-md"
                    >
                      I've Sent the Transfer
                    </button>
                  </>
                )}

                {/* Bank Transfer: Verifying */}
                {paymentMethod === 'bank' && bankStep === 'verifying' && (
                  <div className="flex flex-col items-center py-10 gap-5 text-center">
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                      <Loader2 size={80} className="text-blue-400 animate-spin absolute inset-0" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">Confirming Transfer…</p>
                      <p className="text-sm text-gray-500 mt-1">
                        This may take a minute. Do not close this screen.
                      </p>
                    </div>
                  </div>
                )}

                {/* Bank Transfer: Success */}
                {paymentMethod === 'bank' && bankStep === 'success' && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-5">
                      <CheckCircle2 size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Payment Confirmed!</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Your transfer has been received and the order is now in progress.
                    </p>
                    <button
                      onClick={handleBankSuccess}
                      className="w-full py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-2xl font-bold text-sm transition-all"
                    >
                      Done
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          CARD PAYMENT MODAL
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {paymentMethod === 'card' && cardStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-4 bg-black/60"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setCardStep(null);
                setPaymentMethod(null);
              }
            }}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90dvh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sm:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1.5 rounded-full bg-gray-200" />
              </div>

              <div className="px-6 pt-4 pb-[max(env(safe-area-inset-bottom),24px)] sm:pb-8">

                {/* Card Details */}
                {cardStep === 'details' && (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Card Payment</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Total:{' '}
                          <span className="font-bold text-[#FA3728]">₦{payAmount.toLocaleString()}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => { setCardStep(null); setPaymentMethod(null); }}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X size={18} className="text-gray-500" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                          Card Number
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={19}
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-mono tracking-wider outline-none focus:border-[#FA3728] focus:ring-2 focus:ring-[#FA3728]/20 transition-all"
                        />
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-xs font-semibold text-gray-600 block mb-1.5">Expiry</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={5}
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-mono outline-none focus:border-[#FA3728] focus:ring-2 focus:ring-[#FA3728]/20 transition-all"
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
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-mono outline-none focus:border-[#FA3728] focus:ring-2 focus:ring-[#FA3728]/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleCardPay}
                      disabled={!cardNumber || !expiry || !cvv || isLoading}
                      className="w-full mt-6 py-4 bg-[#FA3728] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-[#E31B23] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                    >
                      {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        `Pay ₦${payAmount.toLocaleString()}`
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
                      <Lock size={11} />
                      Secured by Monnify
                    </p>
                  </>
                )}

                {/* OTP */}
                {cardStep === 'otp' && (
                  <>
                    <div className="flex items-center gap-3 mb-5">
                      <button
                        onClick={() => setCardStep('details')}
                        className="p-2 rounded-full hover:bg-gray-100 -ml-2 transition-colors"
                      >
                        <ArrowLeft size={18} className="text-gray-600" />
                      </button>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Enter OTP</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Check your phone or email for the code</p>
                      </div>
                    </div>

                    <div className="flex justify-between gap-2 sm:gap-3 mb-8">
                      {otp.map((d, i) => (
                        <input
                          key={i}
                          ref={(el) => { otpRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={d}
                          onChange={(e) => handleOtpChange(e.target.value, i)}
                          onKeyDown={(e) => handleOtpKeyDown(e, i)}
                          className="w-11 h-14 sm:w-12 sm:h-14 border-2 border-gray-200 rounded-xl text-center text-xl font-bold outline-none focus:border-[#FA3728] focus:ring-2 focus:ring-[#FA3728]/20 transition-all text-gray-900"
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleVerifyOtp}
                      disabled={!otp.every((d) => d) || isLoading}
                      className="w-full py-4 bg-[#FA3728] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-[#E31B23] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                    >
                      {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Pay'}
                    </button>
                  </>
                )}

                {/* Card Success */}
                {cardStep === 'success' && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-5">
                      <CheckCircle2 size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Payment Successful!</h3>
                    <p className="text-sm text-gray-500 mb-6">Your order is now confirmed and in progress.</p>
                    <button
                      onClick={handleCardSuccess}
                      disabled={isLoading}
                      className="w-full py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-2xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Done'}
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}