'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo - Larger */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="relative flex items-center justify-center">
              <img src="/images/shopam-logo.png" alt="ShopAm Logo" width={100} height={100} />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/explore" className="text-white/90 hover:text-white font-medium transition-colors text-sm lg:text-base">
              Explore
            </Link>
            <Link href="/feed" className="text-white/90 hover:text-white font-medium transition-colors text-sm lg:text-base">
              Categories
            </Link>
            <Link href="/vendors" className="text-white/90 hover:text-white font-medium transition-colors text-sm lg:text-base">
              Vendors
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link
              href="/auth/signin"
              className="hidden sm:block text-white/90 hover:text-white font-medium transition-colors px-3 py-2 text-sm"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2 sm:px-5 sm:py-2 lg:px-6 lg:py-2.5 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-semibold transition-all shadow-lg text-xs sm:text-sm lg:text-base whitespace-nowrap leading-tight flex items-center justify-center min-h-[36px]"
            >
              Become a Vendor
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-white/20 bg-gray-900/95 backdrop-blur-md"
            >
              <div className="py-3 space-y-1">
                <Link href="/explore" className="block text-white/90 hover:text-white font-medium py-2.5 px-3 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  Explore
                </Link>
                <Link href="/feed" className="block text-white/90 hover:text-white font-medium py-2.5 px-3 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  Categories
                </Link>
                <Link href="/vendors" className="block text-white/90 hover:text-white font-medium py-2.5 px-3 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  Vendors
                </Link>
                <Link href="/auth/signin" className="block text-white/90 hover:text-white font-medium py-2.5 px-3 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  Sign in
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
