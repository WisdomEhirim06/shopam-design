'use client';

import { motion } from 'framer-motion';
import { categories } from './data';

export default function Categories() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-10 lg:mb-12">
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-pink-100 text-[#FA3728] rounded-full text-[11px] sm:text-sm font-semibold mb-2 sm:mb-4">
            Categories
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-1.5 sm:mb-4">
            Popular Categories
          </h2>
          <p className="text-xs sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore services across multiple categories
          </p>
        </div>

        {/* Mobile: 4-column compact grid */}
        <div className="sm:hidden">
          <div className="grid grid-cols-4 gap-2.5">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  className={`${category.color} ${category.textColor} p-2 py-3 rounded-xl hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center`}
                >
                  <div className={`${category.iconBg} w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform`}>
                    <Icon size={16} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-[10px] leading-tight">{category.name}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${category.color} ${category.textColor} p-4 lg:p-6 rounded-xl lg:rounded-2xl hover:shadow-lg transition-all cursor-pointer group`}
              >
                <div className={`${category.iconBg} w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className="lg:w-6 lg:h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base leading-tight">{category.name}</h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
