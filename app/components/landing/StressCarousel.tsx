'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { stressPhrases } from './data';

export default function StressCarousel() {
  const [currentStressPhrase, setCurrentStressPhrase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStressPhrase((prev) => (prev + 1) % stressPhrases.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Image - crossfade, no white flash */}
          <div className="order-1">
            <div className="relative aspect-[4/3] rounded-xl sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-xl sm:shadow-xl lg:shadow-2xl">
              {stressPhrases.map((phrase, index) => (
                <motion.div
                  key={index}
                  animate={{ opacity: index === currentStressPhrase ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="absolute inset-0"
                  style={{ zIndex: index === currentStressPhrase ? 1 : 0 }}
                >
                  <Image
                    src={phrase.image}
                    alt="Shopping experience"
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    quality={75}
                    priority={index === 0}
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="order-2 text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStressPhrase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <h2
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 sm:mb-4 lg:mb-6 ${stressPhrases[currentStressPhrase].isResolution
                    ? 'text-[#FA3728]'
                    : 'text-gray-900'
                    }`}
                >
                  {stressPhrases[currentStressPhrase].text}
                </h2>

                {stressPhrases[currentStressPhrase].isResolution && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-600"
                  >
                    Verified vendors. Real products. Trusted service.
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-1.5 sm:gap-2 mt-4 sm:mt-4 lg:mt-6">
              {stressPhrases.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 sm:h-1 rounded-full transition-all ${index === currentStressPhrase ? 'w-8 sm:w-8 bg-[#FA3728]' : 'w-4 sm:w-4 bg-gray-300'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
