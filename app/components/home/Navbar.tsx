'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="fixed top-2.5 sm:top-5 left-1/2 -translate-x-1/2 w-[94%] sm:w-[92%] max-w-5xl z-50 transition-all duration-300">
      <nav className="relative flex items-center justify-between px-3 sm:px-7 py-2 sm:py-3 rounded-full bg-white/85 backdrop-blur-xl border border-white/60 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5">
        {/* Left: Compact Brand Logo */}
        <Link href="/" className="flex items-center shrink-0 z-10">
          <Image
            src="/images/black-logo.png"
            alt="ShopAm"
            width={104}
            height={28}
            priority
            className="h-3.5 sm:h-7 w-auto object-contain"
          />
        </Link>

        {/* Center links: perfectly centered on all screen sizes */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-3.5 sm:gap-8">
          <Link
            href="/explore"
            className="text-[11px] sm:text-sm font-bold text-slate-700 hover:text-[#FA3728] transition-colors whitespace-nowrap"
          >
            Products
          </Link>
          <Link
            href="/feed"
            className="text-[11px] sm:text-sm font-bold text-slate-700 hover:text-[#FA3728] transition-colors whitespace-nowrap"
          >
            Feeds
          </Link>
          <Link
            href="/vendors"
            className="text-[11px] sm:text-sm font-bold text-slate-700 hover:text-[#FA3728] transition-colors whitespace-nowrap"
          >
            Vendors
          </Link>
        </div>

        {/* Right: Country indicator on desktop */}
        <div className="hidden sm:flex items-center text-xs font-bold text-slate-400">
          <span>Nigeria</span>
        </div>
      </nav>
    </header>
  );
}
