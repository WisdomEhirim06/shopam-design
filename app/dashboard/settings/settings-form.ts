export interface BusinessProfileState {
  businessName: string;
  businessDescription: string;
  businessAddress: string;
  businessPhone: string;
}

export interface PersonalInfoState {
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
}

export interface CacState {
  cacNumber: string;
  tinNumber: string;
  certificateUploaded: boolean;
}

export interface StoreSettingsState {
  storeUrl: string;
  currency: string;
  storeStatus: boolean;
  vacationMode: boolean;
}

export interface NotificationsState {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  lowStockAlerts: boolean;
}

export interface VerificationState {
  email: boolean;
  phone: boolean;
  cac: boolean;
}

export const INITIAL_BUSINESS_PROFILE: BusinessProfileState = {
  businessName: '',
  businessDescription: '',
  businessAddress: '',
  businessPhone: '',
};

export const INITIAL_PERSONAL_INFO: PersonalInfoState = {
  fullName: '',
  email: '',
  phoneNumber: '',
  nationalId: '',
};

export const INITIAL_CAC: CacState = {
  cacNumber: '',
  tinNumber: '',
  certificateUploaded: false,
};

export const INITIAL_STORE_SETTINGS: StoreSettingsState = {
  storeUrl: '',
  currency: 'NGN',
  storeStatus: true,
  vacationMode: false,
};

export const INITIAL_NOTIFICATIONS: NotificationsState = {
  emailNotifications: true,
  smsNotifications: true,
  marketingEmails: false,
  lowStockAlerts: true,
};

export const INITIAL_VERIFICATION: VerificationState = {
  email: false,
  phone: false,
  cac: false,
};
