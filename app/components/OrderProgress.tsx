'use client';

import { Check } from 'lucide-react';
import { ORDER_STEPS, currentStepIndex } from '@/lib/order-steps';
import type { OrderStatus } from '@/lib/api/types';

export default function OrderProgress({
  status,
  className = '',
}: {
  status: OrderStatus;
  className?: string;
}) {
  const current = currentStepIndex(status);
  const stopped = status === 'cancelled' || status === 'disputed';

  if (stopped) {
    return (
      <div className={`rounded-xl bg-red-50 px-3 py-2 text-center text-[11px] font-semibold text-red-600 ${className}`}>
        This order was {status === 'disputed' ? 'disputed' : 'cancelled'}.
      </div>
    );
  }

  return (
    <ol className={`flex items-start justify-between gap-1 ${className}`}>
      {ORDER_STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step.key} className="relative flex flex-1 flex-col items-center">
            {i < ORDER_STEPS.length - 1 && (
              <span
                className={`absolute left-1/2 top-[11px] h-0.5 w-full ${
                  i < current ? 'bg-ink' : 'bg-slate-200'
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full ${
                done || active ? 'bg-ink text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {done ? (
                <Check size={12} strokeWidth={3} />
              ) : (
                <span className="text-[10px] font-bold">{i + 1}</span>
              )}
            </span>
            <span
              className={`mt-1.5 text-center text-[9px] font-medium leading-tight sm:text-[10px] ${
                active ? 'text-ink' : 'text-slate-400'
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
