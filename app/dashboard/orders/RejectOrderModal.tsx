'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, X } from 'lucide-react';
import { REJECTION_REASONS, type RejectionReason } from '@/lib/order-steps';

export default function RejectOrderModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (reason: string, note?: string) => void;
}) {
  const [reason, setReason] = useState<RejectionReason | ''>('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const finalReason = reason === 'Other' && note.trim() ? note.trim() : reason;

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
        className="w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Decline order</h2>
            <p className="text-xs text-slate-500">Let the buyer know why.</p>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-1.5">
          {REJECTION_REASONS.map((option) => {
            const active = reason === option;
            return (
              <button
                key={option}
                onClick={() => setReason(option)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition-colors ${
                  active ? 'bg-slate-900/[0.04] text-ink' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {option}
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${active ? 'border-ink bg-ink' : 'border-slate-300'}`}>
                  {active && <Check size={12} className="text-white" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>

        {reason === 'Other' && (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Tell the buyer what happened"
            className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-ink outline-none focus:border-ink"
          />
        )}

        <button
          onClick={() => {
            if (!finalReason) return;
            setBusy(true);
            onConfirm(finalReason, note.trim() || undefined);
          }}
          disabled={!finalReason || busy}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#FA3728] disabled:opacity-50"
        >
          {busy && <Loader2 size={16} className="animate-spin" />}
          Decline order
        </button>
      </motion.div>
    </motion.div>
  );
}
