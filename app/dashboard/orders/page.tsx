'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { ordersService } from '@/lib/api/services';
import { transformOrder, type UIOrder, type UIOrderStatus, type ConversationMessage } from './order-transform';
import OrderConversation from './OrderConversation';
import ModifyOrderModal, { type ModifyChanges } from './ModifyOrderModal';
import RejectOrderModal from './RejectOrderModal';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<UIOrderStatus>('All');
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<UIOrder | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [convError, setConvError] = useState('');
  const [modifyTarget, setModifyTarget] = useState<UIOrder | null>(null);
  const [rejectTarget, setRejectTarget] = useState<UIOrder | null>(null);

  const tabs: UIOrderStatus[] = ['All', 'Pending', 'Confirmed', 'Completed'];

  const refresh = useCallback(async (keepId?: string) => {
    try {
      const data = await ordersService.getVendorOrders();
      const list = data.results.map(transformOrder);
      setOrders(list);
      if (keepId) setSelectedOrder(list.find((o) => o.id === keepId) ?? null);
    } catch {
      /* keep the current list on error */
    }
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await refresh();
      setIsLoading(false);
    })();
  }, [refresh]);

  /** Run an action, then re-read the order so the timeline reflects reality. */
  const run = async (action: () => Promise<unknown>, id: string, errorMessage: string) => {
    setConvError('');
    try {
      await action();
    } catch {
      setConvError(errorMessage);
    }
    await refresh(id);
  };

  const handleAccept = (id: string) => run(() => ordersService.acceptOrder(id), id, 'Failed to accept order. Please try again.');
  const handleSetShippingFee = (id: string, fee: number) => run(() => ordersService.setShippingFee(id, fee.toFixed(2)), id, 'Failed to set the delivery fee.');
  const handleStartDelivery = (id: string) => run(() => ordersService.startDelivery(id), id, 'Failed to mark as shipped.');
  const handleResolveDispute = (id: string, resolution: string) => run(() => ordersService.resolveDispute(id, resolution), id, 'Failed to resolve the dispute.');

  const openModify = (id: string) => setModifyTarget(orders.find((o) => o.id === id) ?? selectedOrder);
  const openReject = (id: string) => setRejectTarget(orders.find((o) => o.id === id) ?? selectedOrder);

  const handleModifySave = async (changes: ModifyChanges) => {
    if (!modifyTarget) return;
    await run(
      () => ordersService.modifyOrder(modifyTarget.id, changes as unknown as Record<string, unknown>),
      modifyTarget.id,
      'Failed to send changes. Please try again.'
    );
    setModifyTarget(null);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectTarget) return;
    await run(
      () => ordersService.rejectOrder(rejectTarget.id, reason),
      rejectTarget.id,
      'Failed to decline the order.'
    );
    setRejectTarget(null);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedOrder) return;
    const message: ConversationMessage = {
      id: `m${Date.now()}`,
      type: 'text',
      timestamp: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
      content: messageInput.trim(),
      fromBuyer: false,
    };
    setSelectedOrder((prev) => (prev ? { ...prev, messages: [...prev.messages, message] } : prev));
    setMessageInput('');
  };

  const filteredOrders = activeTab === 'All' ? orders : orders.filter((o) => o.status === activeTab);

  /* ── Conversation view ── */
  if (selectedOrder) {
    return (
      <>
        <OrderConversation
          order={selectedOrder}
          messageInput={messageInput}
          onMessageInputChange={setMessageInput}
          convError={convError}
          onConvErrorChange={setConvError}
          onBack={() => setSelectedOrder(null)}
          onStartDelivery={handleStartDelivery}
          onAccept={handleAccept}
          onModify={openModify}
          onReject={openReject}
          onSetShippingFee={handleSetShippingFee}
          onResolveDispute={handleResolveDispute}
          onSendMessage={handleSendMessage}
        />

        <AnimatePresence>
          {modifyTarget && (
            <ModifyOrderModal
              order={modifyTarget}
              onClose={() => setModifyTarget(null)}
              onSave={handleModifySave}
            />
          )}
          {rejectTarget && (
            <RejectOrderModal
              onClose={() => setRejectTarget(null)}
              onConfirm={handleRejectConfirm}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  /* ── List view ── */
  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-2 md:max-w-none md:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink md:text-3xl">Orders</h1>
          <p className="mt-1 text-sm text-slate-500 md:text-base">
            {isLoading ? 'Loading…' : `${orders.filter((o) => o.status === 'Pending').length} pending`}
          </p>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm">
          <Search size={18} strokeWidth={2.5} />
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex overflow-x-auto rounded-full border border-slate-200 bg-white p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`min-w-[80px] flex-1 whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition-all md:text-sm ${
                activeTab === tab ? 'bg-ink text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3 pb-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#FA3728]" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-10 text-center">
            <p className="font-medium text-slate-500">No orders found.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-transform active:scale-[0.99] md:p-5"
            >
              <div className="flex gap-4">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${order.avatarColor} text-lg font-bold text-white`}>
                  {order.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-start justify-between">
                    <h3 className="truncate pr-4 text-sm font-semibold leading-tight text-ink md:text-base">{order.name}</h3>
                    <span className="whitespace-nowrap text-xs font-medium text-slate-400">{order.time}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex min-w-0 flex-col">
                      <p className="mb-1 truncate text-xs text-slate-500 md:text-sm">{order.item}</p>
                      <span className="text-sm font-bold text-ink md:text-base">{order.price}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {order.status === 'Pending' && (
                        <span className="rounded-full bg-[#FA3728]/10 px-2.5 py-1 text-[10px] font-bold text-[#FA3728] md:text-xs">
                          {order.apiStatus === 'pending_customer_approval' ? 'Changes sent' : 'Pending'}
                        </span>
                      )}
                      {order.status === 'Confirmed' && (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 md:text-xs">
                          {order.apiStatus === 'disputed' ? 'Disputed' : 'Confirmed'}
                        </span>
                      )}
                      {order.status === 'Completed' && (
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold md:text-xs ${order.apiStatus === 'cancelled' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>
                          {order.apiStatus === 'cancelled' ? 'Declined' : 'Completed'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </motion.div>
    </div>
  );
}
