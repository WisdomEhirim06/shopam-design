'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { customerCollage } from './data';

export default function CustomersSpotlight() {
  return (
    <section className="bg-canvas py-10 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 sm:gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left — image collage with guaranteed heights preventing empty/blank box collapses */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 h-[240px] sm:h-[360px] md:h-[420px]">
          <div className="relative h-full overflow-hidden rounded-2xl bg-slate-100 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.2)] ring-1 ring-slate-900/5">
            <Image
              src={customerCollage[0]}
              alt="ShopAm community"
              fill
              sizes="(max-width: 1024px) 50vw, 300px"
              className="object-cover"
            />
          </div>
          <div className="grid grid-rows-2 gap-2.5 sm:gap-4 h-full">
            <div className="relative h-full overflow-hidden rounded-2xl bg-slate-100 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.2)] ring-1 ring-slate-900/5">
              <Image
                src={customerCollage[1]}
                alt="ShopAm families"
                fill
                sizes="(max-width: 1024px) 50vw, 300px"
                className="object-cover"
              />
            </div>
            <div className="relative h-full overflow-hidden rounded-2xl bg-slate-100 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.2)] ring-1 ring-slate-900/5">
              <Image
                src={customerCollage[2]}
                alt="ShopAm customers"
                fill
                sizes="(max-width: 1024px) 50vw, 300px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right — copy strictly left-aligned with single-line headline */}
        <div className="lg:pl-6 text-left">
          <span className="inline-block rounded-full bg-[#2563EB]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2563EB]">
            For Vendors
          </span>

          {/* Strictly ONE line headline on mobile and desktop */}
          <h2 className="mt-2.5 sm:mt-4 text-[16px] xs:text-[18px] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-ink whitespace-nowrap overflow-hidden text-ellipsis">
            Get all your customers in <span className="text-[#2563EB]">one place</span>
          </h2>

          <p className="mt-2 sm:mt-4 max-w-md text-xs sm:text-base leading-relaxed text-slate-500 text-left">
            List your products, manage orders, and chat with buyers — all from <strong className="font-bold text-slate-800">one simple dashboard</strong> built for <strong className="font-bold text-slate-800">Nigerian vendors</strong>.
          </p>

          {/* Left-aligned Start Selling button */}
          <div className="mt-4 sm:mt-8 flex justify-start">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-full bg-[#FA3728] px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-[#E31B23] active:scale-95"
            >
              Start Selling
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
