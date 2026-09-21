'use client';

import Image from 'next/image';
import { galleryImages } from './data';

const SIZES = [112, 144, 96, 160, 124, 136, 104, 152];
const ROTATIONS = [-4, 3, -2, 5, -3, 2, -5, 4];
const OFFSETS = [0, 30, 8, 46, 16, 38, 4, 26];

function GalleryCard({ src, index }: { src: string; index: number }) {
  const size = SIZES[index % SIZES.length];
  const rotate = ROTATIONS[index % ROTATIONS.length];
  const offset = OFFSETS[index % OFFSETS.length];

  return (
    <div
      className="gallery-card shrink-0"
      style={{ animationDelay: `${(index % 5) * 0.6}s`, marginTop: `${offset}px` }}
    >
      <div
        className="gallery-card-inner relative overflow-hidden rounded-2xl bg-white shadow-[0_18px_50px_-14px_rgba(15,23,42,0.22)] ring-1 ring-slate-900/5"
        style={{ width: size, height: size, transform: `rotate(${rotate}deg)` }}
      >
        <Image src={src} alt="" fill sizes="180px" className="object-cover" />
      </div>
    </div>
  );
}

function MarqueeRow({ images, duration, startIndex }: { images: string[]; duration: number; startIndex: number }) {
  return (
    <div className="gallery-row flex w-max gap-5 sm:gap-7" style={{ animationDuration: `${duration}s` }}>
      {[...images, ...images].map((src, i) => (
        <GalleryCard key={i} src={src} index={i + startIndex} />
      ))}
    </div>
  );
}

export default function FloatingGallery() {
  const rowA = galleryImages.slice(0, 7);
  const rowB = galleryImages.slice(7, 14);

  return (
    <section className="relative overflow-hidden bg-canvas pb-6 pt-14 sm:pb-10 sm:pt-20">
      {/* Soft colour glows for depth */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[#FA3728]/10 blur-[110px]" />
      <div className="pointer-events-none absolute right-1/4 top-8 h-64 w-64 rounded-full bg-[#2563EB]/10 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[110px]" />

      <div className="gallery-band relative space-y-4 sm:space-y-6">
        <MarqueeRow images={rowA} duration={72} startIndex={0} />
        <MarqueeRow images={rowB} duration={54} startIndex={3} />
      </div>

      <style jsx>{`
        .gallery-band {
          -webkit-mask-image: linear-gradient(to right, transparent, #000 7%, #000 93%, transparent);
          mask-image: linear-gradient(to right, transparent, #000 7%, #000 93%, transparent);
        }
        .gallery-row {
          animation-name: drift-right;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @keyframes drift-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .gallery-card {
          animation: bob 7s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery-row, .gallery-card { animation: none; }
        }
      `}</style>
    </section>
  );
}
