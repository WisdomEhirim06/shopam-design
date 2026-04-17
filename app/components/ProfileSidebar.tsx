'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Shield, LogOut, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authService } from '@/lib/api';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const [user, setUser] = useState<any>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, [isOpen]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    onClose();
  };

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
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-xs sm:max-w-sm bg-white z-[101] shadow-2xl flex flex-col pt-safe"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 mt-2">
              <h2 className="text-xl font-bold text-gray-900">Account</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close Profile Sidebar"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <div className="space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      href={user?.is_vendor ? "/dashboard/profile" : "/profile"}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#FA3728]/5 group-hover:bg-[#FA3728]/10 flex items-center justify-center text-[#FA3728] transition-colors">
                        <User size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Profile</h3>
                        <p className="text-xs text-gray-500">Manage your personal details</p>
                      </div>
                    </Link>

                    <Link
                      href={user?.is_vendor ? "/dashboard/settings" : "/profile"}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center text-gray-700 transition-colors">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Privacy & Security</h3>
                        <p className="text-xs text-gray-500">Protect your account data</p>
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-red-50 text-left transition-colors border border-transparent hover:border-red-100 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-red-50 group-hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors">
                        <LogOut size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-600">Logout</h3>
                        <p className="text-xs text-red-400">Sign out of your account</p>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/user-signin"
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center text-gray-700 transition-colors">
                        <LogIn size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Sign In</h3>
                        <p className="text-xs text-gray-500">Access your account</p>
                      </div>
                    </Link>

                    <Link
                      href="/auth/user-signup"
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#FA3728]/5 group-hover:bg-[#FA3728]/10 flex items-center justify-center text-[#FA3728] transition-colors">
                        <UserPlus size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Sign Up</h3>
                        <p className="text-xs text-gray-500">Create a new account</p>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
