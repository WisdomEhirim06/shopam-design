'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  Lock,
  MapPin,
  Truck,
  Loader2,
} from 'lucide-react';
import { cartService, ordersService } from '@/lib/api';
import type { Cart, SubCart } from '@/lib/api';

const DEMO_SUBCARTS: SubCart[] = [
  {
    id: 'demo-subcart-1',
    vendor_id: 'demo-vendor-1',
    vendor_name: 'Zara Lagos',
    items: [
      {
        id: 'demo-item-1',
        subcart: 'demo-subcart-1',
        product: 'demo-prod-1',
        product_details: {
          id: 'demo-prod-1', owner: 'demo-vendor-1', owner_name: 'Zara Lagos',
          title: 'African Print Dress', description: '', price: '28000',
          tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '',
          created_at: '', updated_at: '', average_rating: '0', review_count: '0',
        },
        quantity: 1, variant: null, selected_addons: [], addon_details: [], total_price: '28000',
      },
    ],
  },
  {
    id: 'demo-subcart-2',
    vendor_id: 'demo-vendor-2',
    vendor_name: 'TechHub NG',
    items: [
      {
        id: 'demo-item-2',
        subcart: 'demo-subcart-2',
        product: 'demo-prod-2',
        product_details: {
          id: 'demo-prod-2', owner: 'demo-vendor-2', owner_name: 'TechHub NG',
          title: 'Wireless Earbuds Pro', description: '', price: '15000',
          tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '',
          created_at: '', updated_at: '', average_rating: '0', review_count: '0',
        },
        quantity: 2, variant: null, selected_addons: [], addon_details: [], total_price: '30000',
      },
    ],
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [cartError, setCartError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  const [currentStep, setCurrentStep] = useState<'shipping' | 'confirm'>('shipping');
  const [shippingType, setShippingType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState({ fullName: '', street: '', city: '', state: '', phone: '', email: '' });
  const [isPlacing, setIsPlacing] = useState(false);
  const [placeError, setPlaceError] = useState('');

  useEffect(() => {
    cartService.getCart()
      .then((data) => {
        setCart(data);
        if (!data?.subcarts?.length) setIsDemo(true);
      })
      .catch(() => setIsDemo(true))
      .finally(() => setIsLoadingCart(false));
  }, []);

  const subcarts: SubCart[] = isDemo ? DEMO_SUBCARTS : (cart?.subcarts ?? []);
  const subtotal = subcarts.reduce((total, sc) =>
    total + sc.items.reduce((s, i) => s + parseFloat(i.total_price), 0), 0
  );

  const handlePlaceOrder = async () => {
    if (isDemo) {
      setPlaceError('This is demo data — add real products to your cart first.');
      return;
    }
    if (!cart) return;
    setPlaceError('');
    setIsPlacing(true);

    try {
      const results = await Promise.all(
        subcarts.map((sc) => ordersService.createOrder({ target_type: 'subcart', target_id: sc.id }))
      );
      // Redirect to the first created order's chat, or orders list if multiple
      const firstOrderId = results[0]?.[0]?.id;
      router.push(firstOrderId ? `/chats/${firstOrderId}` : '/chats');
    } catch (err: any) {
      setPlaceError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to place order. Please try again.'
      );
      setIsPlacing(false);
    }
  };

  if (isLoadingCart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#FA3728]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/cart" className="flex items-center gap-2 text-gray-700 hover:text-[#FA3728] transition-colors">
              <ArrowLeft size={20} />
              <span className="font-medium hidden sm:inline">Back to Cart</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
            <div className="w-24 flex justify-end"><Lock size={18} className="text-gray-400" /></div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left — Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#FA3728] rounded-full z-0 transition-all duration-500"
                  style={{ width: currentStep === 'confirm' ? '100%' : '50%' }} />
                {['Shipping', 'Confirm'].map((label, i) => {
                  const active = (i === 0 && currentStep === 'shipping') || (i === 1 && currentStep === 'confirm');
                  const done = i === 0 && currentStep === 'confirm';
                  return (
                    <div key={label} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${active || done ? 'bg-[#FA3728] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {done ? <Check size={14} /> : i + 1}
                      </div>
                      <span className={`text-sm font-semibold ${active || done ? 'text-gray-900' : 'text-gray-500'}`}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {currentStep === 'shipping' && (
                <motion.div key="shipping" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                  {/* Shipping Address */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                        <MapPin size={20} className="text-[#FA3728]" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Full Name', key: 'fullName', placeholder: 'John Doe', col: 2 },
                        { label: 'Street Address', key: 'street', placeholder: '123 Main St', col: 2 },
                        { label: 'City', key: 'city', placeholder: 'Lagos', col: 1 },
                        { label: 'State', key: 'state', placeholder: 'Lagos State', col: 1 },
                        { label: 'Phone', key: 'phone', placeholder: '+234 800 000 0000', col: 1 },
                        { label: 'Email', key: 'email', placeholder: 'you@example.com', col: 1 },
                      ].map(({ label, key, placeholder, col }) => (
                        <div key={key} className={col === 2 ? 'md:col-span-2' : ''}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                          <input
                            type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                            value={address[key as keyof typeof address]}
                            onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                            placeholder={placeholder}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#FA3728] focus:ring-1 focus:ring-[#FA3728] outline-none transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery method */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                        <Truck size={20} className="text-[#FA3728]" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Delivery Method</h2>
                    </div>
                    <div className="space-y-4">
                      {[
                        { value: 'delivery', label: 'Home Delivery', desc: 'Vendor will quote the shipping fee after reviewing your order.' },
                        { value: 'pickup', label: 'Pickup', desc: 'Pick up directly from the vendor\'s verified location.' },
                      ].map((opt) => (
                        <label key={opt.value} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${shippingType === opt.value ? 'border-[#FA3728] bg-red-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="radio" name="shipping" className="mt-1 w-4 h-4 text-[#FA3728]" checked={shippingType === opt.value as any} onChange={() => setShippingType(opt.value as 'delivery' | 'pickup')} />
                          <div className="ml-3">
                            <div className="font-semibold text-gray-900">{opt.label}</div>
                            <p className="text-sm text-gray-500 mt-0.5">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'confirm' && (
                <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">How it works</h2>
                    <div className="space-y-4 text-sm text-gray-600">
                      {[
                        { step: '1', text: 'Your order is sent to the vendor for review.' },
                        { step: '2', text: 'The vendor accepts and quotes a shipping fee.' },
                        { step: '3', text: 'You review the final total and choose to pay or cancel.' },
                        { step: '4', text: 'Payment is held in escrow — vendor ships; you confirm delivery.' },
                        { step: '5', text: 'Money releases to vendor after your confirmation.' },
                      ].map(({ step, text }) => (
                        <div key={step} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#FA3728]/10 text-[#FA3728] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{step}</div>
                          <p>{text}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-6 text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
                      Track everything in <strong>Chats</strong> — you'll get real-time updates from the vendor there.
                    </p>
                  </div>

                  {placeError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{placeError}</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              {isDemo && (
                <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 font-medium">
                  Demo mode — showing sample items. Add products to your cart to place a real order.
                </div>
              )}

              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-1">
                {subcarts.map((sc) => (
                  <div key={sc.id}>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{sc.vendor_name}</p>
                    {sc.items.map((item) => (
                      <div key={item.id} className="flex gap-3 mb-2">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center text-[10px] text-gray-400 font-medium relative">
                          <span className="absolute top-0 right-0 w-5 h-5 bg-gray-800 text-white text-[10px] font-bold rounded-bl-lg flex items-center justify-center">{item.quantity}</span>
                          IMG
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="font-semibold text-gray-900 text-sm truncate">{item.product_details.title}</p>
                          <p className="font-bold text-[#FA3728] text-sm">₦{parseFloat(item.product_details.price).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm mb-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>Shipping fee</span>
                  <span>Quoted by vendor</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="font-bold text-gray-900 text-base">Subtotal</span>
                  <span className="font-bold text-[#FA3728] text-xl">₦{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                {currentStep === 'confirm' && (
                  <button onClick={() => setCurrentStep('shipping')} className="py-4 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">
                    Back
                  </button>
                )}
                <button
                  onClick={() => currentStep === 'shipping' ? setCurrentStep('confirm') : handlePlaceOrder()}
                  disabled={isPlacing}
                  className="flex-1 py-4 bg-gradient-to-r from-[#FA3728] to-[#E31B23] hover:shadow-lg text-white rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPlacing ? (
                    <><Loader2 size={18} className="animate-spin" /> Placing order…</>
                  ) : currentStep === 'shipping' ? (
                    'Review & Continue'
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>

              <div className="text-center flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
                <Lock size={12} />
                <span>No payment now — you'll pay after the vendor reviews</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
