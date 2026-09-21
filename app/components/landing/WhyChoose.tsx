'use client';

import { motion } from 'framer-motion';
import { benefits } from './data';

export default function WhyChoose() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-10 lg:mb-12">
          <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-1.5 sm:mb-4">
            Why Choose ShopAm?
          </h2>
          <p className="text-xs sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;re committed to providing the best shopping experience
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-3 sm:p-6 lg:p-8 rounded-xl sm:rounded-xl lg:rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#FA3728]/10 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 lg:mb-6">
                  <Icon className="text-[#FA3728] w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                </div>
                <h3 className="text-[11px] sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-3 lg:mb-4 leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-[9px] sm:text-sm lg:text-base text-gray-600 leading-relaxed hidden sm:block">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
