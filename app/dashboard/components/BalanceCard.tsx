import { Banknote } from 'lucide-react';
import { money } from '@/lib/order-steps';
import { BALANCE } from '../earnings/data';

export default function BalanceCard() {
  return (
    <div className="rounded-3xl bg-ink p-5 text-white sm:p-6">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-white/60">Total earnings</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
          <Banknote size={17} />
        </span>
      </div>
      <p className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{money(BALANCE.total)}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
        <div>
          <p className="text-[11px] text-white/60">Available balance</p>
          <p className="mt-0.5 text-lg font-bold">{money(BALANCE.available)}</p>
        </div>
        <div>
          <p className="text-[11px] text-white/60">Pending payout</p>
          <p className="mt-0.5 text-lg font-bold">{money(BALANCE.pending)}</p>
        </div>
      </div>
    </div>
  );
}
