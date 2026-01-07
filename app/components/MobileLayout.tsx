'use client';

import { useState } from 'react';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';
import MobileMenu from './MobileMenu';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Mobile Header */}
      <MobileHeader onMenuToggle={() => setIsMenuOpen(true)} />

      {/* Mobile Menu Drawer */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Main Content */}
      <main className="pb-[180px] px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}