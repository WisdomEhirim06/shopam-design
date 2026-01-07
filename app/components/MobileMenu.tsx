'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  ShoppingBag,
  BarChart3,
  MessageSquare,
  CreditCard,
  Settings,
  User,
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/products', icon: Package, label: 'Products' },
  { href: '/dashboard/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/dashboard/bank-details', icon: CreditCard, label: 'Bank Details' },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Menu Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed top-0 left-0 bottom-0 w-[280px] theme-modal z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-primary" style={{ borderColor: 'var(--border-secondary)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full theme-red-bg flex items-center justify-center font-bold text-lg text-white">
                    SA
                  </div>
                  <div>
                    <h2 className="font-bold theme-text-primary">ShopAm</h2>
                    <p className="text-xs theme-text-secondary">Vendor Dashboard</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X size={24} className="theme-text-secondary" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 p-3 rounded-lg theme-card">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crimson to-orange-600 flex items-center justify-center">
                  <span className="font-semibold text-white text-sm">S</span>
                </div>
                <div>
                  <p className="font-medium text-sm theme-text-primary">Sarah Adelewo</p>
                  <p className="text-xs theme-text-secondary">sarah@email.com</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                      style={
                        isActive
                          ? {
                              backgroundColor: 'var(--primary-red)',
                              color: 'white',
                              boxShadow: 'var(--primary-red-glow)',
                            }
                          : { color: 'var(--text-secondary)' }
                      }
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-primary mt-auto" style={{ borderColor: 'var(--border-secondary)' }}>
              <div className="text-xs theme-text-secondary text-center">
                <p>ShopAm Vendor Dashboard</p>
                <p className="mt-1">Version 1.0.0</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}