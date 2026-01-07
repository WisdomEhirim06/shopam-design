'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building,
  Shield,
  Store,
  Bell,
  Upload,
  Save,
  CheckCircle,
  AlertCircle,
  Globe,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

export default function SettingsPage() {
  // Business Profile State
  const [businessProfile, setBusinessProfile] = useState({
    businessName: "Sarah's African Crafts",
    businessDescription: 'Authentic African crafts, fashion, and beauty products made with love and tradition.',
    businessAddress: '123 Victoria Island, Lagos, Nigeria',
    businessPhone: '+234 801 234 5678',
  });

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Sarah Adelewo',
    email: 'sarah.adelewo@email.com',
    phoneNumber: '+234 801 234 5678',
    nationalId: '1234567890',
  });

  // CAC Registration State
  const [cacRegistration, setcacRegistration] = useState({
    cacNumber: '',
    tinNumber: '',
    certificateUploaded: false,
  });

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState({
    storeUrl: 'shopam.com/sarah-african-crafts',
    currency: 'NGN',
    storeStatus: true,
    vacationMode: false,
  });

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: false,
    lowStockAlerts: true,
  });

  // Verification Status
  const [verificationStatus, setVerificationStatus] = useState({
    email: true,
    phone: true,
    cac: false,
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Handle Save
  const handleSave = (section: string) => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  // Handle File Upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setcacRegistration({ ...cacRegistration, certificateUploaded: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2">Settings & Verification</h1>
        <p className="text-gray-400">Complete your profile to build trust with customers! 🚀</p>
      </motion.div>

      {/* Verification Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="glass border-white/10 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield size={24} className="text-crimson" />
          Verification Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <div className={`w-3 h-3 rounded-full ${verificationStatus.email ? 'bg-green-400' : 'bg-amber-400'}`}></div>
            <div>
              <p className="text-sm font-medium">Email Verified</p>
              <p className="text-xs text-gray-400">
                {verificationStatus.email ? 'Verified ✓' : 'Pending'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <div className={`w-3 h-3 rounded-full ${verificationStatus.phone ? 'bg-green-400' : 'bg-amber-400'}`}></div>
            <div>
              <p className="text-sm font-medium">Phone Verified</p>
              <p className="text-xs text-gray-400">
                {verificationStatus.phone ? 'Verified ✓' : 'Pending'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <div className={`w-3 h-3 rounded-full ${verificationStatus.cac ? 'bg-green-400' : 'bg-amber-400'}`}></div>
            <div>
              <p className="text-sm font-medium">CAC Pending</p>
              <p className="text-xs text-gray-400">
                {verificationStatus.cac ? 'Verified ✓' : 'Upload documents'}
              </p>
            </div>
          </div>
        </div>
        {!verificationStatus.cac && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-400">
              <strong>85% Complete!</strong> Upload your CAC certificate to unlock premium features.
            </p>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Profile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="glass border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-crimson/20 rounded-lg">
              <Building size={24} className="text-crimson" />
            </div>
            <h3 className="text-lg font-semibold">Business Profile</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Business Name</label>
              <input
                type="text"
                value={businessProfile.businessName}
                onChange={(e) =>
                  setBusinessProfile({ ...businessProfile, businessName: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Business Description</label>
              <textarea
                value={businessProfile.businessDescription}
                onChange={(e) =>
                  setBusinessProfile({ ...businessProfile, businessDescription: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Business Address</label>
              <input
                type="text"
                value={businessProfile.businessAddress}
                onChange={(e) =>
                  setBusinessProfile({ ...businessProfile, businessAddress: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Business Phone</label>
              <input
                type="tel"
                value={businessProfile.businessPhone}
                onChange={(e) =>
                  setBusinessProfile({ ...businessProfile, businessPhone: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
              />
            </div>

            <button
              onClick={() => handleSave('business')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all"
            >
              <Save size={20} />
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Update Business Profile'}
            </button>
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="glass border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-crimson/20 rounded-lg">
              <User size={24} className="text-crimson" />
            </div>
            <h3 className="text-lg font-semibold">Personal Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={personalInfo.fullName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all pr-10"
                />
                {verificationStatus.email && (
                  <CheckCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  value={personalInfo.phoneNumber}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all pr-10"
                />
                {verificationStatus.phone && (
                  <CheckCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">National ID Number</label>
              <input
                type="text"
                value={personalInfo.nationalId}
                onChange={(e) => setPersonalInfo({ ...personalInfo, nationalId: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
              />
            </div>

            <button
              onClick={() => handleSave('personal')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all"
            >
              <Save size={20} />
              Update Personal Info
            </button>
          </div>
        </motion.div>

        {/* CAC Registration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="theme-card border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-crimson/20 rounded-lg">
              <Shield size={24} className="text-crimson" />
            </div>
            <h3 className="text-lg font-semibold">CAC Registration & Documents</h3>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            Upload your CAC certificate to build customer trust and unlock premium features
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">CAC Registration Number</label>
              <input
                type="text"
                value={cacRegistration.cacNumber}
                onChange={(e) => setcacRegistration({ ...cacRegistration, cacNumber: e.target.value })}
                placeholder="Enter your CAC number"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tax Identification Number (TIN)</label>
              <input
                type="text"
                value={cacRegistration.tinNumber}
                onChange={(e) => setcacRegistration({ ...cacRegistration, tinNumber: e.target.value })}
                placeholder="Enter your TIN"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">CAC Certificate Upload</label>
              <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-crimson/50 transition-all">
                <input
                  type="file"
                  id="cac-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="cac-upload" className="cursor-pointer">
                  <Upload size={32} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-300 mb-1">
                    Drag and drop your CAC certificate here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500">PDF, JPG, or PNG (Max 5MB)</p>
                  {cacRegistration.certificateUploaded && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-green-400">
                      <CheckCircle size={16} />
                      <span className="text-sm">Certificate uploaded successfully</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button
              onClick={() => handleSave('cac')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all"
            >
              <Upload size={20} />
              Upload Documents for Verification
            </button>
          </div>
        </motion.div>

        {/* Store Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="glass border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-crimson/20 rounded-lg">
              <Store size={24} className="text-crimson" />
            </div>
            <h3 className="text-lg font-semibold">Store Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Store URL</label>
              <div className="flex items-center gap-2">
                <Globe size={20} className="text-gray-400" />
                <input
                  type="text"
                  value={storeSettings.storeUrl}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeUrl: e.target.value })}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                value={storeSettings.currency}
                onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
              >
                <option value="NGN" className="theme-modal">Nigerian Naira (₦)</option>
                <option value="USD" className="theme-modal">US Dollar ($)</option>
                <option value="GBP" className="theme-modal">British Pound (£)</option>
                <option value="EUR" className="theme-modal">Euro (€)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">Store Status</p>
                <p className="text-sm text-gray-400">Make your store visible to customers</p>
              </div>
              <button
                onClick={() => setStoreSettings({ ...storeSettings, storeStatus: !storeSettings.storeStatus })}
                className={`relative w-14 h-7 rounded-full transition-all ${
                  storeSettings.storeStatus ? 'bg-crimson' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                    storeSettings.storeStatus ? 'right-1' : 'left-1'
                  }`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">Vacation Mode</p>
                <p className="text-sm text-gray-400">Temporarily pause new orders</p>
              </div>
              <button
                onClick={() => setStoreSettings({ ...storeSettings, vacationMode: !storeSettings.vacationMode })}
                className={`relative w-14 h-7 rounded-full transition-all ${
                  storeSettings.vacationMode ? 'bg-crimson' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                    storeSettings.vacationMode ? 'right-1' : 'left-1'
                  }`}
                ></div>
              </button>
            </div>

            <button
              onClick={() => handleSave('store')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all"
            >
              <Save size={20} />
              Save Store Settings
            </button>
          </div>
        </motion.div>
      </div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="glass border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-crimson/20 rounded-lg">
            <Bell size={24} className="text-crimson" />
          </div>
          <h3 className="text-lg font-semibold">Notification Preferences</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-gray-400" />
              <div>
                <p className="font-medium text-sm">Email Notifications</p>
                <p className="text-xs text-gray-400">Receive order updates via email</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, emailNotifications: !notifications.emailNotifications })}
              className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${
                notifications.emailNotifications ? 'bg-crimson' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                  notifications.emailNotifications ? 'right-0.5' : 'left-0.5'
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-gray-400" />
              <div>
                <p className="font-medium text-sm">SMS Notifications</p>
                <p className="text-xs text-gray-400">Get instant SMS for new orders</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, smsNotifications: !notifications.smsNotifications })}
              className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${
                notifications.smsNotifications ? 'bg-crimson' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                  notifications.smsNotifications ? 'right-0.5' : 'left-0.5'
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-gray-400" />
              <div>
                <p className="font-medium text-sm">Marketing Emails</p>
                <p className="text-xs text-gray-400">Tips and promotions</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, marketingEmails: !notifications.marketingEmails })}
              className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${
                notifications.marketingEmails ? 'bg-crimson' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                  notifications.marketingEmails ? 'right-0.5' : 'left-0.5'
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-gray-400" />
              <div>
                <p className="font-medium text-sm">Low Stock Alerts</p>
                <p className="text-xs text-gray-400">Alert when inventory is low</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, lowStockAlerts: !notifications.lowStockAlerts })}
              className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${
                notifications.lowStockAlerts ? 'bg-crimson' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                  notifications.lowStockAlerts ? 'right-0.5' : 'left-0.5'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}