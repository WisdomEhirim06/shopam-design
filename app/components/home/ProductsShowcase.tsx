'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Star } from 'lucide-react';
import { trendingProducts } from './data';

export default function ProductsShowcase() {
  return (
    <section className="bg-canvas py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header — title left, explore CTA right */}
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <span className="inline-block rounded-full bg-[#FA3728]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#FA3728]">
              Trending Now
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
              Popular Products
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 sm:text-base">
              Discover what&apos;s trending on ShopAm
            </p>
          </div>

          <Link
            href="/explore"
            className="hidden shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#FA3728] sm:inline-flex"
          >
            Explore Products
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Product grid — preserved */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">
          {trendingProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-lg"
            >
              <div className="relative aspect-square w-full bg-gray-100 sm:aspect-[4/3]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  quality={70}
                  sizes="(max-width: 640px) 50vw, 240px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23f3f4f6" width="150" height="150"/%3E%3C/svg%3E';
                  }}
                />
                {product.discount && (
                  <span className="absolute left-2 top-2 rounded bg-[#FA3728] px-1.5 py-0.5 text-[10px] font-bold text-white">
                    -{product.discount}%
                  </span>
                )}
                <button className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                  <Heart size={13} className="text-gray-700" />
                </button>
                <div className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[10px] font-semibold backdrop-blur-sm">
                  <Star size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
                  {product.rating}
                </div>
              </div>

              <div className="p-3">
                <p className="mb-0.5 truncate text-[10px] text-gray-500">{product.vendor}</p>
                <h3 className="mb-1 line-clamp-2 text-xs font-semibold leading-snug text-ink lg:text-sm">
                  {product.name}
                </h3>
                <div className="mb-0.5 flex items-center gap-1.5">
                  <p className="text-sm font-bold text-[#FA3728] lg:text-base">
                    ₦{product.price.toLocaleString()}
                  </p>
                  {product.originalPrice && (
                    <p className="text-[10px] text-gray-400 line-through">
                      ₦{product.originalPrice.toLocaleString()}
                    </p>
                  )}
                </div>
                <p className="text-[10px] text-gray-500">({product.reviews} reviews)</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#FA3728]"
          >
            Explore Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
