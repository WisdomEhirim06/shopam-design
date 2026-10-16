'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, MessageCircle, ShoppingBag, Loader2 } from 'lucide-react';
import { cartService } from '@/lib/api/cart';
import { ordersService } from '@/lib/api';
import { Cart, SubCart } from '@/lib/api/types';
import { money } from '@/lib/order-steps';
import AppBar from '@/app/components/ui/AppBar';
import BottomNav from '@/app/components/BottomNav';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      if (cart) {
        const updatedSubcarts = cart.subcarts.map((sub) => ({
          ...sub,
          items: sub.items.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item)),
        }));
        setCart({ ...cart, subcarts: updatedSubcarts });
      }

      await cartService.updateQuantity(itemId, newQty);
      fetchCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
      fetchCart();
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      if (cart) {
        const updatedSubcarts = cart.subcarts
          .map((sub) => ({ ...sub, items: sub.items.filter((item) => item.id !== itemId) }))
          .filter((sub) => sub.items.length > 0);
        setCart({ ...cart, subcarts: updatedSubcarts });
      }

      await cartService.removeFromCart(itemId);
      fetchCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
      fetchCart();
    }
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

  const placeOrder = async (subcart: SubCart) => {
    if (isGuest) {
      window.location.href = '/auth/signin?redirect=/cart';
      return;
    }
    setOrderError('');
    setPlacingVendor(subcart.id);
    try {
      const orders = await ordersService.createOrder({ target_type: 'subcart', target_id: subcart.id }, subcart);
      const order = orders[0];
      if (!order?.id) throw new Error('No order returned');
      router.push(`/chats/${order.id}`);
    } catch {
      setOrderError('Could not start this order. Please try again.');
      setPlacingVendor(null);
    }
  };

  const hasItems = cart && cart.subcarts.length > 0;

  return (
    <div className="min-h-screen bg-canvas pb-28 md:pb-16">
      <AppBar
        title="Cart"
        backHref="/explore"
        action={
          hasItems ? (
            <button
              onClick={handleClearCart}
              className="shrink-0 text-[12px] font-bold text-slate-600 transition-colors hover:text-[#FA3728]"
            >
              Clear all
            </button>
          ) : undefined
        }
      />

      <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 sm:px-6">
        {isGuest && (
          <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-amber-800">
              You&rsquo;re shopping as a guest. Sign in to check out and keep your cart across devices.
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
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{orderError}</div>
        )}

        {isLoading && !cart ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-[#FA3728]" size={30} />
          </div>
        ) : !hasItems ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <ShoppingBag size={28} />
            </span>
            <h2 className="text-lg font-bold text-ink">Your cart is empty</h2>
            <p className="text-sm text-slate-600">Add products to get started.</p>
            <Link
              href="/explore"
              className="mt-1 rounded-full bg-[#FA3728] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#E31B23]"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          cart.subcarts.map((subcart, index) => {
            const subtotal = subcart.items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

            return (
              <motion.div
                key={subcart.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white"
              >
                {/* Vendor header */}
                <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FA3728] to-[#E31B23] text-sm font-bold text-white">
                    {subcart.vendor_name[0]}
                  </span>
                  <h3 className="truncate text-sm font-bold text-ink">{subcart.vendor_name}</h3>
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-50">
                  {subcart.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3.5 p-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        {item.product_details?.images?.[0]?.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.product_details.images[0].image_url}
                            alt={item.product_details.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag className="text-slate-400" size={22} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-2 text-sm font-semibold text-ink">{item.product_details.title}</h4>
                        <p className="mt-1 text-sm font-bold text-[#FA3728]">{money(parseFloat(item.total_price))}</p>

                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-0.5 rounded-full border border-slate-200 p-0.5">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40"
                            >
                              <Minus size={15} />
                            </button>
                            <span className="w-7 text-center text-sm font-bold text-ink">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                              aria-label="Increase quantity"
                              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
                            >
                              <Plus size={15} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            aria-label="Remove item"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal + action */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-3.5">
                  <div>
                    <span className="block text-[11px] text-slate-500">Subtotal</span>
                    <span className="text-base font-bold text-ink">{money(subtotal)}</span>
                  </div>
                  <button
                    onClick={() => placeOrder(subcart)}
                    disabled={placingVendor === subcart.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#FA3728] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#E31B23] disabled:opacity-60"
                  >
                    {placingVendor === subcart.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <MessageCircle size={16} />
                    )}
                    {placingVendor === subcart.id ? 'Starting…' : isGuest ? 'Sign in to order' : 'Order via chat'}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}

        {error && <p className="px-1 text-center text-xs text-red-500">{error}</p>}
      </div>

      <BottomNav />
    </div>
  );
}
