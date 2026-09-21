import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { customerCollage } from './data';

export default function CustomersSpotlight() {
  return (
    <section className="bg-canvas py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left — image collage */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-[0_18px_50px_-18px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/5">
            <Image src={customerCollage[0]} alt="" fill sizes="(max-width: 1024px) 50vw, 300px" className="object-cover" />
          </div>
          <div className="grid grid-rows-2 gap-3 sm:gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_18px_50px_-18px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/5">
              <Image src={customerCollage[1]} alt="" fill sizes="(max-width: 1024px) 50vw, 300px" className="object-cover" />
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_18px_50px_-18px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/5">
              <Image src={customerCollage[2]} alt="" fill sizes="(max-width: 1024px) 50vw, 300px" className="object-cover" />
            </div>
          </div>
        </div>

        {/* Right — copy */}
        <div className="lg:pl-6">
          <span className="inline-block rounded-full bg-[#2563EB]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2563EB]">
            For Vendors
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Get all your customers in one place
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-500">
            List your products, manage orders and chat with buyers — all from one simple dashboard built for Nigerian vendors.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FA3728] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#E31B23] active:scale-95"
          >
            Start Selling
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
