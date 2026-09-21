'use client';

import { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Loader2, RefreshCcw } from 'lucide-react';
import { authService, ordersService, messagesService, paymentsService } from '@/lib/api';
import type { Order } from '@/lib/api';
import { buildMessagesUI, type Message } from './chat-logic';
import MessageBubble from './MessageBubble';
import PaymentModals from './PaymentModals';

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
  const [actionError, setActionError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ── Payment state ── */
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [bankDetails, setBankDetails] = useState<{bankName: string; accountNumber: string; accountName: string} | null>(null);
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

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push(`/auth/signin?redirect=/chats/${orderId}`);
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

  /* Cleanup poll on unmount */
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

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

      setMessages(buildMessagesUI(fetchedOrder, textThreads, currentUser?.id));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
      setActionError('Failed to send message. Please try again.');
    }
  };

  /* ────────────────────────────────────────────────────────────────────────── */
  /* API WRAPPERS for Order transitions */
  /* ────────────────────────────────────────────────────────────────────────── */

  const handleVendorAccept = async () => {
    setActionError('');
    try { setIsLoading(true); await ordersService.vendorReview(orderId, { accepted: true }); await refreshOrder(); }
    catch(e) { console.error(e); setActionError('Failed to accept order. Please try again.'); setIsLoading(false); }
  };

  const handleVendorDecline = async () => {
    setActionError('');
    try { setIsLoading(true); await ordersService.vendorReview(orderId, { accepted: false, rejection_reason: 'Declined' }); await refreshOrder(); }
    catch(e) { console.error(e); setActionError('Failed to decline order. Please try again.'); setIsLoading(false); }
  };

  const handleSetDeliveryAddress = async (msgId: string | number) => {
    const address = (document.getElementById(`address-${msgId}`) as HTMLInputElement)?.value;
    if (!address) return;
    setActionError('');
    try { setIsLoading(true); await ordersService.setShipping(orderId, { shipping_type: 'delivery', shipping_address: address }); await refreshOrder(); }
    catch(e) { console.error(e); setActionError('Failed to submit delivery details. Please try again.'); setIsLoading(false); }
  };

  const handleSetShippingFee = async (msgId: string | number) => {
    const fee = parseInt((document.getElementById(`fee-${msgId}`) as HTMLInputElement)?.value || '0');
    if (fee <= 0) return;
    setActionError('');
    try { setIsLoading(true); await ordersService.setShippingFee(orderId, fee.toString()); await refreshOrder(); }
    catch(e) { console.error(e); setActionError('Failed to set shipping fee. Please try again.'); setIsLoading(false); }
  };

  const confirmPaymentDecision = async () => {
    try {
      await ordersService.paymentDecision(orderId, { action: 'pay' });
    } catch(e) {
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
    } catch(e) {
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
      const res = await paymentsService.bankTransfer({ transaction_reference: transactionRef }) as Record<string, unknown>;
      setBankDetails({
        bankName: (res.bankName ?? res.bank_name ?? 'Wema Bank') as string,
        accountNumber: (res.accountNumber ?? res.account_number ?? '') as string,
        accountName: (res.accountName ?? res.account_name ?? 'ShopAm') as string,
      });
    } catch(e) {
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
        const status = await paymentsService.getStatus(transactionRef) as Record<string, unknown>;
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
        expiryYear: (expiryYear?.trim() || '').length === 2 ? `20${expiryYear.trim()}` : (expiryYear?.trim() || ''),
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
    if (!otp.every(d => d)) return;
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

      {/* ── Error Banner ── */}
      {actionError && (
        <div className="flex-shrink-0 bg-red-50 border-b border-red-100 px-4 py-2.5 flex items-center justify-between max-w-3xl mx-auto w-full">
          <span className="text-red-600 text-sm">{actionError}</span>
          <button onClick={() => setActionError('')} className="ml-3 font-bold text-red-400 hover:text-red-600 text-lg leading-none">×</button>
        </div>
      )}

      {/* ── Messages ── */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-5 max-w-3xl mx-auto w-full">
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-gray-400" /></div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message, i) => (
              <MessageBubble
                key={`${message.id}-${i}`}
                message={message}
                index={i}
                isVendor={isVendor}
                vendorInitials={vendorInitials}
                onOpenPayment={openPayment}
                onVendorAccept={handleVendorAccept}
                onVendorDecline={handleVendorDecline}
                onSetDeliveryAddress={handleSetDeliveryAddress}
                onSetShippingFee={handleSetShippingFee}
              />
            ))}
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

      <PaymentModals
        showPaymentSheet={showPaymentSheet}
        paymentMethod={paymentMethod}
        bankStep={bankStep}
        bankDetailsLoading={bankDetailsLoading}
        bankDetails={bankDetails}
        cardStep={cardStep}
        cardNumber={cardNumber}
        expiry={expiry}
        cvv={cvv}
        otp={otp}
        isLoading={isLoading}
        payAmount={payAmount}
        otpRefs={otpRefs}
        onBackdropDismiss={() => { if (pollRef.current) clearInterval(pollRef.current); setShowPaymentSheet(false); setPaymentMethod(null); }}
        onCloseMethod={() => { setShowPaymentSheet(false); setPaymentMethod(null); }}
        onSelectCard={() => { setPaymentMethod('card'); setCardStep('details'); }}
        onSelectBank={handleSelectBankTransfer}
        onBackFromBank={() => setPaymentMethod(null)}
        onISentIt={handleISentIt}
        onBankSuccess={handleBankSuccess}
        onCloseCard={() => { setCardStep(null); setPaymentMethod(null); }}
        onBackFromCard={() => setCardStep('details')}
        onCardNumberChange={setCardNumber}
        onExpiryChange={setExpiry}
        onCvvChange={setCvv}
        onCardPay={handleCardPay}
        onOtpChange={handleOtpChange}
        onOtpKeyDown={handleOtpKeyDown}
        onVerifyOtp={handleVerifyOtp}
        onCardSuccess={handleCardSuccess}
      />
    </div>
  );
}
