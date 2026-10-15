'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Star, X } from 'lucide-react';

export default function ReviewModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void> | void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const submit = async () => {
    setBusy(true);
    try {
      await onSubmit(rating, comment.trim());
    } finally {
      setBusy(false);
    }
  };

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
          <h2 className="text-lg font-bold text-ink">Leave a review</h2>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} aria-label={`${n} star${n > 1 ? 's' : ''}`}>
              <Star size={30} className={n <= rating ? 'fill-gold text-gold' : 'text-slate-300'} />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="How was the product and the vendor?"
          className="mt-4 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-ink outline-none focus:border-ink"
        />

        <button
          onClick={submit}
          disabled={busy}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#FA3728] disabled:opacity-60"
        >
          {busy && <Loader2 size={16} className="animate-spin" />}
          Submit review
        </button>
      </motion.div>
    </motion.div>
  );
}
