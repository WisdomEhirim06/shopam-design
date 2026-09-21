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
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Categories</h3>
            <button
              onClick={onClearAll}
              className="text-[10px] font-bold text-[#FA3728] hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {FILTER_CATEGORIES.map(({ label, slug }) => (
              <label
                key={slug}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${selectedCategories.includes(slug)
                  ? 'bg-[#FA3728]/5 text-[#FA3728]'
                  : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <span className="text-xs font-semibold">{label}</span>
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(slug)
                  ? 'bg-[#FA3728] border-[#FA3728]'
                  : 'border-gray-300'
                }`}>
                  {selectedCategories.includes(slug) && <Check size={10} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedCategories.includes(slug)}
                  onChange={() => onToggleCategory(slug)}
                />
              </label>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-50">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
            >
              Show Results
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
