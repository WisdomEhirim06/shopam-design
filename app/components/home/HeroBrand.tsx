'use client';

import Image from 'next/image';
import SearchBar from './SearchBar';

export default function HeroBrand() {
  return (
    <section className="relative bg-canvas px-4 pb-10 pt-6 sm:pb-14 sm:pt-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Image
          src="/images/black-logo.png"
          alt="ShopAm"
          width={180}
          height={56}
          priority
          className="h-10 w-auto sm:h-12"
        />
        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
          Nigeria&apos;s trusted marketplace for products and services from verified vendors.
        </p>
        <div className="mt-7 w-full sm:mt-9">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
