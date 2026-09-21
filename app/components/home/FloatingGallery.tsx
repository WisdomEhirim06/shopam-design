'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { floatingProductSets } from './data';

export default function FloatingGallery() {
  const [activeSet, setActiveSet] = useState(0);

  useEffect(() => {
    // 0.55s rapid swipe in, 2.2s gentle float, 0.4s fast swipe out
    const interval = setInterval(() => {
      setActiveSet((prev) => (prev + 1) % floatingProductSets.length);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const currentProducts = floatingProductSets[activeSet];

  // Subtle rotation offsets for each of the 5 cards to match the playful shop.app floating aesthetic
  const rotations = [-3, 2, -1, 3, -2];
  const yOffsets = [4, -4, 2, -2, 5];

  return (
    <section className="relative overflow-hidden bg-canvas pt-20 sm:pt-24 pb-4">
      {/* Soft atmospheric color glows */}
      <div className="pointer-events-none absolute -top-10 left-1/4 h-56 w-56 rounded-full bg-[#FA3728]/8 blur-[90px]" />
      <div className="pointer-events-none absolute top-4 right-1/4 h-56 w-56 rounded-full bg-[#2563EB]/8 blur-[90px]" />

      <div className="relative mx-auto max-w-6xl px-2 sm:px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSet}
            initial={{ x: '90vw', opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              transition: {
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1], // Rapid deceleration / easeOutExpo
              },
            }}
            exit={{
              x: '-90vw',
              opacity: 0,
              transition: {
                duration: 0.38,
                ease: [0.7, 0, 0.84, 0], // Fast acceleration / easeInExpo
              },
            }}
            className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5"
          >
            {currentProducts.map((product, index) => {
              const rot = rotations[index % rotations.length];
              const yOffset = yOffsets[index % yOffsets.length];

              return (
                <motion.div
                  key={product.id}
                  animate={{
                    y: [yOffset, yOffset - 7, yOffset],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
                    ease: 'easeInOut',
                    delay: index * 0.18,
                  }}
                  className="shrink-0"
                >
                  <Link
                    href="/explore"
                    className="group block w-[70px] sm:w-[96px] md:w-[116px] lg:w-[128px] overflow-hidden rounded-xl sm:rounded-2xl bg-white p-1 sm:p-1.5 shadow-[0_10px_30px_-8px_rgba(15,23,42,0.14)] ring-1 ring-slate-900/5 transition-transform duration-300 hover:scale-105 active:scale-95"
                    style={{
                      transform: `rotate(${rot}deg)`,
                    }}
                  >
                    {/* Small product image with instant priority loading */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg sm:rounded-xl bg-slate-50">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        priority={activeSet === 0}
                        loading={activeSet === 0 ? 'eager' : 'lazy'}
                        quality={65}
                        sizes="128px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Miniature caption details like shop.app */}
                    <div className="mt-1 px-0.5 pb-0.5">
                      <p className="truncate text-[9px] sm:text-[11px] font-semibold text-slate-800 leading-tight">
                        {product.name}
                      </p>
                      <div className="mt-0.5 flex items-center justify-between text-[8px] sm:text-[10px] text-slate-400">
                        <span className="truncate">{product.tag || product.vendor}</span>
                        <span className="flex items-center gap-0.5 font-medium text-amber-500">
                          <Star size={9} className="fill-amber-400 text-amber-400" />
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hidden preloader for subsequent sets to eliminate swipe-in delay */}
      <div className="hidden" aria-hidden="true">
        {floatingProductSets.flat().map((p) => (
          <Image
            key={`preload-${p.id}`}
            src={p.image}
            alt=""
            width={128}
            height={128}
            quality={65}
            priority
          />
        ))}
      </div>
    </section>
  );
}
