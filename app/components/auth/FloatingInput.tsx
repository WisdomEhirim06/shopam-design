'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function FloatingInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
  inputMode,
  required,
  disabled,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'decimal' | 'search' | 'url' | 'none';
  required?: boolean;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const floated = focused || value.length > 0;

  const labelColor = error
    ? 'text-red-500'
    : focused
    ? 'text-[#FA3728]'
    : floated
    ? 'text-slate-500'
    : 'text-slate-400';

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
        <input
          id={id}
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required={required}
          disabled={disabled}
          placeholder=" "
          className="h-12 w-full rounded-xl bg-transparent px-3.5 pb-1 pt-4 text-sm text-ink outline-none disabled:opacity-60"
        />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-3.5 transition-all duration-200 ${labelColor} ${
            floated ? 'top-1.5 text-[10px] font-medium' : 'top-1/2 -translate-y-1/2 text-sm'
          }`}
        >
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 transition-colors hover:text-slate-600"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
