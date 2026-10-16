'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';


export default function AppBar({
  title,
  backHref,
  showBack = true,
  action,
}: {
  title: string;
  backHref?: string;
  showBack?: boolean;
  action?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur md:static">
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3.5 sm:px-6">
        {showBack && (
          <button
            onClick={() => (backHref ? router.push(backHref) : router.back())}
            aria-label="Back"
            className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className={`min-w-0 flex-1 truncate text-base font-bold text-ink ${!showBack ? 'pl-1' : ''}`}>
          {title}
        </h1>
        {action}
      </div>
    </header>
  );
}
