'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  ArrowRight,
  ArrowLeft,
  MoreVertical,
  Star,
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  vendor: {
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
  };
  price: number;
  quantity: number;
  size?: string;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'African Print Dress',
      vendor: {
        name: "Sarah's Fashion",
        avatar: '/api/placeholder/50/50',
        rating: 4.9,
        reviews: 4600,
      },
      price: 28000,
      quantity: 1,
      size: '2XL',
      image: '/api/placeholder/120/120',
    },
    {
      id: '2',
      name: 'Wireless Earbuds Pro',
      vendor: {
        name: 'TechHub Nigeria',
        avatar: '/api/placeholder/50/50',
        rating: 4.8,
        reviews: 2300,
      },
      price: 15000,
      quantity: 2,
      image: '/api/placeholder/120/120',
    },
  ]);

  const recentlyViewed = [
    {
      id: '1',
      name: 'Smart Watch Series 5',
      vendor: 'Electronics Plus',
      price: 45000,
      image: '/api/placeholder/200/200',
    },
    {
      id: '2',
      name: 'Leather Handbag',
      vendor: 'Fashion Corner',
      price: 32000,
      image: '/api/placeholder/200/200',
    },
  ];

  const updateQuantity = (id: string, change: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Group cart items by vendor
  const groupedItems = cartItems.reduce((groups, item) => {
    const vendorName = item.vendor.name;
    if (!groups[vendorName]) {
      groups[vendorName] = {
        vendor: item.vendor,
        items: []
      };
    }
    groups[vendorName].items.push(item);
    return groups;
  }, {} as Record<string, { vendor: any, items: CartItem[] }>);

  const vendorGroups = Object.values(groupedItems);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/explore"
              className="flex items-center gap-2 text-gray-700 hover:text-[#FA3728] transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium hidden sm:inline">Continue Shopping</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Cart ({cartItems.length} items)</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={40} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add items to get started</p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-semibold transition-all shadow-md"
              >
                Start Shopping
                <ArrowRight size={20} />
              </Link>
            </div>
          ) : (
            /* Grouped Cart Items */
            vendorGroups.map((group, groupIndex) => {
              const groupSubtotal = group.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
              const vendorSlug = group.vendor.name.toLowerCase().replace(/\s+/g, '-');
              return (
                <motion.div
                  key={group.vendor.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Vendor Header */}
                  <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FA3728]/10 flex items-center justify-center text-[#FA3728] font-bold text-sm">
                        {group.vendor.name[0]}
                      </div>
                      <h3 className="font-bold text-gray-900 leading-tight text-sm sm:text-base">
                        {group.vendor.name}
                      </h3>
                    </div>
                    <Link
                      href={`/chats/${vendorSlug}`}
                      className="inline-flex items-center justify-center px-4 py-1.5 sm:px-6 sm:py-2 bg-[#FA3728] hover:bg-[#E31B23] text-white text-xs sm:text-sm font-semibold rounded-full md:rounded-xl transition-colors shadow-sm"
                    >
                      Order
                    </Link>
                  </div>

                  {/* Vendor Items */}
                  <div className="divide-y divide-gray-50">
                    {group.items.map((item, index) => (
                      <div key={item.id} className="p-3 sm:p-4 flex flex-row gap-3 sm:gap-4">
                        {/* Product Image */}
                        <Link
                          href={`/products/${item.id}`}
                          className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden group block"
                        >
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-105 transition-transform"></div>
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <Link href={`/products/${item.id}`}>
                                <h4 className="font-semibold text-gray-900 hover:text-[#FA3728] transition-colors truncate text-sm sm:text-base">
                                  {item.name}
                                </h4>
                              </Link>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-[#FA3728] transition-colors flex-shrink-0 p-1">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          {/* Price & Quantity Row */}
                          <div className="flex items-center justify-between mt-2">
                             <p className="font-bold text-[#FA3728] text-sm sm:text-base">₦{item.price.toLocaleString()}</p>
                             
                             {/* Quantity Controls */}
                            <div className="flex items-center justify-between w-24 sm:w-28 bg-gray-50 rounded-full px-2 py-1.5 border border-gray-100">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 sm:w-8 sm:h-8 flex flex-shrink-0 items-center justify-center text-gray-600 hover:bg-white rounded-full transition-colors shadow-sm"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-semibold text-gray-900 w-6 text-center text-sm bg-transparent">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 sm:w-8 sm:h-8 flex flex-shrink-0 items-center justify-center text-gray-600 hover:bg-white rounded-full transition-colors shadow-sm"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Vendor Subtotal */}
                  <div className="p-3 sm:p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                     <span className="text-gray-500 text-sm font-medium">Subtotal</span>
                     <span className="font-bold text-gray-900">₦{groupSubtotal.toLocaleString()}</span>
                  </div>
                </motion.div>
              );
            })
          )}
          
          {/* Bottom Total & Order All */}
          {cartItems.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between p-6 gap-4 border-t border-gray-200">
              <div className="flex flex-col sm:items-start items-center w-full sm:w-auto">
                <span className="text-gray-500 text-sm font-medium">Total</span>
                <span className="text-2xl font-bold text-[#FA3728]">₦{subtotal.toLocaleString()}</span>
              </div>
              <Link
                href="/chats"
                className="w-full sm:w-auto px-12 py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-xl font-bold text-lg text-center transition-all shadow-md hover:shadow-lg"
              >
                Order All
              </Link>
            </div>
          )}
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recently viewed</h2>
              <Link
                href="/explore"
                className="flex items-center gap-2 text-[#FA3728] hover:text-[#E31B23] font-medium transition-colors"
              >
                View all
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentlyViewed.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100"
                >
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart size={18} className="text-gray-700" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1">{product.vendor}</p>
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-[#FA3728] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-[#FA3728]">
                        ₦{product.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}