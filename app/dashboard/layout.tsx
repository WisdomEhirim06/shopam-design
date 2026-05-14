'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Bell, Home, Package, MessageSquare, User, X } from 'lucide-react';
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
  const [authChecked, setAuthChecked] = useState(false);
  // Strict Mode (reactStrictMode: true) mounts → unmounts → remounts every
  // component in development. Without this ref gate, the auth guard useEffect
  // runs twice. If the 401 interceptor clears access_token between the two
  // runs (e.g. a concurrent API call just failed), the second run finds no
  // token and fires a spurious redirect even though the user is logged in.
  // The ref persists across the Strict Mode remount cycle within the same
  // component instance, so the guard runs exactly once per true mount.
  const authCheckRan = useRef(false);

  useEffect(() => {
    // Guard: dashboard is vendor-only. Runs ONCE on mount — intentionally NOT
    // re-running on every pathname change. Re-running on pathname was causing
    // a redirect loop: if the 401 interceptor cleared access_token in the
    // background (e.g. a momentary API glitch), the next navigation would
    // instantly kick the user to sign-in even though they were actively using
    // the dashboard. The interceptor handles genuine session expiry redirects;
    // the layout only needs to gate the initial render.
    if (authCheckRan.current) return; // already ran — Strict Mode remount, skip
    authCheckRan.current = true;

    if (!localStorage.getItem('access_token')) {
      window.location.replace('/auth/signin?redirect=' + encodeURIComponent(pathname));
      return;
    }
    setAuthChecked(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Session keepalive: ping the profile endpoint every 4 minutes while on the
  // dashboard. The backend's TokenSessionMiddleware resets the Redis SESSION_TTL
  // via proactive token rotation only when a request arrives while
  // 0 < TTL < REFRESH_THRESHOLD. Without this, a short SESSION_TTL expires
  // silently during periods of low API activity (e.g. the dashboard home page
  // makes no API calls of its own), causing SESSION_INVALID on the next action.
  useEffect(() => {
    const ping = () => {
      if (document.hidden) return; // don't ping hidden/background tabs
      // X-Keepalive marks this request so the 401 response interceptor skips
      // the forced redirect. A transient 401 on a background ping should not
      // boot the user — the interceptor's normal token-refresh path will handle
      // genuine session expiry on the next real user-initiated request.
      apiClient
        .get(API_ENDPOINTS.AUTH.PROFILE, { headers: { 'X-Keepalive': '1' } })
        .catch(() => {
          // Errors silently ignored here. Genuine session expiry will be caught
          // by the interceptor on the next non-keepalive request.
        });
    };
    const id = setInterval(ping, 4 * 60 * 1000); // every 4 minutes
    return () => clearInterval(id);
  }, []);

  // Don't render the dashboard shell until we've confirmed the token exists.
  // This prevents a flash of dashboard content before the redirect fires.
  if (!authChecked) return null;

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