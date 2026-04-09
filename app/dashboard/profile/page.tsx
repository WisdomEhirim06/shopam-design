'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Edit3,
  MapPin,
  Star,
  Clock,
  ChevronRight,
  X,
  Check,
} from 'lucide-react';

type ProfileTab = 'overview' | 'business' | 'settings';

const vendorData = {
  name: "Sarah's Store",
  subtitle: 'Fashion & Beauty Vendor',
  location: 'Lagos, Nigeria',
  rating: 4.8,
  responseTime: '< 1hr',
  followers: 11200,
  products: 12,
  totalSales: 415000,
  bio: 'Authentic African crafts, fashion, and beauty products made with love and tradition.',
  joinedDate: 'January 2024',
  storeName: "Sarah's Store",
  category: 'Fashion & Beauty Vendor',
};

const settingsItems = [
  { label: 'Edit Profile' },
  { label: 'Notification Preferences' },
  { label: 'Payment & Bank Details' },
  { label: 'Privacy & Security' },
  { label: 'Help & Support' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(vendorData.name);
  const [tempName, setTempName] = useState(name);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleEditName = () => {
    setTempName(name);
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  };

  const handleSaveName = () => {
    if (tempName.trim()) setName(tempName.trim());
    setEditingName(false);
  };

  const tabs: { id: ProfileTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'business', label: 'Business Info' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="pb-24 md:pb-8">
      {/* Cover Banner */}
      <div className="relative h-36 md:h-48 bg-gradient-to-r from-[#FA3728] to-[#c0392b]">
        <button className="absolute bottom-3 right-3 w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-white">
          <Camera size={15} />
        </button>
      </div>

      {/* Avatar Row */}
      <div className="px-4 md:px-6 relative">
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#FA3728] border-4 border-white flex items-center justify-center text-white text-3xl font-bold shadow-sm">
              S
            </div>
            <button className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-[#FA3728] border-2 border-white rounded-full flex items-center justify-center text-white">
              <Camera size={11} />
            </button>
          </div>
        </div>

        {/* Name + edit */}
        <div className="flex items-center gap-2 mb-0.5">
          {editingName ? (
            <>
              <input
                ref={nameInputRef}
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                className="text-xl font-bold text-gray-900 border-b-2 border-[#FA3728] outline-none bg-transparent"
              />
              <button onClick={handleSaveName} className="text-[#FA3728]">
                <Check size={18} strokeWidth={2.5} />
              </button>
              <button onClick={() => setEditingName(false)} className="text-gray-400">
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-900">{name}</h1>
              <button onClick={handleEditName} className="text-gray-400">
                <Edit3 size={15} />
              </button>
            </>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-3">{vendorData.subtitle}</p>

        {/* Location + rating + response */}
        <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500 mb-5">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-[#FA3728]" />
            {vendorData.location}
          </span>
          <span className="flex items-center gap-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            {vendorData.rating}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {vendorData.responseTime}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-8 mb-6">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {(vendorData.followers / 1000).toFixed(1)}K
            </p>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{vendorData.products}</p>
            <p className="text-xs text-gray-500">Products</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">
              ₦{(vendorData.totalSales / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-gray-500">Total Sales</p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#FA3728] text-white'
                  : 'text-gray-500 bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">About</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{vendorData.bio}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Joined</span>
                  <span className="text-sm font-medium text-gray-900">{vendorData.joinedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Avg. response</span>
                  <span className="text-sm font-medium text-gray-900">{vendorData.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total sales</span>
                  <span className="text-sm font-medium text-gray-900">
                    ₦{vendorData.totalSales.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'business' && (
            <motion.div
              key="business"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-base font-bold text-gray-900 mb-5">Business Information</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Store Name</p>
                  <p className="text-sm font-medium text-gray-900">{vendorData.storeName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Category</p>
                  <p className="text-sm font-medium text-[#FA3728]">{vendorData.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Location</p>
                  <p className="text-sm font-medium text-[#FA3728]">{vendorData.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Bio</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{vendorData.bio}</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-base font-bold text-gray-900 mb-4">Account Settings</h2>
              <div className="space-y-1">
                {settingsItems.map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center justify-between py-3.5 text-left"
                  >
                    <span className="text-sm text-gray-800">{item.label}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}