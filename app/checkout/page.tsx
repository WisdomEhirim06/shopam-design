'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Lock,
  MapPin,
  Shield,
  Truck,
  ChevronDown
} from 'lucide-react';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock cart data
  const cartItems = [
    {
      id: '1',
      name: 'African Print Dress',
      vendor: "Sarah's Fashion",
      price: 28000,
      quantity: 1,
      image: '/api/placeholder/80/80',
    },
    {
      id: '2',
      name: 'Wireless Earbuds Pro',
      vendor: 'TechHub Nigeria',
      price: 15000,
      quantity: 2,
      image: '/api/placeholder/80/80',
    },
  ];

  const subtotal = 58000;
  const shippingCost = shippingMethod === 'express' ? 3500 : 1500;
  const total = subtotal + shippingCost;

  const handleNextStep = () => {
    if (currentStep === 'shipping') setCurrentStep('payment');
    else if (currentStep === 'payment') handleCheckout();
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep('confirmation');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href={currentStep === 'confirmation' ? "/" : "/cart"}
              className="flex items-center gap-2 text-gray-700 hover:text-[#FA3728] transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium hidden sm:inline">
                {currentStep === 'confirmation' ? 'Back to Home' : 'Back to Cart'}
              </span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">
              {currentStep === 'confirmation' ? 'Order Complete' : 'Checkout'}
            </h1>
            <div className="w-24 flex justify-end">
              <Lock size={18} className="text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {currentStep === 'confirmation' ? (
          /* Confirmation State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 text-center shadow-sm"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={48} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Successful!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Thank you for your purchase. Your order number is <span className="font-semibold text-gray-900">#ORD-2026-8942</span>.
              We'll send you an email confirmation shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/orders"
                className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-full transition-colors"
              >
                Track Order
              </Link>
              <Link
                href="/explore"
                className="px-8 py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white font-bold rounded-full transition-colors shadow-md hover:shadow-lg"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Checkout Flow */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side - Forms */}
            <div className="lg:col-span-7 space-y-6">
              {/* Progress Steps */}
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0"></div>
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#FA3728] rounded-full z-0 transition-all duration-500 ease-in-out"
                    style={{ width: currentStep === 'payment' ? '100%' : '50%' }}
                  ></div>
                  
                  <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                    <div className="w-8 h-8 rounded-full bg-[#FA3728] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      1
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Shipping</span>
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors duration-500 ${currentStep === 'payment' ? 'bg-[#FA3728] text-white' : 'bg-gray-100 text-gray-400'}`}>
                      2
                    </div>
                    <span className={`text-sm font-semibold transition-colors duration-500 ${currentStep === 'payment' ? 'text-gray-900' : 'text-gray-500'}`}>Payment</span>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {currentStep === 'shipping' && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {/* Shipping Address */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                          <MapPin size={20} className="text-[#FA3728]" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input type="text" placeholder="John Doe" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#FA3728] focus:ring-1 focus:ring-[#FA3728] outline-none transition-all" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                          <input type="text" placeholder="123 Main St, Apt 4B" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#FA3728] focus:ring-1 focus:ring-[#FA3728] outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input type="text" placeholder="Lagos" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#FA3728] focus:ring-1 focus:ring-[#FA3728] outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                          <input type="text" placeholder="Lagos State" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#FA3728] focus:ring-1 focus:ring-[#FA3728] outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <input type="tel" placeholder="+234 800 000 0000" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#FA3728] focus:ring-1 focus:ring-[#FA3728] outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#FA3728] focus:ring-1 focus:ring-[#FA3728] outline-none transition-all" />
                        </div>
                      </div>
                    </div>

                    {/* Shipping Method */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                          <Truck size={20} className="text-[#FA3728]" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Delivery Method</h2>
                      </div>

                      <div className="space-y-4">
                        <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-[#FA3728] bg-red-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input 
                            type="radio" 
                            name="shipping" 
                            className="mt-1 w-4 h-4 text-[#FA3728] border-gray-300 focus:ring-[#FA3728]"
                            checked={shippingMethod === 'standard'}
                            onChange={() => setShippingMethod('standard')}
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-gray-900">Standard Delivery</span>
                              <span className="font-bold text-[#FA3728]">₦1,500</span>
                            </div>
                            <p className="text-sm text-gray-500">Delivered within 3-5 business days.</p>
                          </div>
                        </label>

                        <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-[#FA3728] bg-red-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input 
                            type="radio" 
                            name="shipping" 
                            className="mt-1 w-4 h-4 text-[#FA3728] border-gray-300 focus:ring-[#FA3728]"
                            checked={shippingMethod === 'express'}
                            onChange={() => setShippingMethod('express')}
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-gray-900">Express Delivery</span>
                              <span className="font-bold text-[#FA3728]">₦3,500</span>
                            </div>
                            <p className="text-sm text-gray-500">Delivered within 1-2 business days.</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 'payment' && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Payment Method */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                          <CreditCard size={20} className="text-[#FA3728]" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Payment Option</h2>
                      </div>

                      <div className="space-y-4 mb-8">
                        {/* Wrapper handles the spacing but prevents double wrapping in react 18 + tailwind bug for nested groups sometimes */}
                        
                        <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#FA3728] bg-red-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input 
                            type="radio" 
                            name="payment" 
                            className="w-4 h-4 text-[#FA3728] border-gray-300 focus:ring-[#FA3728]"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                          />
                          <span className="ml-3 font-semibold text-gray-900 flex-1">Debit / Credit Card</span>
                          <div className="flex gap-2">
                            <div className="w-8 h-5 bg-blue-600 rounded text-[10px] text-white font-bold flex items-center justify-center">VISA</div>
                            <div className="w-8 h-5 bg-red-500 rounded text-[10px] text-white font-bold flex items-center justify-center">MC</div>
                          </div>
                        </label>
                        
                        {/* Card Details Form - Only show if card is selected */}
                        <AnimatePresence>
                          {paymentMethod === 'card' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden mt-4 pl-7 pr-2"
                            >
                              <div className="grid grid-cols-2 gap-4 pb-2">
                                <div className="col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                  <div className="relative">
                                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:border-[#FA3728] focus:ring-1 focus:ring-[#FA3728] outline-none transition-all" />
                                    <CreditCard size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  </div>
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                                  <input type="text" placeholder="John Doe" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#FA3728] focus:ring-1 focus:ring-[#FA3728] outline-none transition-all" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                  <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#FA3728] focus:ring-1 focus:ring-[#FA3728] outline-none transition-all" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                  <input type="text" placeholder="123" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#FA3728] focus:ring-1 focus:ring-[#FA3728] outline-none transition-all" />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-[#FA3728] bg-red-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input 
                            type="radio" 
                            name="payment" 
                            className="w-4 h-4 text-[#FA3728] border-gray-300 focus:ring-[#FA3728]"
                            checked={paymentMethod === 'transfer'}
                            onChange={() => setPaymentMethod('transfer')}
                          />
                          <span className="ml-3 font-semibold text-gray-900">Bank Transfer</span>
                        </label>
                      </div>

                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-100 rounded-xl text-sm text-gray-600 border border-gray-200">
                      <Shield size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
                      <p>
                        Your payment information is securely processed. We do not store full credit card details nor have access to your credit card information.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side - Order Summary (Sticky) */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex-shrink-0 overflow-hidden relative">
                         {/* Placeholder for item image */}
                         <div className="absolute top-0 right-0 w-6 h-6 bg-gray-900 rounded-bl-lg flex items-center justify-center text-[10px] text-white font-bold">
                           {item.quantity}
                         </div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500 mb-1">{item.vendor}</p>
                        <p className="font-bold text-[#FA3728] text-sm">₦{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code */}
                <div className="flex gap-2 mb-6 pt-6 border-t border-gray-100">
                  <input type="text" placeholder="Promo code" className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#FA3728] outline-none text-sm transition-all" />
                  <button className="px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-all">
                    Apply
                  </button>
                </div>

                {/* Totals */}
                <div className="space-y-3 text-sm mb-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-gray-900">₦{shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Promo Discount</span>
                    <span>-₦0</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
                    <span className="font-bold text-gray-900 text-lg">Total</span>
                    <span className="font-bold text-[#FA3728] text-2xl">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  {currentStep === 'payment' && (
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      disabled={isProcessing}
                      className="py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-lg transition-all disabled:opacity-50"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleNextStep}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-gradient-to-r from-[#FA3728] to-[#E31B23] hover:shadow-lg transform hover:-translate-y-0.5 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : currentStep === 'shipping' ? (
                      'Proceed to Payment'
                    ) : (
                      `Pay ₦${total.toLocaleString()}`
                    )}
                  </button>
                </div>

                <div className="text-center flex items-center justify-center gap-2 text-xs text-gray-500">
                   <Lock size={12} />
                   <span>Secured and encrypted checkout via Paystack</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
