'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  vendor: {
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
    location?: string;
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
        location: 'Lagos, Nigeria',
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
        location: 'Abuja, Nigeria',
      },
      price: 15000,
      quantity: 2,
      image: '/api/placeholder/120/120',
    },
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
    setSelectedItems(selectedItems.filter((selectedId) => selectedId !== id));
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  const toggleSelectVendor = (vendorName: string, items: CartItem[]) => {
    const vendorItemIds = items.map((item) => item.id);
    const allSelected = vendorItemIds.every((id) => selectedItems.includes(id));
    
    if (allSelected) {
      setSelectedItems((prev) => prev.filter((id) => !vendorItemIds.includes(id)));
    } else {
      setSelectedItems((prev) => {
        const newSelection = new Set([...prev, ...vendorItemIds]);
        return Array.from(newSelection);
      });
    }
  };

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
  
  const selectedSubtotal = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-36">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/explore"
              className="flex items-center gap-2 text-gray-900 hover:text-[#FA3728] transition-colors"
            >
              <ArrowLeft size={24} />
              <span className="font-bold text-xl hidden sm:inline">My Cart</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 sm:hidden">My Cart</h1>
            <button
              onClick={selectAll}
              className="text-[#FA3728] font-medium"
            >
              Select All ({cartItems.length})
            </button>
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
              </Link>
            </div>
          ) : (
            /* Grouped Cart Items */
            vendorGroups.map((group, groupIndex) => {
              const groupSubtotal = group.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
              const vendorSlug = group.vendor.name.toLowerCase().replace(/\s+/g, '-');
              const vendorItemIds = group.items.map((item) => item.id);
              const isVendorSelected = vendorItemIds.every((id) => selectedItems.includes(id));

              return (
                <motion.div
                  key={group.vendor.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Vendor Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={isVendorSelected}
                      onChange={() => toggleSelectVendor(group.vendor.name, group.items)}
                      className="w-5 h-5 border-gray-300 rounded text-[#FA3728] focus:ring-[#FA3728] cursor-pointer"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FA3728] to-[#E31B23] flex items-center justify-center text-white font-bold text-lg">
                        {group.vendor.name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 leading-tight">
                          {group.vendor.name}
                        </h3>
                        {group.vendor.location && (
                          <p className="text-sm text-gray-500">{group.vendor.location}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Vendor Items */}
                  <div className="divide-y divide-gray-50">
                    {group.items.map((item) => (
                      <div key={item.id} className="p-4 flex flex-row items-center gap-4">
                        {/* Item Checkbox */}
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          className="w-5 h-5 border-gray-300 rounded text-[#FA3728] focus:ring-[#FA3728] cursor-pointer"
                        />
                        
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-xl overflow-hidden block">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                            {item.name}
                          </h4>
                          <p className="font-bold text-[#FA3728]">₦{item.price.toLocaleString()}</p>
                          
                          {/* Controls Row */}
                          <div className="flex items-center justify-between mt-3">
                             {/* Quantity Controls */}
                            <div className="flex items-center bg-gray-50 rounded-full px-2 py-1 border border-gray-100">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-full transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="font-semibold text-gray-900 w-8 text-center bg-transparent">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center text-[#FA3728] bg-[#FA3728]/10 hover:bg-[#FA3728]/20 rounded-full transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            
                            <button onClick={() => removeItem(item.id)} className="text-[#FA3728] p-2 hover:bg-[#FA3728]/10 rounded-full transition-colors">
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Vendor Subtotal & Order */}
                  <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                     <div>
                       <span className="block text-gray-500 text-sm mb-1">Subtotal</span>
                       <span className="font-bold text-gray-900 text-lg">₦{groupSubtotal.toLocaleString()}</span>
                     </div>
                     <Link
                       href={`/chats/${vendorSlug}`}
                       className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FA3728]/20 hover:bg-[#FA3728]/30 text-[#FA3728] font-semibold rounded-full transition-colors"
                     >
                       <MessageCircle size={18} />
                       Order via Chat
                     </Link>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
      
      {/* Fixed Bottom Total Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm font-medium">
                {selectedItems.length} of {cartItems.length} selected
              </span>
              <span className="text-2xl font-bold text-gray-900">
                Total = ₦{selectedSubtotal.toLocaleString()}
              </span>
            </div>
            <button
              disabled={selectedItems.length === 0}
              className="w-full py-3.5 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-xl font-bold text-lg text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              <MessageCircle size={22} />
              Order Selected via Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}