'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';

/**
 * Shared centered search pill used by the homepage hero and the Explore page.
 * - No `onSubmit` → navigates to `/explore?q=...` (homepage behaviour).
 * - With `onSubmit` → filters in place (Explore behaviour).
 */
export default function SearchBar({
  initialValue = '',
  placeholder = 'Search products, brands, or verified vendors...',
  onSubmit,
  ariaLabel = 'Search products and vendors',
}: {
  initialValue?: string;
  placeholder?: string;
  onSubmit?: (query: string) => void;
  ariaLabel?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (onSubmit) {
      onSubmit(q);
      return;
    }
    router.push(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore');
  };

  return (
    <form
      onSubmit={submit}
      className="group relative mx-auto flex w-full max-w-2xl items-center gap-2 rounded-full border border-slate-200 bg-white p-2 pl-5 shadow-[0_10px_40px_-14px_rgba(15,23,42,0.20)] transition-all focus-within:border-[#FA3728]/40 focus-within:shadow-[0_18px_50px_-14px_rgba(250,55,40,0.30)]"
    >
      <Search size={20} className="shrink-0 text-slate-500" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-11 min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-slate-500 focus:outline-none sm:text-base"
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all hover:bg-slate-200 hover:text-ink active:scale-95"
      >
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
