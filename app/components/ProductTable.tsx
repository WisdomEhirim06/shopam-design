'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  activeProducts: number;
  sales: number;
  stock: number;
  status: string;
}

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="glass border-white/10 rounded-xl overflow-hidden"
    >
      <div className="p-6 border-b border-white/5">
        <h3 className="text-lg font-semibold">Top Performing Products</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Product Name</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Active Products</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Sale</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Stock</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-crimson/20 to-orange-500/20"></div>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-400">{product.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm">{product.activeProducts}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium">{product.sales}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm">{product.stock}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${product.status === 'Active' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }
                  `}>
                    {product.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}