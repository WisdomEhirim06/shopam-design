import Image from 'next/image';
import Link from 'next/link';
import { homeCategories } from './data';

export default function CategoryPills() {
  return (
    <section className="bg-canvas px-4 pb-16 pt-4 sm:pb-20">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {homeCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/explore?category=${category.slug}`}
            className="group flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <span className="relative h-8 w-8 overflow-hidden rounded-full bg-slate-100">
              <Image src={category.image} alt={category.label} fill sizes="32px" className="object-cover" />
            </span>
            {category.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
