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
        className="relative p-1 flex items-center justify-center"
        aria-label="Profile"
      >
        {isAuthenticated && userInitial ? (
          <div className="w-8 h-8 rounded-full bg-[#FA3728] text-white flex items-center justify-center text-sm font-bold">
            {userInitial}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#FA3728] text-white flex items-center justify-center text-sm font-bold">
            W
          </div>
        )}
      </button>
      <ProfileSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
