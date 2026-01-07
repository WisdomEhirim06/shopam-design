'use client';

import { Search, Menu, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileHeaderProps {
  onMenuToggle?: () => void;
}

export default function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    const path = pathname.split('/')[1];
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 theme-modal border-b border-primary" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center justify-between p-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full theme-red-bg flex items-center justify-center font-bold text-lg text-white">
              SA
            </div>
            <div>
              <h1 className="font-bold text-sm theme-text-primary">ShopAm</h1>
              <p className="text-xs theme-text-secondary">Vendor Dashboard</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg theme-card"
            >
              <Search size={20} className="theme-text-secondary" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg theme-card">
              <Bell size={20} className="theme-text-secondary" />
              <span className="absolute top-1 right-1 w-2 h-2 theme-red-bg rounded-full"></span>
            </button>

            {/* Menu Toggle */}
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg theme-card"
            >
              <Menu size={20} className="theme-text-secondary" />
            </button>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-primary px-4 pb-4"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-secondary" size={18} />
                <input
                  type="text"
                  placeholder="Search products, orders, customers..."
                  className="theme-input w-full pl-10 pr-4 py-3 rounded-lg text-sm"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spacer */}
      <div className="md:hidden h-[72px]"></div>
    </>
  );
}