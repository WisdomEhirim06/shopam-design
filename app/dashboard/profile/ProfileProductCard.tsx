import { motion } from 'framer-motion';
import { Edit3 } from 'lucide-react';
import type { ProductService } from '@/lib/api/types';

export default function ProfileProductCard({ product }: { product: ProductService }) {
  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 group flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] w-full bg-gray-50">
        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-xl sm:rounded-t-2xl text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {product.item_type || 'product'}
        </div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow bg-white border-t border-gray-50/50">
        <h3 className="font-semibold text-xs sm:text-sm text-gray-800 mb-1 line-clamp-2 leading-snug">{product.title}</h3>
        <p className="text-[10px] sm:text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
        <div className="mt-auto pt-1 flex justify-between items-end">
           <span className="font-extrabold text-sm sm:text-[15px] text-[#FA3728]">₦{Number(product.price).toLocaleString()}</span>
           <button className="text-gray-400 hover:text-gray-700 transition-colors p-1" aria-label="Edit product">
              <Edit3 size={14} />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
