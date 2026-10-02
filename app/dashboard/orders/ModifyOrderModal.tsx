'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Minus, Plus, X } from 'lucide-react';
import { SUGGESTED_SHIPPING_FEE, money } from '@/lib/order-steps';
import type { UIOrder } from './order-transform';

export interface ModifyChanges {
  items: { name: string; quantity: number; price: number; variant?: string }[];
  delivery_fee: number;
  note?: string;
}

const parseAmount = (value: string) => Number(String(value).replace(/[^\d.]/g, '')) || 0;

export default function ModifyOrderModal({
  order,
  onClose,
  onSave,
}: {
  order: UIOrder;
  onClose: () => void;
  onSave: (changes: ModifyChanges) => void;
}) {
  const [items, setItems] = useState(
    order.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      price: parseAmount(i.price),
      variant: '',
    }))
  );
  const [deliveryFee, setDeliveryFee] = useState(SUGGESTED_SHIPPING_FEE);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + deliveryFee;

  const updateQty = (idx: number, delta: number) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it))
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 sm:items-center sm:px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
          <div>
            <h2 className="text-lg font-bold text-ink">Modify order</h2>
            <p className="text-xs text-slate-500">The buyer must review and accept your changes.</p>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          {items.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border border-slate-200 px-1.5 py-1">
                  <button onClick={() => updateQty(idx, -1)} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100">
                    <Minus size={15} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-ink">{item.quantity}</span>
                  <button onClick={() => updateQty(idx, 1)} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100">
                    <Plus size={15} />
                  </button>
                </div>
                <div className="flex flex-1 items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Unit ₦</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={item.price}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((it, i) => (i === idx ? { ...it, price: Number(e.target.value) || 0 } : it))
                      )
                    }
                    className="w-full min-w-0 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-ink"
                  />
                </div>
              </div>
              <input
                value={item.variant}
                onChange={(e) =>
                  setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, variant: e.target.value } : it)))
                }
                placeholder="Variant (optional, e.g. Blue / Large)"
                className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-ink outline-none focus:border-ink"
              />
            </div>
          ))}

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <label className="text-sm font-semibold text-ink">Delivery fee (₦)</label>
            <input
              type="number"
              inputMode="numeric"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(Number(e.target.value) || 0)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-ink"
            />
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Add a note for the buyer (optional)"
            className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-ink outline-none focus:border-ink"
          />

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-ink">
            <span>New total</span>
            <span>{money(total)}</span>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
          <button
            onClick={() => {
              setBusy(true);
              onSave({ items, delivery_fee: deliveryFee, note: note.trim() || undefined });
            }}
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FA3728] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#E31B23] disabled:opacity-60"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            Send changes to buyer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
