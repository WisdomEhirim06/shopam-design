'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Bell, Home, Package, MessageSquare, User, X } from 'lucide-react';
import MobileBottomNav from '../components/MobileBottomNav';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Home' },
    { href: '/dashboard/products', label: 'Products' },
    { href: '/dashboard/orders', label: 'Orders' },
    { href: '/dashboard/profile', label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Universal Desktop Top Navigation */}
      <header className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo area */}
            <div className="flex items-center gap-2">
              <Image
                src="/images/black-logo.png"
                alt="ShopAm"
                width={90}
                height={28}
                className="object-contain"
                priority
              />
              <span className="text-[11px] font-bold text-white bg-[#FA3728] px-2 py-0.5 rounded-full leading-none">
                Vendor
              </span>
            </div>

            {/* Desktop Nav Links */}
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href ? 'text-[#FA3728]' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isSearchOpen ? (
              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-[#FA3728] border border-gray-100 transition-all">
                <Search size={16} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-sm w-56 text-gray-900 placeholder-gray-400" 
                  autoFocus 
                />
                <button onClick={() => setIsSearchOpen(false)} className="p-0.5 text-gray-400 hover:text-gray-900 transition-colors">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Search size={20} />
              </button>
            )}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#FA3728] rounded-full border-2 border-white"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Top Header (Matches Prototype Image) */}
      <header className="md:hidden bg-white px-4 py-3 sticky top-0 z-40 border-b border-gray-100">
        {isSearchOpen ? (
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2 focus-within:ring-1 focus-within:ring-[#FA3728] border border-gray-100 transition-all w-full">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Search products, orders..." 
              className="bg-transparent border-none outline-none text-sm w-full text-gray-900 placeholder-gray-400 min-w-0" 
              autoFocus 
            />
            <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors flex-shrink-0 p-0.5">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/images/black-logo.png"
                alt="ShopAm"
                width={80}
                height={24}
                className="object-contain"
                priority
              />
              <span className="text-[11px] font-bold text-white bg-[#FA3728] px-2 py-0.5 rounded-full leading-none">
                Vendor
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-600 hover:text-gray-900">
                <Search size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#FA3728] rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area - logically constrained for desktop, edge-to-edge for mobile */}
      <main className="max-w-xl md:max-w-5xl mx-auto w-full pb-20 md:pb-8 pt-4 md:pt-8 min-h-screen">
        <div className="bg-transparent md:bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-100 min-h-[85vh] overflow-hidden relative">
          {children}
        </div>
      </main>

      {/* Mobile-only bottom navigation */}
      <MobileBottomNav />
    </div>
  );
}