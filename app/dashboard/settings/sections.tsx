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
} from 'lucide-react';
import type {
  BusinessProfileState,
  PersonalInfoState,
  CacState,
  StoreSettingsState,
  NotificationsState,
  VerificationState,
} from './settings-form';

export interface SectionMessage {
  section: string;
  msg: string;
  ok: boolean;
}

/* ─────────────── Verification Status Banner ─────────────── */
export function VerificationBanner({ verification }: { verification: VerificationState }) {
  return (
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
          <div className={`w-3 h-3 rounded-full ${verification.email ? 'bg-green-400' : 'bg-amber-400'}`}></div>
          <div>
            <p className="text-sm font-medium">Email Verified</p>
            <p className="text-xs text-gray-400">
              {verification.email ? 'Verified ✓' : 'Pending'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
          <div className={`w-3 h-3 rounded-full ${verification.phone ? 'bg-green-400' : 'bg-amber-400'}`}></div>
          <div>
            <p className="text-sm font-medium">Phone Verified</p>
            <p className="text-xs text-gray-400">
              {verification.phone ? 'Verified ✓' : 'Pending'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
          <div className={`w-3 h-3 rounded-full ${verification.cac ? 'bg-green-400' : 'bg-amber-400'}`}></div>
          <div>
            <p className="text-sm font-medium">CAC Pending</p>
            <p className="text-xs text-gray-400">
              {verification.cac ? 'Verified ✓' : 'Upload documents'}
            </p>
          </div>
        </div>
      </div>
      {!verification.cac && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-sm text-green-400">
            <strong>85% Complete!</strong> Upload your CAC certificate to unlock premium features.
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────── Business Profile ─────────────── */
export function BusinessProfileSection({
  value,
  onChange,
  saving,
  message,
  onSave,
}: {
  value: BusinessProfileState;
  onChange: (v: BusinessProfileState) => void;
  saving: boolean;
  message?: SectionMessage;
  onSave: () => void;
}) {
  return (
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
            value={value.businessName}
            onChange={(e) => onChange({ ...value, businessName: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Business Description</label>
          <textarea
            value={value.businessDescription}
            onChange={(e) => onChange({ ...value, businessDescription: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Business Address</label>
          <input
            type="text"
            value={value.businessAddress}
            onChange={(e) => onChange({ ...value, businessAddress: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Business Phone</label>
          <input
            type="tel"
            value={value.businessPhone}
            onChange={(e) => onChange({ ...value, businessPhone: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
          />
        </div>

        {message && message.section === 'business' && (
          <p className={`text-sm text-center ${message.ok ? 'text-green-400' : 'text-red-400'}`}>{message.msg}</p>
        )}
        <button
          onClick={onSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Update Business Profile'}
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────── Personal Information ─────────────── */
export function PersonalInfoSection({
  value,
  onChange,
  verification,
  saving,
  message,
  onSave,
}: {
  value: PersonalInfoState;
  onChange: (v: PersonalInfoState) => void;
  verification: VerificationState;
  saving: boolean;
  message?: SectionMessage;
  onSave: () => void;
}) {
  return (
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
            value={value.fullName}
            onChange={(e) => onChange({ ...value, fullName: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={value.email}
              onChange={(e) => onChange({ ...value, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all pr-10"
            />
            {verification.email && (
              <CheckCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <div className="relative">
            <input
              type="tel"
              value={value.phoneNumber}
              onChange={(e) => onChange({ ...value, phoneNumber: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all pr-10"
            />
            {verification.phone && (
              <CheckCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">National ID Number</label>
          <input
            type="text"
            value={value.nationalId}
            onChange={(e) => onChange({ ...value, nationalId: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
          />
        </div>

        {message && message.section === 'personal' && (
          <p className={`text-sm text-center ${message.ok ? 'text-green-400' : 'text-red-400'}`}>{message.msg}</p>
        )}
        <button
          onClick={onSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Update Personal Info'}
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────── CAC Registration ─────────────── */
export function CacSection({
  value,
  onChange,
  saving,
  message,
  onSave,
  onFileUpload,
}: {
  value: CacState;
  onChange: (v: CacState) => void;
  saving: boolean;
  message?: SectionMessage;
  onSave: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
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
            value={value.cacNumber}
            onChange={(e) => onChange({ ...value, cacNumber: e.target.value })}
            placeholder="Enter your CAC number"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tax Identification Number (TIN)</label>
          <input
            type="text"
            value={value.tinNumber}
            onChange={(e) => onChange({ ...value, tinNumber: e.target.value })}
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
              onChange={onFileUpload}
              className="hidden"
            />
            <label htmlFor="cac-upload" className="cursor-pointer">
              <Upload size={32} className="mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-300 mb-1">
                Drag and drop your CAC certificate here, or click to browse
              </p>
              <p className="text-xs text-gray-500">PDF, JPG, or PNG (Max 5MB)</p>
              {value.certificateUploaded && (
                <div className="mt-3 flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle size={16} />
                  <span className="text-sm">Certificate uploaded successfully</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {message && message.section === 'cac' && (
          <p className={`text-sm text-center ${message.ok ? 'text-green-400' : 'text-red-400'}`}>{message.msg}</p>
        )}
        <button
          onClick={onSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all disabled:opacity-50"
        >
          <Upload size={20} />
          {saving ? 'Saving...' : 'Upload Documents for Verification'}
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────── Store Settings ─────────────── */
export function StoreSettingsSection({
  value,
  onChange,
  onSave,
}: {
  value: StoreSettingsState;
  onChange: (v: StoreSettingsState) => void;
  onSave: () => void;
}) {
  return (
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
              value={value.storeUrl}
              onChange={(e) => onChange({ ...value, storeUrl: e.target.value })}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Currency</label>
          <select
            value={value.currency}
            onChange={(e) => onChange({ ...value, currency: e.target.value })}
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
            onClick={() => onChange({ ...value, storeStatus: !value.storeStatus })}
            className={`relative w-14 h-7 rounded-full transition-all ${
              value.storeStatus ? 'bg-crimson' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                value.storeStatus ? 'right-1' : 'left-1'
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
            onClick={() => onChange({ ...value, vacationMode: !value.vacationMode })}
            className={`relative w-14 h-7 rounded-full transition-all ${
              value.vacationMode ? 'bg-crimson' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                value.vacationMode ? 'right-1' : 'left-1'
              }`}
            ></div>
          </button>
        </div>

        <button
          onClick={onSave}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all"
        >
          <Save size={20} />
          Save Store Settings
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────── Notification Preferences ─────────────── */
export function NotificationPreferencesSection({
  value,
  onChange,
}: {
  value: NotificationsState;
  onChange: (v: NotificationsState) => void;
}) {
  const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${
        active ? 'bg-crimson' : 'bg-gray-600'
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
          active ? 'right-0.5' : 'left-0.5'
        }`}
      ></div>
    </button>
  );

  return (
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
          <Toggle active={value.emailNotifications} onClick={() => onChange({ ...value, emailNotifications: !value.emailNotifications })} />
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-gray-400" />
            <div>
              <p className="font-medium text-sm">SMS Notifications</p>
              <p className="text-xs text-gray-400">Get instant SMS for new orders</p>
            </div>
          </div>
          <Toggle active={value.smsNotifications} onClick={() => onChange({ ...value, smsNotifications: !value.smsNotifications })} />
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-gray-400" />
            <div>
              <p className="font-medium text-sm">Marketing Emails</p>
              <p className="text-xs text-gray-400">Tips and promotions</p>
            </div>
          </div>
          <Toggle active={value.marketingEmails} onClick={() => onChange({ ...value, marketingEmails: !value.marketingEmails })} />
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-gray-400" />
            <div>
              <p className="font-medium text-sm">Low Stock Alerts</p>
              <p className="text-xs text-gray-400">Alert when inventory is low</p>
            </div>
          </div>
          <Toggle active={value.lowStockAlerts} onClick={() => onChange({ ...value, lowStockAlerts: !value.lowStockAlerts })} />
        </div>
      </div>
    </motion.div>
  );
}
