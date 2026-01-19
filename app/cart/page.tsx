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

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-xl font-bold text-gray-900">Cart ({cartItems.length})</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              /* Empty Cart State */
              <div className="bg-white rounded-2xl p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag size={40} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add items to get started</p>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-semibold transition-all"
                >
                  Start Shopping
                  <ArrowRight size={20} />
                </Link>
              </div>
            ) : (
              /* Cart Items */
              cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Vendor Info */}
                  <Link
                    href={`/vendors/${item.vendor.name}`}
                    className="flex items-center gap-3 mb-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FA3728] to-[#E31B23] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {item.vendor.name[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#FA3728] transition-colors">
                        {item.vendor.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="font-medium">{item.vendor.rating}</span>
                        <span>({item.vendor.reviews.toLocaleString()})</span>
                      </div>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.id}`}
                      className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-xl overflow-hidden group"
                    >
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-105 transition-transform"></div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.id}`}>
                            <h4 className="font-semibold text-gray-900 hover:text-[#FA3728] transition-colors line-clamp-2">
                              {item.name}
                            </h4>
                          </Link>
                          {item.size && (
                            <p className="text-sm text-gray-600 mt-1">Size: {item.size}</p>
                          )}
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                          <MoreVertical size={18} className="text-gray-600" />
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xl font-bold text-[#FA3728]">
                          ₦{item.price.toLocaleString()}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                          >
                            <Minus size={16} className="text-gray-700" />
                          </button>
                          <span className="font-semibold text-gray-900 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                          >
                            <Plus size={16} className="text-gray-700" />
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-4 mt-4">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#FA3728] font-medium transition-colors">
                          <Heart size={16} />
                          Save for later
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Checkout Summary - Right Side (Sticky) */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="text-sm text-green-600 font-medium">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-gray-900">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold">₦{subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-bold text-center transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-4"
                >
                  Continue to checkout
                  <ArrowRight size={20} />
                </Link>

                {/* Additional Info */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Taxes and shipping calculated at checkout
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="mt-12">
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
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart size={18} className="text-gray-700" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-600 mb-1">{product.vendor}</p>
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