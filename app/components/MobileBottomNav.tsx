'use client';

import { Home, Package, MessageSquare, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/dashboard/products', icon: Package, label: 'Products' },
    { href: '/dashboard/orders', icon: MessageSquare, label: 'Orders' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1 w-16"
            >
              {isActive && item.label === 'Orders' && (
                <span className="absolute -top-1 right-2 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#FA3728] rounded-full">
                  3
                </span>
              )}
              <Icon
                size={22}
                className={`transition-colors ${isActive ? 'text-[#FA3728]' : 'text-gray-400'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] font-medium transition-colors mt-0.5 ${
                  isActive ? 'text-[#FA3728]' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}