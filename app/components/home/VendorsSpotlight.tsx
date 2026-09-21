'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { vendorCards } from './data';

export default function VendorsSpotlight() {
  // Automatically cycle through cards on their own without requiring hover or click
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % vendorCards.length);
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  // Spatial pile slots relative to the active card (rel = 0 is front-and-center)
  const getSlotStyles = (relIndex: number) => {
    switch (relIndex) {
      case 0: // Front Center (Active)
        return {
          x: 0,
          y: -10,
          rotate: 0,
          scale: 1.06,
          zIndex: 35,
          opacity: 1,
          shadow: '0 25px 60px -12px rgba(15,23,42,0.38)',
        };
      case 1: // Mid Right
        return {
          x: 48,
          y: 4,
          rotate: 6,
          scale: 0.98,
          zIndex: 25,
          opacity: 0.92,
          shadow: '0 18px 45px -12px rgba(15,23,42,0.25)',
        };
      case 2: // Back Right
        return {
          x: 88,
          y: 16,
          rotate: 12,
          scale: 0.91,
          zIndex: 15,
          opacity: 0.8,
          shadow: '0 12px 35px -10px rgba(15,23,42,0.2)',
        };
      case 3: // Back Left
        return {
          x: -88,
          y: 16,
          rotate: -12,
          scale: 0.91,
          zIndex: 15,
          opacity: 0.8,
          shadow: '0 12px 35px -10px rgba(15,23,42,0.2)',
        };
      case 4: // Mid Left
      default:
        return {
          x: -48,
          y: 4,
          rotate: -6,
          scale: 0.98,
          zIndex: 25,
          opacity: 0.92,
          shadow: '0 18px 45px -12px rgba(15,23,42,0.25)',
        };
    }
  };

  return (
    <section className="bg-canvas py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left — Clean bold typography without 'verified marketplace' pill or 'meet vendors' button */}
        <div className="lg:pr-6">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-ink leading-tight">
            Home to your <span className="italic text-[#FA3728]">fave</span> vendors
          </h2>

          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500">
            Every shop on ShopAm is <strong className="font-bold text-slate-800">verified</strong>, <strong className="font-bold text-slate-800">reviewed</strong>, and ready to serve. Discover trusted creators and businesses behind the products you love.
          </p>
        </div>

        {/* Right — 5 Image Cards automatically switching positions on their own */}
        <div className="relative flex items-center justify-center min-h-[380px] sm:min-h-[440px] py-6">
          {vendorCards.map((vendor, i) => {
            const relIndex = (i - activeIdx + vendorCards.length) % vendorCards.length;
            const slot = getSlotStyles(relIndex);
            const isFront = relIndex === 0;

            return (
              <motion.div
                key={vendor.name}
                animate={{
                  x: slot.x,
                  y: slot.y,
                  rotate: slot.rotate,
                  scale: slot.scale,
                  opacity: slot.opacity,
                  zIndex: slot.zIndex,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 110,
                  damping: 17,
                  mass: 0.8,
                }}
                className="absolute w-[150px] sm:w-[185px] md:w-[205px] aspect-[3/4]"
                style={{
                  zIndex: slot.zIndex,
                }}
              >
                <Link href="/vendors" className="block h-full w-full">
                  <div
                    className="relative h-full w-full overflow-hidden rounded-2xl bg-white ring-1 ring-slate-900/10 transition-all duration-300"
                    style={{
                      boxShadow: slot.shadow,
                    }}
                  >
                    <Image
                      src={vendor.image}
                      alt={vendor.name}
                      fill
                      sizes="(max-width: 640px) 150px, 220px"
                      className="object-cover"
                    />

                    {/* Gradient overlay and vendor info */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-3 pt-10 text-white">
                      <div className="flex items-center gap-1">
                        <p className="truncate text-xs sm:text-sm font-bold">{vendor.name}</p>
                        {isFront && (
                          <BadgeCheck size={15} className="shrink-0 text-[#2563EB]" />
                        )}
                      </div>
                      <p className="truncate text-[10px] sm:text-xs text-white/80">{vendor.tag}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
