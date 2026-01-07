'use client';

import { Home, Package, ShoppingBag, CreditCard, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/products', icon: Package, label: 'Products' },
  { href: '/dashboard/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/dashboard/bank-details', icon: CreditCard, label: 'Bank' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 theme-modal border-t border-primary safe-area-bottom" style={{ borderColor: 'var(--border-primary)' }}>
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: 'var(--primary-red-light)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                className={`relative z-10 ${isActive ? 'theme-red' : 'theme-text-secondary'}`}
                style={isActive ? { color: 'var(--primary-red)' } : {}}
              />
              <span
                className={`text-xs font-medium relative z-10 ${
                  isActive ? 'theme-red' : 'theme-text-secondary'
                }`}
                style={isActive ? { color: 'var(--primary-red)' } : {}}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Need Help Button */}
      <div className="px-4 pb-3">
        <button
          className="w-full py-3 rounded-lg font-medium text-white text-sm flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--primary-red)' }}
        >
          <span>🆘</span>
          Need Help
        </button>
      </div>
    </div>
  );
}