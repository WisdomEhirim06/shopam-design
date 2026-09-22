'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FloatingSelect({
  id,
  label,
  value,
  onChange,
  options,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div>
      <div
        className={`relative rounded-xl border bg-white transition-all ${
          error
            ? 'border-red-300'
            : focused
            ? 'border-[#FA3728] ring-2 ring-[#FA3728]/15'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="h-14 w-full appearance-none rounded-xl bg-transparent px-4 pb-1.5 pt-5 text-sm text-ink outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 transition-all duration-200 ${
            focused ? 'text-[#FA3728]' : 'text-slate-400'
          } ${floated ? 'top-2 text-[11px] font-medium' : 'top-1/2 -translate-y-1/2 text-sm'}`}
        >
          {label}
        </label>
        <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
