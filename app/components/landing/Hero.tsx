'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides } from './data';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative h-[65vh] sm:h-[70vh] lg:h-[90vh] min-h-[420px] sm:min-h-[500px] max-h-[900px] overflow-hidden">
      {/* Render all slides stacked, crossfade via opacity */}
      {heroSlides.map((slide, index) => (
        <motion.div
          key={index}
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0"
          style={{ zIndex: index === currentSlide ? 1 : 0 }}
        >
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt="Shopping"
              fill
              sizes="100vw"
              quality={85}
              priority={index === 0}
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-gray-900/40 sm:bg-gradient-to-r sm:from-gray-900/90 sm:via-gray-900/70 sm:to-gray-900/50"></div>
          </div>
        </motion.div>
      ))}

      {/* Text overlay - always on top */}
      <div className="relative z-10 h-full flex items-center pt-8 sm:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <h1 className="text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.15] sm:leading-tight mb-3 sm:mb-4 lg:mb-6">
                  {heroSlides[currentSlide].title}{' '}
                  <span className="text-[#FA3728]">{heroSlides[currentSlide].titleHighlight}</span>
                  {heroSlides[currentSlide].titleEnd && (
                    <> {heroSlides[currentSlide].titleEnd}</>
                  )}
                </h1>

                <p className="text-[15px] sm:text-lg md:text-xl lg:text-2xl text-white/85 mb-5 sm:mb-6 lg:mb-10 leading-relaxed max-w-[280px] sm:max-w-none">
                  {heroSlides[currentSlide].subtitle}
                </p>

                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 lg:py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-semibold text-sm sm:text-base lg:text-lg transition-all shadow-xl hover:shadow-2xl active:scale-95"
                >
                  Explore Products
                  <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute z-10 left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-black/25 backdrop-blur-sm hover:bg-black/50 hidden sm:flex items-center justify-center text-white transition-all active:scale-90"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute z-10 right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-black/25 backdrop-blur-sm hover:bg-black/50 hidden sm:flex items-center justify-center text-white transition-all active:scale-90"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>
    </section>
  );
}
