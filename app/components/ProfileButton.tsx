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
    setIsAuthenticated(authService.isAuthenticated());
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && (user.name || user.first_name)) {
        const name = user.name || user.first_name;
        setUserInitial(name.charAt(0).toUpperCase());
      }
    } catch(e) {}
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
        aria-label="Profile"
      >
        {isAuthenticated && userInitial ? (
          <div className="w-5 h-5 rounded-full bg-[#FA3728] text-white flex items-center justify-center text-[10px] font-bold">
            {userInitial}
          </div>
        ) : (
          <User size={20} className="text-gray-700" />
        )}
      </button>
      <ProfileSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
