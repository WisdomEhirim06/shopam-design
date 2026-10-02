'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ArrowLeft,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import { cartService } from '@/lib/api/cart';
import { ordersService } from '@/lib/api';
import { Cart, SubCart, CartItem } from '@/lib/api/types';



export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [placingVendor, setPlacingVendor] = useState<string | null>(null);
  const [orderError, setOrderError] = useState('');
  const router = useRouter();

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Could not load your cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Guests can add to and view their cart locally. An account is only
    // required at checkout (the guest cart is merged after sign-in).
    setIsGuest(!localStorage.getItem('user'));
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: string, currentQty: number, change: number) => {
    const newQty = Math.max(1, currentQty + change);
    if (newQty === currentQty) return;

    try {
      // Optimistic update
      if (cart) {
        const updatedSubcarts = cart.subcarts.map(sub => ({
          ...sub,
          items: sub.items.map(item => 
            item.id === itemId ? { ...item, quantity: newQty } : item
          )
        }));
        setCart({ ...cart, subcarts: updatedSubcarts });
      }

      await cartService.updateQuantity(itemId, newQty);
      // Re-fetch to sync with server (price calculations, etc.)
      fetchCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
      fetchCart(); // Rollback on error
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      // Optimistic update
      if (cart) {
        const updatedSubcarts = cart.subcarts.map(sub => ({
          ...sub,
          items: sub.items.filter(item => item.id !== itemId)
        })).filter(sub => sub.items.length > 0);
        setCart({ ...cart, subcarts: updatedSubcarts });
      }

      await cartService.removeFromCart(itemId);
      fetchCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
      fetchCart();
    }
  };

  const toggleSelectVendor = (vendorId: string) => {
    setSelectedVendors((prev) => 
      prev.includes(vendorId) 
        ? prev.filter((id) => id !== vendorId) 
        : [...prev, vendorId]
    );
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your entire cart?')) return;
    try {
      setIsLoading(true);
      await cartService.clearCart();
      await fetchCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart.');
    } finally {
      setIsLoading(false);
    }
  };

  const placeOrder = async (subcartId: string) => {
    if (isGuest) {
      window.location.href = '/auth/signin?redirect=/cart';
      return;
    }
    setOrderError('');
    setPlacingVendor(subcartId);
    try {
      const orders = await ordersService.createOrder({ target_type: 'subcart', target_id: subcartId });
      const order = orders[0];
      if (!order?.id) throw new Error('No order returned');
      router.push(`/chats/${order.id}`);
    } catch {
      setOrderError('Could not start this order. Please try again.');
      setPlacingVendor(null);
    }
  };

  if (isLoading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-[#FA3728] animate-spin" />
      </div>
    );
  }

  const hasItems = cart && cart.subcarts.length > 0;

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
            {hasItems && (
              <button 
                onClick={handleClearCart}
                className="text-sm font-medium text-gray-500 hover:text-[#FA3728] transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {isGuest && (
            <div className="flex flex-col justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center">
              <p className="text-sm text-amber-800">
                You&apos;re shopping as a guest. Sign in to check out and keep your cart across
                devices.
              </p>
              <Link
                href="/auth/signin?redirect=/cart"
                className="shrink-0 self-start rounded-full bg-[#FA3728] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#E31B23] sm:self-auto"
              >
                Sign in
              </Link>
            </div>
          )}

          {orderError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {orderError}
            </div>
          )}

          {!hasItems ? (
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
            cart.subcarts.map((subcart, index) => {
              const subtotal = subcart.items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
              const isVendorSelected = selectedVendors.includes(subcart.vendor_id);

              return (
                <motion.div
                  key={subcart.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Vendor Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={isVendorSelected}
                      onChange={() => toggleSelectVendor(subcart.vendor_id)}
                      className="w-5 h-5 border-gray-300 rounded text-[#FA3728] focus:ring-[#FA3728] cursor-pointer"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FA3728] to-[#E31B23] flex items-center justify-center text-white font-bold text-lg">
                        {subcart.vendor_name[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 leading-tight">
                          {subcart.vendor_name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Vendor Items */}
                  <div className="divide-y divide-gray-50">
                    {subcart.items.map((item) => (
                      <div key={item.id} className="p-4 flex flex-row items-center gap-4">
                        
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-xl overflow-hidden block">
                          {item.product_details?.images?.[0]?.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.product_details.images[0].image_url}
                              alt={item.product_details.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <ShoppingBag className="text-gray-400" size={24} />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1">
                            {item.product_details.title}
                          </h4>
                          <p className="font-semibold text-sm text-[#FA3728]">₦{parseFloat(item.total_price).toLocaleString()}</p>
                          
                          {/* Controls Row */}
                          <div className="flex items-center justify-between mt-3">
                             {/* Quantity Controls */}
                            <div className="flex items-center bg-gray-50 rounded-full px-2 py-1 border border-gray-100">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-full transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="font-semibold text-gray-900 w-8 text-center bg-transparent">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                className="w-8 h-8 flex items-center justify-center text-[#FA3728] bg-[#FA3728]/10 hover:bg-[#FA3728]/20 rounded-full transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            
                            <button onClick={() => handleRemoveItem(item.id)} className="text-[#FA3728] p-2 hover:bg-[#FA3728]/10 rounded-full transition-colors">
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
                      <span className="block text-gray-500 text-xs mb-0.5">Subtotal</span>
                      <span className="font-semibold text-gray-900 text-base">₦{subtotal.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => placeOrder(subcart.id)}
                      disabled={placingVendor === subcart.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FA3728] hover:bg-[#E31B23] text-white font-semibold text-sm rounded-full transition-colors disabled:opacity-60"
                    >
                      {placingVendor === subcart.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <MessageCircle size={16} />
                      )}
                      {placingVendor === subcart.id ? 'Starting…' : 'Order via Chat'}
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
