'use client';

import Image from 'next/image';
import Link from 'next/link';
import { homeCategories } from './data';

/**
 * Category pills row, shared by the homepage and Explore.
 * - Default renders links to `/explore?category=...` (homepage behaviour).
 * - Passing `onSelect` makes the pills interactive filters that highlight
 *   the active selection in place (Explore behaviour).
 */
export default function CategoryPills({
  selected = [],
  onSelect,
  spacing = 'default',
}: {
  selected?: string[];
  onSelect?: (slug: string) => void;
  spacing?: 'default' | 'compact';
}) {
  const interactive = typeof onSelect === 'function';

  const pillClass = (active: boolean) =>
    [
      'group flex shrink-0 items-center gap-1.5 sm:gap-2 rounded-full border py-1 pl-1 pr-3 sm:pr-3.5 text-xs sm:text-[13px] font-bold shadow-2xs transition-all whitespace-nowrap',
      active
        ? 'border-ink bg-ink text-white shadow-sm'
        : 'border-slate-200/90 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xs',
    ].join(' ');

  const content = (label: string, image: string) => (
    <>
      <span className="relative h-6 w-6 sm:h-7 sm:w-7 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-900/5">
        <Image
          src={image}
          alt={label}
          fill
          priority
          quality={60}
          sizes="32px"
          className="object-cover"
        />
      </span>
      <span>{label}</span>
    </>
  );

  return (
    <section
      className={
        spacing === 'compact'
          ? 'bg-canvas px-2 pb-2 pt-1 sm:px-4'
          : 'bg-canvas px-2 pb-8 pt-1 sm:px-4 sm:pb-16 sm:pt-2'
      }
    >
      {/* Strictly ONE line: compact sizing on desktop, smooth single-line scroll on mobile without any scrollbar */}
      <div
        className="mx-auto flex max-w-6xl flex-nowrap items-center justify-start md:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar px-2 py-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {homeCategories.map((category) => {
          const active = selected.includes(category.slug);

          if (interactive) {
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => onSelect!(category.slug)}
                aria-pressed={active}
                className={pillClass(active)}
              >
                {content(category.label, category.image)}
              </button>
            );
          }

          return (
            <Link
              key={category.slug}
              href={`/explore?category=${category.slug}`}
              className={pillClass(active)}
            >
              {content(category.label, category.image)}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
