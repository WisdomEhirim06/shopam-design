'use client';

import { motion } from 'framer-motion';
import { Check, CheckCircle2, Pencil, ShoppingBag, Truck, X } from 'lucide-react';
import { money } from '@/lib/order-steps';
import type { ChatMessage } from './chat-logic';

interface Props {
  message: ChatMessage;
  index: number;
  isVendor: boolean;
  vendorName: string;
  onAcceptChanges: () => void;
  onRequestChanges: () => void;
  onReviewAndPay: () => void;
}

function Items({ message }: { message: ChatMessage }) {
  return (
    <div className="space-y-3">
      {message.items?.map((item, idx) => {
        const changedQty = item.originalQuantity !== undefined && item.originalQuantity !== item.quantity;
        const changedPrice = item.originalPrice !== undefined && item.originalPrice !== item.price;
        return (
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
              <p className="text-[11px] text-slate-400">
                {changedPrice && (
                  <span className="mr-1 line-through">{money(item.originalPrice!)}</span>
                )}
                {money(item.price)}
                {' · '}
                {changedQty ? (
                  <>
                    <span className="mr-1 line-through">{item.originalQuantity}</span>
                    <span className="font-semibold text-amber-600">qty {item.quantity}</span>
                  </>
                ) : (
                  `qty ${item.quantity}`
                )}
              </p>
            </div>
            <p className="shrink-0 text-[13px] font-bold text-ink">
              {money(item.price * item.quantity)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function Totals({ message }: { message: ChatMessage }) {
  return (
    <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
      <div className="flex justify-between text-xs text-slate-500">
        <span>Subtotal</span>
        <span className="font-medium text-slate-700">{money(message.subtotal ?? 0)}</span>
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>Delivery fee</span>
        <span className="font-medium text-slate-700">
          {message.deliveryFee ? money(message.deliveryFee) : 'Confirmed by vendor'}
        </span>
      </div>
      <div className="flex justify-between pt-0.5 text-sm font-bold text-ink">
        <span>Total</span>
        <span>{money(message.total ?? 0)}</span>
      </div>
    </div>
  );
}

function Card({ message, tone = 'default' }: { message: ChatMessage; tone?: 'default' | 'amber' | 'emerald' | 'muted' }) {
  const ring = {
    default: 'border-slate-200/80',
    amber: 'border-amber-200',
    emerald: 'border-emerald-200',
    muted: 'border-slate-200',
  }[tone];

  return (
    <div className={`w-full max-w-md rounded-2xl border bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${ring}`}>
      {message.kind === 'order' && (
        <>
          <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-[13px] font-bold text-ink">Order request</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              {message.awaiting === 'vendor' ? 'Awaiting vendor' : 'Summary'}
            </span>
          </div>
          <Items message={message} />
          <Totals message={message} />
        </>
      )}

      {message.kind === 'changes' && (
        <>
          <div className="mb-3 flex items-center gap-2 border-b border-amber-100 pb-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Pencil size={14} />
            </span>
            <span className="text-[13px] font-bold text-ink">Vendor suggested changes</span>
          </div>
          <Items message={message} />
          <Totals message={message} />
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-700">
            Nothing is charged yet. Review the changes and accept — or ask the vendor to adjust.
          </p>
        </>
      )}

      {message.kind === 'accepted' && (
        <>
          <div className="mb-3 flex items-center gap-2 border-b border-emerald-100 pb-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check size={15} strokeWidth={3} />
            </span>
            <span className="text-[13px] font-bold text-ink">Order accepted</span>
          </div>
          <Items message={message} />
          <Totals message={message} />
        </>
      )}

      {message.kind === 'rejected' && (
        <>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-500">
              <X size={15} strokeWidth={3} />
            </span>
            <span className="text-[13px] font-bold text-ink">Order declined</span>
          </div>
          <p className="text-xs text-slate-500">{message.reason}</p>
        </>
      )}

      {message.kind === 'payment' && (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <p className="text-[13px] font-bold text-emerald-800">Payment received</p>
            <p className="text-[11px] text-slate-500">Your order is being processed.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MessageBubble({
  message,
  index,
  isVendor,
  vendorName,
  onAcceptChanges,
  onRequestChanges,
  onReviewAndPay,
}: Props) {
  const isSelf = message.from === 'customer';

  if (message.kind === 'text') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-end gap-2 ${isSelf ? 'justify-end' : 'justify-start'}`}
      >
        {!isSelf && (
          <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">
            {vendorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div
          className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm sm:max-w-[65%] ${
            isSelf ? 'rounded-br-sm bg-ink text-white' : 'rounded-bl-sm border border-slate-200/80 bg-white text-slate-700'
          }`}
        >
          <p>{message.text}</p>
          <p className={`mt-1 text-right text-[10px] ${isSelf ? 'text-white/60' : 'text-slate-400'}`}>
            {message.time}
          </p>
        </div>
      </motion.div>
    );
  }

  // System cards are centered and full-width for readability.
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.2) }}
      className="flex justify-center"
    >
      <div className="w-full max-w-md">
        <Card message={message} tone={message.kind === 'changes' ? 'amber' : message.kind === 'accepted' ? 'emerald' : 'default'} />

        {/* Order awaiting vendor confirmation */}
        {message.kind === 'order' && message.awaiting === 'vendor' && !isVendor && (
          <div className="mt-2 flex items-start gap-2 rounded-xl bg-white/70 px-3 py-2.5 text-[11px] leading-relaxed text-slate-500 ring-1 ring-slate-200/70">
            <Truck size={14} className="mt-0.5 shrink-0 text-slate-400" />
            The seller will confirm availability and delivery cost before you pay.
          </div>
        )}

        {/* Customer reviewing vendor changes */}
        {message.kind === 'changes' && message.awaiting === 'customer' && !isVendor && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={onRequestChanges}
              className="flex-1 rounded-full border border-slate-200 bg-white py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-slate-300"
            >
              Request changes
            </button>
            <button
              onClick={onAcceptChanges}
              className="flex-1 rounded-full bg-ink py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#FA3728]"
            >
              Accept changes
            </button>
          </div>
        )}

        {/* Customer payment CTA */}
        {message.kind === 'accepted' && message.awaiting === 'payment' && !isVendor && (
          <button
            onClick={onReviewAndPay}
            className="mt-2 w-full rounded-full bg-[#FA3728] py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#E31B23]"
          >
            Review &amp; Pay
          </button>
        )}

        {message.kind === 'accepted' && message.awaiting === 'payment' && isVendor && (
          <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-center text-[11px] font-semibold text-amber-700">
            Awaiting payment from the buyer
          </p>
        )}

        <p className="mt-1.5 text-center text-[10px] text-slate-400">{message.time}</p>
      </div>
    </motion.div>
  );
}
