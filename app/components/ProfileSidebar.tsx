'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Settings, Bell, LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authService } from '@/lib/api';
import type { UserProfile } from '@/lib/api';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function initialsOf(user: UserProfile): string {
  const firstPart = user.first_name || user.username || '';
  const first = firstPart.charAt(0);
  let last = (user.last_name || '').charAt(0);
  if (!last && firstPart.includes(' ')) {
    const parts = firstPart.trim().split(/\s+/);
    if (parts.length > 1) last = parts[parts.length - 1].charAt(0);
  }
  return `${first}${last}`.toUpperCase().trim();
}

function Item({
  icon: Icon,
  title,
  subtitle,
  href,
  onClick,
  danger,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  subtitle?: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  const className = `flex w-full items-center gap-3.5 border-b border-slate-100 px-4 py-3.5 text-left transition-colors last:border-0 hover:bg-slate-50/60`;
  const inner = (
    <>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          danger ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'
        }`}
      >
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-sm font-semibold ${danger ? 'text-red-600' : 'text-ink'}`}>{title}</span>
        {subtitle && <span className="mt-0.5 block text-xs text-slate-600">{subtitle}</span>}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

export default function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      onClose();
      window.location.href = '/';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed right-0 top-0 z-[101] flex h-full w-full max-w-xs flex-col bg-white shadow-2xl sm:max-w-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <h2 className="text-base font-bold text-ink">Account</h2>
              <button
                onClick={onClose}
                aria-label="Close account menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {user && (
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FA3728] text-sm font-bold text-white">
                  {initialsOf(user)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">
                    {[user.first_name, user.last_name].filter(Boolean).join(' ') || user.username}
                  </p>
                  <p className="truncate text-xs text-slate-600">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {user ? (
                <div className="overflow-hidden">
                  <Item icon={User} title="Profile" subtitle="Your account and activity" href="/profile" onClick={onClose} />
                  <Item icon={Settings} title="Settings" subtitle="Profile, password and notifications" href="/profile/settings" onClick={onClose} />
                  <Item icon={Bell} title="Notifications" subtitle="Order and message updates" href="/notifications" onClick={onClose} />
                  {user.is_vendor && (
                    <Item icon={LayoutDashboard} title="Vendor dashboard" subtitle="Manage your shop" href="/dashboard" onClick={onClose} />
                  )}
                  <Item icon={LogOut} title="Sign out" onClick={handleLogout} danger />
                </div>
              ) : (
                <div className="overflow-hidden">
                  <Item icon={LogIn} title="Sign in" subtitle="Access your account" href="/auth/signin" onClick={onClose} />
                  <Item icon={UserPlus} title="Create account" subtitle="Join ShopAm" href="/auth/user-signup" onClick={onClose} />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
