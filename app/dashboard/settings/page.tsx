'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authService } from '@/lib/api';
import apiClient, { API_ENDPOINTS } from '@/lib/api/config';
import {
  INITIAL_BUSINESS_PROFILE,
  INITIAL_PERSONAL_INFO,
  INITIAL_CAC,
  INITIAL_STORE_SETTINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_VERIFICATION,
  type BusinessProfileState,
  type PersonalInfoState,
  type CacState,
  type StoreSettingsState,
  type NotificationsState,
  type VerificationState,
} from './settings-form';
import {
  VerificationBanner,
  BusinessProfileSection,
  PersonalInfoSection,
  CacSection,
  StoreSettingsSection,
  NotificationPreferencesSection,
  type SectionMessage,
} from './sections';

export default function SettingsPage() {
  const [businessProfile, setBusinessProfile] = useState<BusinessProfileState>(INITIAL_BUSINESS_PROFILE);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoState>(INITIAL_PERSONAL_INFO);
  const [cacRegistration, setcacRegistration] = useState<CacState>(INITIAL_CAC);
  const [storeSettings, setStoreSettings] = useState<StoreSettingsState>(INITIAL_STORE_SETTINGS);
  const [notifications, setNotifications] = useState<NotificationsState>(INITIAL_NOTIFICATIONS);
  const [verificationStatus, setVerificationStatus] = useState<VerificationState>(INITIAL_VERIFICATION);

  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [sectionMsg, setSectionMsg] = useState<SectionMessage | null>(null);

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

      <VerificationBanner verification={verificationStatus} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BusinessProfileSection
          value={businessProfile}
          onChange={setBusinessProfile}
          saving={savingSection === 'business'}
          message={sectionMsg ?? undefined}
          onSave={() => handleSave('business')}
        />

        <PersonalInfoSection
          value={personalInfo}
          onChange={setPersonalInfo}
          verification={verificationStatus}
          saving={savingSection === 'personal'}
          message={sectionMsg ?? undefined}
          onSave={() => handleSave('personal')}
        />

        <CacSection
          value={cacRegistration}
          onChange={setcacRegistration}
          saving={savingSection === 'cac'}
          message={sectionMsg ?? undefined}
          onSave={() => handleSave('cac')}
          onFileUpload={handleFileUpload}
        />

        <StoreSettingsSection
          value={storeSettings}
          onChange={setStoreSettings}
          onSave={() => handleSave('store')}
        />
      </div>

      <NotificationPreferencesSection
        value={notifications}
        onChange={setNotifications}
      />
    </div>
  );
}
