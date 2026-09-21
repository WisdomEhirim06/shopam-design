'use client';

import SearchBar from './SearchBar';

export default function HeroBrand() {
  return (
    <section className="relative bg-canvas px-4 pb-8 pt-2 sm:pb-12 sm:pt-4">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        {/* Bold ShopAm text mark in Bricolage Grotesque font */}
        <h1 className="font-bricolage font-black tracking-tight text-ink text-5xl sm:text-7xl md:text-8xl lg:text-9xl select-none">
          Shop<span className="text-[#FA3728]">Am</span>
        </h1>

        <p className="mt-2.5 sm:mt-4 max-w-md text-xs leading-relaxed text-slate-500 sm:text-base">
          Nigeria&apos;s <strong className="font-semibold text-slate-800">trusted marketplace</strong> for products and services from <strong className="font-semibold text-slate-800">verified vendors</strong>.
        </p>

        <div className="mt-4 w-full sm:mt-8">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
