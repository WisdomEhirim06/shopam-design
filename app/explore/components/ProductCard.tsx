'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@/lib/api';

export default function ProductCard({
  product,
  index,
  onAddToCart,
}: {
  product: Product;
  index: number;
  onAddToCart: (productId: string) => void;
}) {
  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer p-2.5 sm:p-3 rounded-2xl border border-gray-100/80 hover:border-[#FA3728]/20 transition-all hover:bg-white hover:shadow-xl shadow-sm bg-white"
    >
      <Link href={`/products/${product.id}`}>
        {/* Product Image Area (STRICT SQUARE) */}
        <div className="relative aspect-square rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm border border-gray-100 overflow-hidden mb-3">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FA3728]/5 to-transparent flex items-center justify-center text-gray-300">
            <ShoppingCart size={32} className="opacity-40" />
          </div>

          {/* Rating Badge */}
          {parseFloat(product.average_rating) > 0 && (
            <div className="absolute bottom-2 left-2">
              <div className="px-2 py-0.5 bg-white/95 backdrop-blur-sm rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm border border-gray-50">
                <Star size={10} className="text-amber-500 fill-amber-500" />
                {parseFloat(product.average_rating).toFixed(1)}
              </div>
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="px-1">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm truncate group-hover:text-[#FA3728] transition-colors">
              {product.title}
            </h3>
          </div>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2 truncate">
            {product.owner_name || 'ShopAm Vendor'}
          </p>

          <div className="flex items-center justify-between gap-1">
            <p className="text-sm sm:text-base font-black text-[#FA3728]">
              ₦{parseFloat(product.price).toLocaleString()}
            </p>

            {/* Small Add to Cart Icon Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(product.id);
              }}
              className="p-1.5 bg-[#FA3728]/10 hover:bg-[#FA3728] text-[#FA3728] hover:text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <ShoppingCart size={14} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
