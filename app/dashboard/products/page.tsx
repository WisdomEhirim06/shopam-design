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

  useEffect(() => {
    loadProducts();
  }, []);

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
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink md:text-3xl">Products</h1>
          <p className="mt-0.5 text-sm text-slate-500 md:text-base">
            {isLoading ? 'Loading…' : `${products.length} item${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#FA3728]"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add New
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#FA3728]" />
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center">
            <Package size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="font-medium text-slate-500">No products yet</p>
            <p className="mt-1 text-sm text-slate-400">Tap &ldquo;Add New&rdquo; to create your first listing</p>
          </div>
        ) : (
          products.map((product) => <ProductCard key={product.id} product={product} formatPrice={formatPrice} />)
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
