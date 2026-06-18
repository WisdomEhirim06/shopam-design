'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Bell, X, User } from 'lucide-react';
import MobileBottomNav from '../components/MobileBottomNav';
import { useState, useEffect, useRef } from 'react';
import apiClient, { API_ENDPOINTS } from '@/lib/api/config';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [userInitial, setUserInitial] = useState('V');
  
  const authCheckRan = useRef(false);

  useEffect(() => {
    if (authCheckRan.current) return; 
    authCheckRan.current = true;

    if (!localStorage.getItem('user')) {
      window.location.replace('/auth/signin?redirect=' + encodeURIComponent(pathname));
      return;
    }
    
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') ?? 'null');
      if (storedUser && storedUser.is_vendor === false) {
        window.location.replace('/explore');
        return;
      }
      // Grab the user's initial for the profile circle
      if (storedUser?.first_name) setUserInitial(storedUser.first_name[0].toUpperCase());
      else if (storedUser?.username) setUserInitial(storedUser.username[0].toUpperCase());
    } catch { /* corrupt user blob */ }
    setAuthChecked(true);
  }, [pathname]); 

  useEffect(() => {
    const ping = () => {
      if (document.hidden) return; 
      
      apiClient
        .get(API_ENDPOINTS.AUTH.PROFILE, { headers: { 'X-Keepalive': 'true' } })
        .catch(() => {});
    };
    const id = setInterval(ping, 4 * 60 * 1000); // every 4 minutes
    return () => clearInterval(id);
  }, []);

  if (!authChecked) return null;

  // Removed 'Profile' from the main nav items
  const navItems = [
    { href: '/dashboard', label: 'Home' },
    { href: '/dashboard/products', label: 'Products' },
    { href: '/dashboard/orders', label: 'Orders' },
  ];

  // The Dropdown Menu Component to reuse in both Mobile and Desktop headers
  // The Dropdown Menu Component to reuse in both Mobile and Desktop headers
  const ProfileDropdown = () => (
    <div className="relative">
      <button 
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm shadow-sm hover:bg-[#FA3728] transition-colors border-2 border-transparent hover:border-red-100"
      >
        {userInitial}
      </button>

      {isProfileMenuOpen && (
        <>
          {/* Invisible overlay to close menu when clicking outside */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsProfileMenuOpen(false)} 
          />
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-1 z-50 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account</p>
            </div>
            {/* Business Information */}
            <Link 
              href="/dashboard/profilr" 
              onClick={() => setIsProfileMenuOpen(false)} 
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#FA3728] transition-colors"
            >
              Business Information
            </Link>
            
            {/* Settings */}
            <Link 
              href="/dashboard/settings" 
              onClick={() => setIsProfileMenuOpen(false)} 
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#FA3728] transition-colors"
            >
              Settings
            </Link>
            
            <div className="h-px bg-gray-100 my-1" />
            
            {/* Sign Out */}
            <button 
              onClick={() => {
                setIsProfileMenuOpen(false);
                window.location.replace('/auth/signin');
              }} 
              className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );

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

          <div className="flex items-center gap-5">
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
              <button onClick={() => setIsSearchOpen(true)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <Search size={20} />
              </button>
            )}
            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FA3728] rounded-full border-2 border-white"></span>
            </button>
            
            {/* The new Profile Dropdown */}
            <div className="pl-2 border-l border-gray-200">
               <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Header */}
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
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSearchOpen(true)} className="p-1 text-gray-600 hover:text-gray-900">
                <Search size={20} />
              </button>
              <button className="p-1 text-gray-600 hover:text-gray-900 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FA3728] rounded-full border-2 border-white"></span>
              </button>
              
              {/* The new Profile Dropdown on Mobile */}
              <div className="pl-1">
                 <ProfileDropdown />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
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