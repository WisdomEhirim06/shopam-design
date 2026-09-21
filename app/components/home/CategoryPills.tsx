import Image from 'next/image';
import Link from 'next/link';
import { homeCategories } from './data';

export default function CategoryPills() {
  return (
    <section className="bg-canvas px-2 sm:px-4 pb-12 pt-2 sm:pb-16">
      {/* Strictly ONE line: compact sizing on desktop, smooth single-line scroll on mobile */}
      <div className="mx-auto flex max-w-6xl flex-nowrap items-center justify-start md:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar px-2 py-1">
        {homeCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/explore?category=${category.slug}`}
            className="group flex shrink-0 items-center gap-2 rounded-full border border-slate-200/90 bg-white py-1 pl-1 pr-3.5 text-xs sm:text-[13px] font-bold text-slate-700 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xs whitespace-nowrap"
          >
            <span className="relative h-6 w-6 sm:h-7 sm:w-7 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-900/5">
              <Image
                src={category.image}
                alt={category.label}
                fill
                priority
                quality={60}
                sizes="32px"
                className="object-cover"
              />
            </span>
            <span>{category.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
