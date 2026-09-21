'use client';

import { motion } from 'framer-motion';

const stats = [
  { number: '500+', label: 'Vendors Ready' },
  { number: '50+', label: 'Categories' },
  { number: '24/7', label: 'Support' },
];

export default function Stats() {
  return (
    <section className="bg-gray-900 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl lg:text-5xl font-bold text-[#FA3728] mb-1 sm:mb-2">{stat.number}</div>
              <div className="text-[11px] sm:text-sm lg:text-base text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
