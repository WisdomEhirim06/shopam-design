'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Info, Loader2, RefreshCcw, Send, ShieldCheck } from 'lucide-react';
import { authService, messagesService, ordersService } from '@/lib/api';
import type { Order } from '@/lib/api';
import { statusLabel } from '@/lib/order-steps';
import OrderProgress from '@/app/components/OrderProgress';
import { buildMessagesUI, type ChatMessage } from './chat-logic';
import MessageBubble from './MessageBubble';

export default function OrderChatPage() {
  const params = useParams();
  const orderId = String(params?.orderId ?? '');
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isVendor, setIsVendor] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!orderId) return;
    const user = authService.getCurrentUser();
    if (!user) {
      router.push(`/auth/signin?redirect=${encodeURIComponent(`/chats/${orderId}`)}`);
      return;
    }
    setCurrentUserId(user.id);
    setIsVendor(Boolean(user.is_vendor));
    void refreshOrder(user.id, Boolean(user.is_vendor));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const refreshOrder = async (userId?: string, vendor: boolean = isVendor) => {
    try {
      setIsLoading(true);
      setError('');
      const fetchedOrder = await ordersService.getOrder(orderId);
      setOrder(fetchedOrder);

      const otherUserId = vendor ? fetchedOrder.customer : fetchedOrder.vendor;
      let threads: { id: string; sender: string; content: string; created_at: string }[] = [];
      try {
        if (otherUserId) threads = (await messagesService.getThread(otherUserId)) as typeof threads;
      } catch {
        /* messages are best-effort */
      }
      setMessages(buildMessagesUI(fetchedOrder, threads, userId ?? currentUserId));
    } catch {
      setError('We could not load this order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !order) return;
    const content = newMessage.trim();
    setNewMessage('');
    try {
      const otherUserId = isVendor ? order.customer : order.vendor;
      await messagesService.sendMessage({ recipient: otherUserId, content });
      await refreshOrder();
    } catch {
      setError('Message failed to send.');
    }
  };

  const handleAcceptChanges = async () => {
    try {
      await ordersService.customerApprove(orderId, { action: 'accept' });
      await refreshOrder();
    } catch {
      setError('Could not accept the changes. Please try again.');
    }
  };

  const handleRequestChanges = () => {
    setNewMessage('Could you please adjust: ');
    inputRef.current?.focus();
  };

  const handleReviewAndPay = () => {
    router.push(`/checkout/${orderId}`);
  };

  const vendorName = order?.vendor_name || 'Vendor';
  const showProgress = useMemo(
    () => Boolean(order) && !['pending_vendor_review', 'cancelled'].includes(order!.status),
    [order]
  );

  if (isLoading && !order) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-canvas">
        <Loader2 className="animate-spin text-[#FA3728]" size={32} />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="flex h-[100dvh] flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
        <p className="text-sm text-slate-500">{error}</p>
        <Link href="/chats" className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-canvas font-sans text-ink antialiased">
      {/* Header */}
      <header className="z-20 flex-shrink-0 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-2xl items-center gap-3 px-4 sm:h-18 sm:px-6">
          <button
            onClick={() => router.push('/chats')}
            aria-label="Back"
            className="flex h-9 w-9 -ml-1 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
              {vendorName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{vendorName}</p>
              <p className="truncate text-[11px] text-slate-400">
                {order ? statusLabel(order.status) : 'Order'}
              </p>
            </div>
          </div>
          <button
            onClick={() => refreshOrder()}
            aria-label="Refresh"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
          >
            <RefreshCcw size={17} className={isLoading ? 'animate-spin text-[#FA3728]' : ''} />
          </button>
        </div>
      </header>

      {/* Tracking */}
      {showProgress && order && (
        <div className="flex-shrink-0 border-b border-slate-200/70 bg-white/70">
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
            <OrderProgress status={order.status} />
          </div>
        </div>
      )}

      {/* Vendor redirect note */}
      {isVendor && (
        <div className="flex-shrink-0 border-b border-amber-200 bg-amber-50">
          <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-2.5 text-[12px] font-medium text-amber-800 sm:px-6">
            <ShieldCheck size={14} />
            Manage accept / modify / reject from your
            <Link href="/dashboard/orders" className="font-bold underline">
              dashboard orders
            </Link>
            .
          </div>
        </div>
      )}

      {error && order && (
        <div className="flex-shrink-0 border-b border-red-100 bg-red-50">
          <div className="mx-auto max-w-2xl px-4 py-2 text-[12px] text-red-600 sm:px-6">{error}</div>
        </div>
      )}

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-3 py-5 sm:px-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {order?.status === 'pending_vendor_review' && (
            <div className="mx-auto flex max-w-md items-start gap-2 rounded-2xl bg-white px-4 py-3 text-[12px] leading-relaxed text-slate-500 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70">
              <Info size={15} className="mt-0.5 shrink-0 text-[#FA3728]" />
              The seller will confirm availability and delivery cost before you pay.
            </div>
          )}

          {messages.map((message, i) => (
            <MessageBubble
              key={`${message.id}-${i}`}
              message={message}
              index={i}
              isVendor={isVendor}
              vendorName={vendorName}
              onAcceptChanges={handleAcceptChanges}
              onRequestChanges={handleRequestChanges}
              onReviewAndPay={handleReviewAndPay}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Composer */}
      <footer className="z-20 flex-shrink-0 border-t border-slate-200/70 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-3 py-3 sm:px-4">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <div className="flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 transition-all focus-within:border-ink focus-within:bg-white">
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void handleSendMessage(e);
                  }
                }}
                placeholder="Type a message…"
                rows={1}
                className="max-h-32 w-full resize-none bg-transparent px-5 py-3 text-[15px] leading-relaxed text-ink outline-none placeholder:text-slate-400"
                style={{ minHeight: '44px' }}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              aria-label="Send"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-all hover:bg-[#FA3728] active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
