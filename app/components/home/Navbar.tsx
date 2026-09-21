'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-50 transition-all duration-300">
      <nav className="relative flex items-center justify-between px-5 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 z-10">
          <Image
            src="/images/black-logo.png"
            alt="ShopAm"
            width={110}
            height={32}
            priority
            className="h-6 sm:h-7 w-auto object-contain"
          />
        </Link>

        {/* Center: Truly centered across the full width of the navbar and nudged slightly left for optical perfection */}
        <div className="absolute left-1/2 -translate-x-[52%] flex items-center gap-5 sm:gap-8 pointer-events-auto">
          <Link
            href="/explore"
            className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#FA3728] transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/explore"
            className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#FA3728] transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/vendors"
            className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#FA3728] transition-colors"
          >
            Vendors
          </Link>
        </div>

        {/* Right: Equal width counter-balance to match the left logo */}
        <div className="w-[100px] shrink-0 hidden sm:flex justify-end items-center text-xs font-bold text-slate-400">
          Nigeria
        </div>
      </nav>
    </header>
  );
}
