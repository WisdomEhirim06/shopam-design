'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Star } from 'lucide-react';
import { trendingProducts } from './data';

export default function ProductsShowcase() {
  return (
    <section className="bg-canvas py-10 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header — title left, explore CTA right */}
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Popular Products
            </h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Discover what&apos;s <strong className="font-semibold text-slate-800">trending</strong> on ShopAm
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

        {/* Product grid — 3 cards per row on mobile with reduced compact sizing */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">
          {trendingProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="group overflow-hidden rounded-lg sm:rounded-xl bg-white shadow-xs transition-all hover:shadow-md"
            >
              <Link href={`/explore?q=${encodeURIComponent(product.name)}`} className="block h-full">
                <div className="relative aspect-square w-full bg-gray-100 sm:aspect-[4/3]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    quality={70}
                    sizes="(max-width: 640px) 33vw, 240px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23f3f4f6" width="150" height="150"/%3E%3C/svg%3E';
                    }}
                  />
                  {product.discount && (
                    <span className="absolute left-1 top-1 sm:left-2 sm:top-2 rounded bg-[#FA3728] px-1 py-0.5 text-[8px] sm:text-[10px] font-bold text-white">
                      -{product.discount}%
                    </span>
                  )}
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 flex items-center gap-0.5 rounded-full bg-white/95 px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[10px] font-semibold backdrop-blur-sm shadow-2xs">
                    <Star size={9} className="fill-[#D4AF37] text-[#D4AF37]" />
                    {product.rating}
                  </div>
                </div>

                <div className="p-1.5 sm:p-3">
                  <p className="mb-0.5 truncate text-[8px] sm:text-[10px] text-gray-500">{product.vendor}</p>
                  <h3 className="mb-0.5 line-clamp-2 text-[10px] sm:text-xs lg:text-sm font-semibold leading-tight text-ink">
                    {product.name}
                  </h3>
                  <div className="mb-0.5 flex flex-wrap items-baseline gap-1">
                    <p className="text-xs sm:text-sm lg:text-base font-bold text-[#FA3728]">
                      ₦{product.price.toLocaleString()}
                    </p>
                    {product.originalPrice && (
                      <p className="text-[8px] sm:text-[10px] text-gray-400 line-through">
                        ₦{product.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <p className="text-[8px] sm:text-[10px] text-gray-400">({product.reviews})</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center sm:hidden px-4">
          <Link
            href="/explore"
            className="w-full max-w-sm justify-center inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all active:scale-95"
          >
            Explore All Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
