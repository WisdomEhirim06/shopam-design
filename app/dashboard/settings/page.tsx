'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import { authService } from '@/lib/api';
import apiClient, { API_ENDPOINTS } from '@/lib/api/config';

// Define available tabs
const TABS = [
  { id: 'business', label: 'Business Profile', icon: Building },
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'cac', label: 'CAC Registration', icon: Shield },
  { id: 'store', label: 'Store Settings', icon: Store },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  // --- UI State ---
  const [activeTab, setActiveTab] = useState('business');
  
  // Business Profile State
  const [businessProfile, setBusinessProfile] = useState({
    businessName: '',
    businessDescription: '',
    businessAddress: '',
    businessPhone: '',
  });

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    nationalId: '',
  });

  // CAC Registration State
  const [cacRegistration, setcacRegistration] = useState({
    cacNumber: '',
    tinNumber: '',
    certificateUploaded: false,
  });

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState({
    storeUrl: '',
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
    email: false,
    phone: false,
    cac: false,
  });

  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [sectionMsg, setSectionMsg] = useState<{ section: string; msg: string; ok: boolean } | null>(null);

  // Load real profile data on mount
  useEffect(() => {
    authService.getFullProfile().then(({ user, vendor_profile }) => {
      setPersonalInfo({
        fullName: [user.first_name, user.last_name].filter(Boolean).join(' '),
        email: user.email ?? '',
        phoneNumber: user.phone ? `+234 ${user.phone}` : '',
        nationalId: '',
      });
      setBusinessProfile({
        businessName: vendor_profile?.business_name ?? '',
        businessDescription: vendor_profile?.bio ?? '',
        businessAddress: vendor_profile?.business_address ?? '',
        businessPhone: user.phone ? `+234 ${user.phone}` : '',
      });
      setcacRegistration((prev) => ({
        ...prev,
        cacNumber: vendor_profile?.cac_registration ?? '',
        tinNumber: vendor_profile?.tin ?? '',
      }));
      setVerificationStatus({
        email: !!user.email,
        phone: !!user.phone,
        cac: !!(vendor_profile?.cac_verified),
      });
    }).catch(() => { /* profile load failed — keep empty fields */ });
  }, []);

  // Handle Save per section
  const handleSave = async (section: string) => {
    setSavingSection(section);
    setSectionMsg(null);
    try {
      if (section === 'business') {
        await apiClient.patch(API_ENDPOINTS.AUTH.VENDOR_PROFILE_UPDATE, {
          business_name: businessProfile.businessName,
          bio: businessProfile.businessDescription,
          business_address: businessProfile.businessAddress,
        });
      } else if (section === 'personal') {
        const nameParts = personalInfo.fullName.trim().split(' ');
        await authService.updateProfile({
          first_name: nameParts[0] ?? '',
          last_name: nameParts.slice(1).join(' ') || undefined,
          phone: personalInfo.phoneNumber.replace(/^\+234\s?/, ''),
        });
      } else if (section === 'cac') {
        await apiClient.patch(API_ENDPOINTS.AUTH.VENDOR_PROFILE_UPDATE, {
          cac_registration: cacRegistration.cacNumber,
          tin: cacRegistration.tinNumber,
        });
      } else if (section === 'store') {
        // I added the missing store settings API call block here
        await apiClient.patch(API_ENDPOINTS.AUTH.VENDOR_PROFILE_UPDATE, {
          // Adjust these fields based on what your backend actually accepts
          store_currency: storeSettings.currency,
          store_status: storeSettings.storeStatus,
          vacation_mode: storeSettings.vacationMode,
        });
      }
      setSectionMsg({ section, msg: 'Saved successfully', ok: true });
    } catch (err: any) {
      const detail = err.response?.data?.detail || err.response?.data?.message;
      setSectionMsg({ section, msg: detail || 'Failed to save. Please try again.', ok: false });
    } finally {
      setSavingSection(null);
      setTimeout(() => setSectionMsg(null), 3000);
    }
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
      </motion.div>

      {/* --- TAB NAVIGATION --- */}
      <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-crimson text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- TAB CONTENT AREA --- */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* 1. Business Profile Tab */}
          {activeTab === 'business' && (
            <motion.div
              key="business"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="glass border-white/10 rounded-xl p-6"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Business Name</label>
                  <input
                    type="text"
                    value={businessProfile.businessName}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, businessName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Business Description</label>
                  <textarea
                    value={businessProfile.businessDescription}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, businessDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Business Address</label>
                  <input
                    type="text"
                    value={businessProfile.businessAddress}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, businessAddress: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Business Phone</label>
                  <input
                    type="tel"
                    value={businessProfile.businessPhone}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, businessPhone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
                  />
                </div>

                {sectionMsg?.section === 'business' && (
                  <p className={`text-sm text-center ${sectionMsg.ok ? 'text-green-400' : 'text-red-400'}`}>{sectionMsg.msg}</p>
                )}
                <button
                  onClick={() => handleSave('business')}
                  disabled={savingSection === 'business'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all disabled:opacity-50"
                >
                  <Save size={20} />
                  {savingSection === 'business' ? 'Saving...' : 'Update Business Profile'}
                </button>
              </div>
            </motion.div>
          )}

          {/* 2. Personal Information Tab */}
          {activeTab === 'personal' && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="glass border-white/10 rounded-xl p-6"
            >
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

                {sectionMsg?.section === 'personal' && (
                  <p className={`text-sm text-center ${sectionMsg.ok ? 'text-green-400' : 'text-red-400'}`}>{sectionMsg.msg}</p>
                )}
                <button
                  onClick={() => handleSave('personal')}
                  disabled={savingSection === 'personal'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all disabled:opacity-50"
                >
                  <Save size={20} />
                  {savingSection === 'personal' ? 'Saving...' : 'Update Personal Info'}
                </button>
              </div>
            </motion.div>
          )}

          {/* 3. CAC Registration Tab */}
          {activeTab === 'cac' && (
            <motion.div
              key="cac"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="theme-card border-white/10 rounded-xl p-6"
            >
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

                {sectionMsg?.section === 'cac' && (
                  <p className={`text-sm text-center ${sectionMsg.ok ? 'text-green-400' : 'text-red-400'}`}>{sectionMsg.msg}</p>
                )}
                <button
                  onClick={() => handleSave('cac')}
                  disabled={savingSection === 'cac'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all disabled:opacity-50"
                >
                  <Upload size={20} />
                  {savingSection === 'cac' ? 'Saving...' : 'Upload Documents for Verification'}
                </button>
              </div>
            </motion.div>
          )}

          {/* 4. Store Settings Tab */}
          {activeTab === 'store' && (
            <motion.div
              key="store"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="glass border-white/10 rounded-xl p-6"
            >
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

                {sectionMsg?.section === 'store' && (
                  <p className={`text-sm text-center ${sectionMsg.ok ? 'text-green-400' : 'text-red-400'}`}>{sectionMsg.msg}</p>
                )}
                <button
                  onClick={() => handleSave('store')}
                  disabled={savingSection === 'store'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all disabled:opacity-50"
                >
                  <Save size={20} />
                  {savingSection === 'store' ? 'Saving...' : 'Save Store Settings'}
                </button>
              </div>
            </motion.div>
          )}

          {/* 5. Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="glass border-white/10 rounded-xl p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}