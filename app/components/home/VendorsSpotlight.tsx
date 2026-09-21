import Image from 'next/image';
import { vendorCards } from './data';

export default function VendorsSpotlight() {
  return (
    <section className="bg-canvas py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left — artistic slanted script heading */}
        <div className="lg:pr-6">
          <h2 className="origin-left -rotate-2 font-script text-5xl leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
            Home to your <span className="text-[#FA3728]">fave vendors</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-slate-500">
            Every shop on ShopAm is verified, reviewed and ready to serve. Meet the people behind the products you love.
          </p>
        </div>

        {/* Right — three vertical vendor cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {vendorCards.map((vendor) => (
            <div
              key={vendor.name}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-[0_18px_50px_-18px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/5"
            >
              <Image
                src={vendor.image}
                alt={vendor.name}
                fill
                sizes="(max-width: 1024px) 33vw, 220px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-3 pt-10">
                <p className="truncate text-xs font-semibold text-white sm:text-sm">{vendor.name}</p>
                <p className="truncate text-[10px] text-white/70 sm:text-xs">{vendor.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
