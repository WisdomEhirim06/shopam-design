'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, Loader2 } from 'lucide-react';
import { productsService } from '@/lib/api/products';
import type { UIProduct } from './product-form';
import ProductCard from './ProductCard';
import AddProductModal from './AddProductModal';

export default function ProductsPage() {
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productsService.getMyProducts();
      setProducts(data);
    } catch {
      // keep empty list silently
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: string) =>
    `₦${parseFloat(price).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

  return (
    <div className="px-4 py-2 md:p-8 space-y-6 max-w-lg mx-auto md:max-w-none relative min-h-screen">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">Products</h1>
          <p className="text-gray-500 text-sm md:text-base mt-0.5">
            {isLoading ? 'Loading…' : `${products.length} item${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#FA3728] hover:bg-[#E31B23] text-white px-4 py-2 rounded-full font-medium text-sm transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add New
        </button>
      </motion.div>

      {/* Product List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 pb-8"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#FA3728]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Package size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No products yet</p>
            <p className="text-gray-400 text-sm mt-1">Tap "Add New" to create your first listing</p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} formatPrice={formatPrice} />
          ))
        )}
      </motion.div>

      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={(newProduct) => setProducts((prev) => [newProduct, ...prev])}
      />
    </div>
  );
}
