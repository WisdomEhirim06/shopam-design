'use client';

import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  MessageSquare, 
  CreditCard, 
  User, 
  Settings,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'Products', href: '/dashboard/products' },
  { icon: ShoppingCart, label: 'Orders', href: '/dashboard/orders' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
  { icon: CreditCard, label: 'Bank Details', href: '/dashboard/bank-details' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-screen w-64 bg-secondary border-r border-primary flex flex-col z-50 transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-secondary)'
      }}
    >
      {/* Logo Section */}
      <div className="p-6 border-b transition-colors" style={{ borderColor: 'var(--border-secondary)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-crimson flex items-center justify-center font-bold text-lg">
            SA
          </div>
          <div>
            <h1 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>ShopAm</h1>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Vendor Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                  `}
                  style={
                    isActive 
                      ? { 
                          backgroundColor: 'var(--primary-red)',
                          color: 'white',
                          boxShadow: 'var(--primary-red-glow)'
                        }
                      : { color: 'var(--text-secondary)' }
                  }
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* Help Button */}
      <div className="p-4 border-t transition-colors" style={{ borderColor: 'var(--border-secondary)' }}>
        <button 
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all font-medium text-white"
          style={{
            backgroundColor: 'var(--primary-red)',
            boxShadow: 'var(--primary-red-glow)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <HelpCircle size={20} />
          Need Help
        </button>
      </div>
    </motion.aside>
  );
}