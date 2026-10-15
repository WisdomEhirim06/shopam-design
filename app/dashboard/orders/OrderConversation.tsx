'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send, Check, X, Truck, CheckCircle2, MoreVertical, ShoppingBag, RotateCcw } from 'lucide-react';
import { money, SUGGESTED_SHIPPING_FEE } from '@/lib/order-steps';
import type { UIOrder, ConversationMessage } from './order-transform';

interface OrderConversationProps {
  order: UIOrder;
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  convError: string;
  onConvErrorChange: (value: string) => void;
  onBack: () => void;
  onStartDelivery: (orderId: string) => void;
  onAccept: (orderId: string) => void;
  onModify: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onSetShippingFee: (orderId: string, fee: number) => void;
  onResolveDispute: (orderId: string, resolution: string) => void;
  onSendMessage: () => void;
}

const RESOLUTIONS = ['Refund', 'Replace item', 'Reorder', 'Partial refund'];

function EventChip({ tone, label }: { tone: 'emerald' | 'blue' | 'gray' | 'amber'; label: string }) {
  const styles = {
    emerald: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    gray: 'bg-slate-100 text-slate-600',
    amber: 'bg-amber-50 text-amber-700',
  }[tone];
  return (
    <div className="flex justify-center">
      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${styles}`}>{label}</span>
    </div>
  );
}

function ItemRows({ items }: { items: ConversationMessage['items'] }) {
  return (
    <div className="space-y-3">
      {items?.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-300">
                <ShoppingBag size={16} />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-ink">{item.name}</p>
            <p className="text-[11px] text-slate-500">
              {money(item.unitPrice)} × {item.quantity}
            </p>
          </div>
          <p className="shrink-0 text-[13px] font-bold text-ink">{money(item.unitPrice * item.quantity)}</p>
        </div>
      ))}
    </div>
  );
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
  onModify,
  onReject,
  onSetShippingFee,
  onResolveDispute,
  onSendMessage,
}: OrderConversationProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [fee, setFee] = useState(SUGGESTED_SHIPPING_FEE);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [order.messages]);

  const status = order.apiStatus;

  return (
    <div className="flex h-[100dvh] flex-col bg-canvas">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center gap-3 border-b border-slate-200/70 bg-white px-4 py-3 shadow-sm">
        <button onClick={onBack} className="-ml-1 p-1 text-slate-600">
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${order.avatarColor} font-bold text-white`}>
          {order.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight text-ink">{order.name}</p>
          <p className="text-xs text-slate-500">Buyer</p>
        </div>
        <button className="p-1 text-slate-500">
          <MoreVertical size={20} />
        </button>
      </div>

      {convError && (
        <div className="flex flex-shrink-0 items-center justify-between border-b border-red-100 bg-red-50 px-4 py-2.5">
          <span className="text-sm text-red-600">{convError}</span>
          <button onClick={() => onConvErrorChange('')} className="ml-3 text-lg font-bold leading-none text-red-400 hover:text-red-600">×</button>
        </div>
      )}

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-3 py-5 sm:px-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {order.messages.map((msg) => {
            if (msg.type === 'text') {
              const isSelf = !msg.fromBuyer;
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                  {!isSelf && (
                    <div className={`mb-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${order.avatarColor} text-xs font-bold text-white`}>
                      {order.avatar}
                    </div>
                  )}
                  <div className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm sm:max-w-[60%] ${isSelf ? 'rounded-br-sm bg-ink text-white' : 'rounded-bl-sm border border-slate-200/80 bg-white text-slate-700'}`}>
                    {msg.content}
                    <p className={`mt-1 text-right text-[10px] ${isSelf ? 'text-white/60' : 'text-slate-500'}`}>{msg.timestamp}</p>
                  </div>
                </div>
              );
            }

            if (msg.type === 'order_card') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <span className="text-[13px] font-bold text-ink">Order request</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">New</span>
                    </div>
                    <ItemRows items={msg.items} />
                    <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
                      <div className="flex justify-between text-xs text-slate-600"><span>Subtotal</span><span className="font-medium text-slate-700">{money(msg.subtotal ?? 0)}</span></div>
                      {msg.shippingFee !== undefined && (
                        <div className="flex justify-between text-xs text-slate-600"><span>Delivery fee</span><span className="font-medium text-slate-700">{money(msg.shippingFee)}</span></div>
                      )}
                      <div className="flex justify-between pt-0.5 text-sm font-bold text-ink"><span>Total</span><span>{money(msg.total ?? 0)}</span></div>
                    </div>
                    <p className="mt-2 text-right text-[10px] text-slate-500">{msg.timestamp}</p>
                  </div>
                </div>
              );
            }

            if (msg.type === 'shipping_notification') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-500"><Truck size={14} /></span>
                      <span className="text-[13px] font-bold text-ink">Delivery fee set</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-600"><span>Delivery fee</span><span className="font-medium text-slate-700">{money(msg.shippingFee ?? 0)}</span></div>
                      <div className="flex justify-between text-sm font-bold text-ink"><span>New total</span><span>{money(msg.total ?? 0)}</span></div>
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.type === 'accepted') return <EventChip key={msg.id} tone="emerald" label="Order accepted" />;
            if (msg.type === 'payment_success') return <EventChip key={msg.id} tone="emerald" label="Payment received" />;
            if (msg.type === 'shipped') return <EventChip key={msg.id} tone="blue" label="Order shipped" />;
            if (msg.type === 'delivered') return <EventChip key={msg.id} tone="emerald" label="Delivered" />;

            if (msg.type === 'declined') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <div className="mb-1 flex items-center justify-center gap-2 text-[13px] font-bold text-ink"><X size={14} className="text-red-500" /> Order declined</div>
                    <p className="text-xs text-slate-600">{msg.reason}</p>
                  </div>
                </div>
              );
            }

            if (msg.type === 'disputed') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <div className="mb-1 flex items-center gap-2 text-[13px] font-bold text-ink"><X size={14} className="text-amber-500" /> Dispute raised</div>
                    <p className="text-xs text-slate-600">{msg.reason}</p>
                  </div>
                </div>
              );
            }

            return null;
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Action area — always the newest thing in the thread */}
      <div className="flex-shrink-0 border-t border-slate-200/70 bg-white px-3 py-3 sm:px-4">
        <div className="mx-auto max-w-3xl">
          {status === 'pending_vendor_review' && (
            <div className="flex gap-2">
              <button onClick={() => onAccept(order.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#FA3728] py-3 text-sm font-bold text-white transition-colors hover:bg-[#E31B23]">
                <Check size={15} strokeWidth={3} /> Accept
              </button>
              <button onClick={() => onModify(order.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-amber-500 py-3 text-sm font-bold text-white transition-colors hover:bg-amber-600">
                Modify
              </button>
              <button onClick={() => onReject(order.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
                Reject
              </button>
            </div>
          )}

          {(status === 'awaiting_shipping_details' || status === 'shipping_set') && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value) || 0)}
                placeholder="Delivery fee"
                className="w-32 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-ink outline-none focus:border-ink"
              />
              <button onClick={() => onSetShippingFee(order.id, fee)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#FA3728] py-3 text-sm font-bold text-white transition-colors hover:bg-[#E31B23]">
                <Truck size={15} /> Confirm delivery fee
              </button>
            </div>
          )}

          {(status === 'awaiting_payment') && (
            <p className="rounded-full bg-amber-50 py-2.5 text-center text-xs font-semibold text-amber-700">Awaiting payment from the buyer</p>
          )}

          {status === 'paid' && (
            <button onClick={() => onStartDelivery(order.id)} className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#FA3728] py-3 text-sm font-bold text-white transition-colors hover:bg-[#E31B23]">
              <Truck size={15} /> Mark as shipped
            </button>
          )}

          {status === 'shipped' && (
            <p className="rounded-full bg-blue-50 py-2.5 text-center text-xs font-semibold text-blue-700">Awaiting the buyer to confirm delivery</p>
          )}

          {status === 'disputed' && (
            <div>
              <p className="mb-2 text-center text-xs font-semibold text-amber-700">Choose how to resolve this dispute</p>
              <div className="grid grid-cols-2 gap-2">
                {RESOLUTIONS.map((r) => (
                  <button key={r} onClick={() => onResolveDispute(order.id, r)} className="flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink">
                    {r === 'Reorder' ? <RotateCcw size={13} /> : <CheckCircle2 size={13} />}
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {status === 'cancelled' && (
            <p className="rounded-full bg-slate-100 py-2.5 text-center text-xs font-semibold text-slate-600">This order was declined</p>
          )}

          {['delivered', 'completed'].includes(status) && (
            <p className="rounded-full bg-emerald-50 py-2.5 text-center text-xs font-semibold text-emerald-700">Delivered — payout scheduled</p>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="flex flex-shrink-0 items-center gap-2 border-t border-slate-200/70 bg-white px-3 py-3 pb-[max(env(safe-area-inset-bottom),12px)] sm:px-4">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2">
          <div className="flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 transition-all focus-within:border-ink focus-within:bg-white">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => onMessageInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
              placeholder="Type a message…"
              className="w-full bg-transparent px-5 py-3 text-sm text-ink outline-none placeholder:text-slate-500"
            />
          </div>
          <button
            onClick={onSendMessage}
            disabled={!messageInput.trim()}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-[#FA3728] disabled:opacity-40"
          >
            <Send size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
