'use client';

import { Bell, Search, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-64 right-0 h-20 glass-dark z-40 transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--glass-bg)',
        borderBottom: '1px solid var(--border-secondary)'
      }}
    >
      <div className="h-full px-8 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-lg transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-amber-400" />
            ) : (
              <Moon size={20} className="text-indigo-600" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg transition-colors" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <Bell size={22} style={{ color: 'var(--text-secondary)' }} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-crimson rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Welcome, <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Sarah</span>
            </span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crimson to-orange-600 flex items-center justify-center">
              <span className="font-semibold text-white">S</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}