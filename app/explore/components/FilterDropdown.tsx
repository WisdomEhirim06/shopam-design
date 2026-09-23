'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { FILTER_CATEGORIES } from '../data';

export default function FilterDropdown({
  showFilters,
  selectedCategories,
  onToggleCategory,
  onClearAll,
  onClose,
}: {
  showFilters: boolean;
  selectedCategories: string[];
  onToggleCategory: (slug: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-full z-50 mt-3 w-72 origin-top-left overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink">Categories</h3>
            <button
              onClick={onClearAll}
              className="text-[10px] font-bold uppercase tracking-wide text-[#FA3728] hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="max-h-[380px] space-y-1 overflow-y-auto pr-1 no-scrollbar">
            {FILTER_CATEGORIES.map(({ label, slug }) => {
              const active = selectedCategories.includes(slug);
              return (
                <label
                  key={slug}
                  className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${active ? 'bg-slate-900/[0.04] text-ink' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <span className="text-xs font-semibold">{label}</span>
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${active ? 'border-ink bg-ink' : 'border-slate-300'
                      }`}
                  >
                    {active && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={active}
                    onChange={() => onToggleCategory(slug)}
                  />
                </label>
              );
            })}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <button
              onClick={onClose}
              className="w-full rounded-full bg-ink py-2.5 text-xs font-bold text-white transition-colors hover:bg-black"
            >
              Show Results
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
