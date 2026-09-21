'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Star } from 'lucide-react';
import { trendingProducts } from './data';

export default function TrendingProducts() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-10 lg:mb-12">
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-orange-100 text-[#FA3728] rounded-full text-[11px] sm:text-sm font-semibold mb-2 sm:mb-4">
            Trending Now
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-1.5 sm:mb-4">
            Popular Products
          </h2>
          <p className="text-xs sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover what&apos;s trending on ShopAm
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 lg:gap-4">
          {trendingProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg sm:rounded-lg lg:rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="relative w-full aspect-square sm:aspect-[4/3] bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  quality={70}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23f3f4f6" width="150" height="150"/%3E%3C/svg%3E';
                  }}
                />
                {product.discount && (
                  <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 px-1.5 py-0.5 bg-[#FA3728] text-white text-[9px] sm:text-[10px] font-bold rounded">
                    -{product.discount}%
                  </span>
                )}
                <button className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart size={12} className="sm:w-3.5 sm:h-3.5 text-gray-700" />
                </button>
                <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 px-1.5 py-0.5 bg-white/95 backdrop-blur-sm rounded-full text-[9px] sm:text-[10px] font-semibold flex items-center gap-0.5">
                  <Star size={9} className="sm:w-2.5 sm:h-2.5 text-amber-400 fill-amber-400" />
                  {product.rating}
                </div>
              </div>

              <div className="p-2 sm:p-2.5 lg:p-3">
                <p className="text-[9px] sm:text-[10px] text-gray-500 mb-0.5 truncate">{product.vendor}</p>
                <h3 className="font-semibold text-[11px] sm:text-xs lg:text-sm text-gray-900 mb-1 line-clamp-2 leading-snug">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-sm sm:text-sm lg:text-base font-bold text-[#FA3728]">
                    ₦{product.price.toLocaleString()}
                  </p>
                  {product.originalPrice && (
                    <p className="text-[9px] sm:text-[10px] text-gray-400 line-through">
                      ₦{product.originalPrice.toLocaleString()}
                    </p>
                  )}
                </div>
                <p className="text-[9px] sm:text-[10px] text-gray-500">({product.reviews} reviews)</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10 lg:mt-12">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 lg:py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-semibold transition-all shadow-md text-sm sm:text-base active:scale-95"
          >
            View All Products
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
