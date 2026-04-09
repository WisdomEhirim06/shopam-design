'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, X, Image as ImageIcon, Package } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  sold: number;
  category: string;
  status: 'Active' | 'Inactive';
  image?: string;
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'African Print Dress',
    description: 'Elegant print dress',
    price: '₦30,000',
    stock: 15,
    sold: 89,
    category: 'Clothing',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Pattern Basket Set',
    description: 'Handwoven set',
    price: '₦12,500',
    stock: 8,
    sold: 120,
    category: 'Home',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Atinuke Cloth Scarf',
    description: 'Traditional scarf',
    price: '₦8,000',
    stock: 25,
    sold: 45,
    category: 'Accessories',
    status: 'Active',
  },
];

export default function ProductsPage() {
  const [products] = useState<Product[]>(initialProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    description: '',
    price: '',
    stock: '',
    category: ''
  });

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
          <p className="text-gray-500 text-sm md:text-base mt-0.5">{products.length} items</p>
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
        {products.map((product, index) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-red-100 hover:shadow-md transition-all relative"
          >
            {/* Status and More actions */}
            <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
              <span className="text-[10px] md:text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                {product.status}
              </span>
            </div>
            
            <button className="absolute bottom-4 right-4 text-gray-400 hover:text-gray-900 transition-colors">
              <MoreVertical size={20} />
            </button>

            <div className="flex gap-4 pr-16">
              {/* Product Image Placeholder */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-gray-400 flex-shrink-0">
                {index === 0 && <div className="text-blue-400"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L8 6H3v12h18V6h-5l-4-4zm-1 2.8l2.8 2.8H15v10H9V7.6h1.8c.2 0 .5-.1.7-.2L11 4.8z"/></svg></div>}
                {index === 1 && <div className="text-amber-600"><Package size={24} /></div>}
                {index === 2 && <div className="text-pink-500"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm-1-10h2v4h-2zm0 6h2v2h-2z"/></svg></div>}
                {index > 2 && <ImageIcon size={24} />}
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight mb-1 truncate">
                  {product.name}
                </h3>
                <p className="font-bold text-gray-900 text-sm md:text-base mb-2">
                  {product.price}
                </p>
                <div className="flex items-center gap-3 text-[10px] md:text-xs text-gray-500 font-medium">
                  <span>{product.stock} in stock</span>
                  <span>{product.sold} sold</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Add Product Modal (Slide-up style) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            />
            {/* Desktop Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="hidden md:block absolute inset-0 bg-black/5 bg-opacity-20 backdrop-blur-[2px] z-50 rounded-2xl"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 md:absolute md:top-auto md:bottom-0 z-50 bg-white rounded-t-3xl md:rounded-b-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6"
            >
              {/* Drag handle for mobile */}
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:hidden" />

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FA3728] text-white flex items-center justify-center hover:bg-[#E31B23] transition-colors"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              <form className="space-y-4 pb-8 md:pb-2" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter product description"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all resize-none h-24"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₦) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                      className="w-full bg-gray-50 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      placeholder="0"
                      className="w-full bg-gray-50 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="e.g., Clothing"
                    className="w-full bg-gray-50 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all mb-4"
                  />
                </div>
                
                <button className="w-full py-3.5 bg-[#FA3728] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#E31B23] transition-colors">
                  Save Product
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}