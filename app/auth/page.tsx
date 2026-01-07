'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Package, TrendingUp, Users, Shield } from 'lucide-react';

export default function VendorAuthPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: 'var(--primary-red)' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <span className="font-bold text-2xl" style={{ color: 'var(--primary-red)' }}>SA</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">ShopAm</h1>
                <p className="text-sm opacity-90">Vendor Dashboard</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-5xl font-bold mb-4 leading-tight">
                Sell Smarter.<br />
                Serve Better.
              </h2>
              <p className="text-2xl opacity-90 font-light">
                ShopAm makes it easy.
              </p>
            </motion.div>

            {/* Feature List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {[
                { icon: Package, text: 'Manage your products effortlessly' },
                { icon: TrendingUp, text: 'Track sales and analytics in real-time' },
                { icon: Users, text: 'Connect with thousands of customers' },
                { icon: Shield, text: 'Secure payments and trusted platform' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <feature.icon size={20} />
                  </div>
                  <span className="text-lg">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Footer */}
          <div className="opacity-75">
            <p className="text-sm">© 2026 ShopAm. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Options */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-crimson to-shopam flex items-center justify-center">
                <span className="font-bold text-xl text-white">SA</span>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold theme-text-primary">ShopAm</h1>
                <p className="text-sm theme-text-secondary">Vendor Dashboard</p>
              </div>
            </div>
            <p className="text-lg font-semibold theme-text-primary">Sell Smarter. Serve Better.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-2 theme-text-primary">Get Started</h2>
            <p className="theme-text-secondary mb-8">
              Join thousands of vendors selling on ShopAm
            </p>

            {/* Auth Options */}
            <div className="space-y-4">
              {/* Sign Up Button */}
              <Link
                href="/auth/signup"
                className="block w-full py-4 rounded-xl font-semibold text-white text-center transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--primary-red)', boxShadow: 'var(--primary-red-glow)' }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Create Vendor Account</span>
                  <ArrowRight size={20} />
                </div>
              </Link>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary" style={{ borderColor: 'var(--border-primary)' }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 theme-text-secondary" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    Already a vendor?
                  </span>
                </div>
              </div>

              {/* Sign In Button */}
              <Link
                href="/auth/signin"
                className="block w-full py-4 rounded-xl font-semibold text-center transition-all theme-card hover:border-primary"
                style={{ 
                  borderColor: 'var(--border-primary)',
                  color: 'var(--primary-red)'
                }}
              >
                Sign In to Dashboard
              </Link>
            </div>

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-primary text-center text-sm theme-text-secondary" style={{ borderColor: 'var(--border-primary)' }}>
              <p>
                By continuing, you agree to ShopAm's{' '}
                <a href="#" className="theme-red hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="theme-red hover:underline">Privacy Policy</a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}