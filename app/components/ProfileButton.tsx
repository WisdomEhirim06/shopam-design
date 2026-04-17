'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { authService } from '@/lib/api';
import ProfileSidebar from './ProfileSidebar';

export default function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInitial, setUserInitial] = useState('');

  useEffect(() => {
    const user = authService.getCurrentUser();
    setIsAuthenticated(!!user);
    if (user) {
      const firstPart = (user.first_name || user.username || '');
      const firstInitial = firstPart.charAt(0);
      let lastInitial = (user.last_name || '').charAt(0);
      
      if (!lastInitial && firstPart.includes(' ')) {
        const parts = firstPart.trim().split(/\s+/);
        if (parts.length > 1) {
          lastInitial = parts[parts.length - 1].charAt(0);
        }
      }
      
      setUserInitial(`${firstInitial}${lastInitial}`.toUpperCase().trim());
    }
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center justify-center group"
        aria-label="Profile"
      >
        {isAuthenticated && userInitial ? (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FA3728] text-white flex items-center justify-center text-xs sm:text-sm font-bold shadow-md transition-all group-hover:scale-110 group-hover:shadow-lg ring-2 ring-white/20">
            {userInitial}
          </div>
        ) : (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#FA3728] bg-white text-[#FA3728] flex items-center justify-center shadow-sm transition-all group-hover:scale-110 group-hover:border-[#FA3728] group-hover:bg-[#FA3728]/5">
            <User size={18} className="sm:size-20" />
          </div>
        )}
      </button>
      <ProfileSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
