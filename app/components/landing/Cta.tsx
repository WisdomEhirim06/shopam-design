'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Cta() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-gradient-to-br from-[#FA3728] to-[#E31B23] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-sm sm:text-lg lg:text-2xl text-white/90 mb-6 sm:mb-8">
            Join thousands of happy customers shopping on ShopAm today
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/explore"
              className="px-6 sm:px-8 py-3 sm:py-3 lg:py-4 bg-white text-[#FA3728] rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl text-sm sm:text-base lg:text-lg active:scale-95"
            >
              Start Shopping
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 sm:px-8 py-3 sm:py-3 lg:py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-all text-sm sm:text-base lg:text-lg active:scale-95"
            >
              Become a Vendor
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
