'use client';

import { useId } from 'react';

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'decimal';
  textarea?: boolean;
  rows?: number;
  disabled?: boolean;
  error?: string;
  hint?: string;
  autoComplete?: string;
}

/** Floating-label input. The label sits inside the field and floats up on focus/fill. */
export default function Field({
  label,
  value,
  onChange,
  type = 'text',
  inputMode,
  textarea = false,
  rows = 3,
  disabled,
  error,
  hint,
  autoComplete,
}: FieldProps) {
  const id = useId();
  const border = error ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-ink';

  const defaultPos = textarea ? 'top-4 translate-y-0' : 'top-1/2 -translate-y-1/2';
  const labelClass = `pointer-events-none absolute left-4 transition-all duration-150 ${defaultPos} text-[15px] font-normal text-slate-500 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-ink peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-slate-600`;

  return (
    <div>
      <div className="relative">
        {textarea ? (
          <textarea
            id={id}
            rows={rows}
            placeholder=" "
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={`peer w-full resize-none rounded-2xl border-2 bg-white px-4 pb-3 pt-6 text-[15px] leading-relaxed text-ink outline-none transition-colors disabled:opacity-50 ${border}`}
          />
        ) : (
          <input
            id={id}
            type={type}
            inputMode={inputMode}
            placeholder=" "
            value={value}
            disabled={disabled}
            autoComplete={autoComplete}
            onChange={(e) => onChange(e.target.value)}
            className={`peer w-full rounded-2xl border-2 bg-white px-4 pb-2 pt-6 text-[15px] text-ink outline-none transition-colors disabled:opacity-50 ${border}`}
          />
        )}
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}
