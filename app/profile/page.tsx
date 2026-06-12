'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  LogOut, 
  ChevronRight, 
  Store, 
  HelpCircle, 
  CreditCard,
  Edit3,
  Mail,
  Phone,
  Calendar,
  X,
  Lock,
  ChevronLeft,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { authService } from '@/lib/api';
import Link from 'next/link';

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Settings & Password Modal States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    old_password1: '',
    new_password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      window.location.href = '/auth/signin';
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FA3728] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSignOut = () => {
    authService.logout();
    window.location.href = '/';
  };

  const getInitials = () => {
    const firstPart = (user.first_name || user.username || '');
    const first = firstPart.charAt(0);
    let last = (user.last_name || '').charAt(0);
    
    if (!last && firstPart.includes(' ')) {
      const parts = firstPart.trim().split(/\s+/);
      if (parts.length > 1) {
        last = parts[parts.length - 1].charAt(0);
      }
    }
    
    return `${first}${last}`.toUpperCase().trim();
  };

  const initials = getInitials();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      await authService.changePassword(passwordForm);
      setFormSuccess(true);
      // Clear form after success
      setPasswordForm({ old_password: '', old_password1: '', new_password: '' });
      setTimeout(() => {
        setFormSuccess(false);
        setIsPasswordModalOpen(false);
        setIsSettingsOpen(false);
      }, 2000);
    } catch (err: any) {
      console.error('Password change failed:', err);
      setFormError(err.response?.data?.message || 'Failed to update password. Please check your old password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white px-4 h-16 border-b border-gray-100 flex items-center justify-center sticky top-0 z-20">
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">Your Profile</h1>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 sticky top-24"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-[#FA3728] text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-red-100 mb-5">
                  {initials}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user.first_name || user.username} {user.last_name}
                </h2>
                
                <div className="mt-2 text-sm text-gray-500 font-medium">
                  {user.email}
                </div>

                {user.phone && (
                  <div className="mt-1 text-xs text-gray-400">
                    {user.phone}
                  </div>
                )}

                {/* Stats Bar */}
                <div className="grid grid-cols-2 gap-4 mt-8 w-full border-t border-gray-50 pt-8">
                  <div className="text-center group cursor-pointer">
                    <p className="text-xl font-bold text-[#FA3728]">5</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Shops Following</p>
                  </div>
                  <div className="text-center border-l border-gray-100 group cursor-pointer">
                    <p className="text-xl font-bold text-[#FA3728]">12</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Orders Made</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Menu Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] px-4">Account</h3>
              <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-50">
                <MenuItem 
                  icon={<Edit3 size={18} />} 
                  title="Edit Profile" 
                  href="/profile/edit"
                />
                <MenuItem 
                  icon={<CreditCard size={18} />} 
                  title="Payment History" 
                  href="/profile/payments"
                />
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center transition-all">
                    <Settings size={18} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">Settings</h3>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[#FA3728] group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] px-4">Others</h3>
              <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-50">
                <MenuItem 
                  icon={<Store size={18} />} 
                  title="Become a Vendor" 
                  href="/auth/signup"
                  highlight
                />
                <MenuItem 
                  icon={<HelpCircle size={18} />} 
                  title="Help & Support" 
                  href="/support"
                />
              </div>
            </div>

            <button 
              onClick={handleSignOut}
              className="w-full bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-100 hover:bg-red-50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                  <LogOut size={18} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-gray-900">Sign Out</span>
                  <span className="text-xs text-red-400">Exit your account Safely</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-red-200 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>

      {/* Settings Dialog */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-8 z-[70] md:max-w-md md:mx-auto md:bottom-1/4 md:rounded-[2.5rem]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-500 shadow-sm">
                      <Lock size={18} />
                    </div>
                    <span className="font-bold text-gray-900">Change Password</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-[#FA3728] transition-colors" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white z-[80]"
            />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed inset-0 z-[90] flex flex-col pt-4 overflow-y-auto"
            >
              <div className="px-6 h-16 flex items-center justify-between border-b border-gray-50">
                <button onClick={() => setIsPasswordModalOpen(false)} className="flex items-center gap-2 text-gray-900 font-bold">
                  <ChevronLeft size={24} />
                  <span>Back</span>
                </button>
                <h2 className="text-lg font-bold">Change Password</h2>
                <div className="w-8" /> {/* Spacer */}
              </div>

              <div className="p-8 max-w-md mx-auto w-full">
                {formSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Password Updated</h3>
                    <p className="text-gray-500">Your security settings have been saved successfully.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Current Password</label>
                      <input 
                        required
                        type="password" 
                        value={passwordForm.old_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-[#FA3728] transition-all"
                        placeholder="Enter current password"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Confirm Current Password</label>
                      <input 
                        required
                        type="password" 
                        value={passwordForm.old_password1}
                        onChange={(e) => setPasswordForm({ ...passwordForm, old_password1: e.target.value })}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-[#FA3728] transition-all"
                        placeholder="Confirm current password"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">New Password</label>
                      <input 
                        required
                        type="password" 
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-[#FA3728] transition-all"
                        placeholder="Enter new password"
                      />
                    </div>

                    {formError && (
                      <div className="p-4 bg-red-50 rounded-xl text-red-500 text-sm font-medium">
                        {formError}
                      </div>
                    )}

                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-[#FA3728] text-white rounded-2xl py-4 font-bold shadow-lg shadow-red-100 hover:bg-[#E31B23] transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ icon, title, href, highlight }: { 
  icon: React.ReactNode; 
  title: string; 
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-4 p-5 hover:bg-gray-50 transition-all group ${highlight ? 'bg-red-50/20' : ''}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
        highlight ? 'bg-red-100 text-[#FA3728]' : 'bg-gray-50 text-gray-500 group-hover:bg-white group-hover:shadow-sm'
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className={`font-semibold text-gray-900 ${highlight ? 'text-[#FA3728]' : ''}`}>{title}</h3>
      </div>
      <ChevronRight size={16} className="text-gray-300 group-hover:text-[#FA3728] group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
