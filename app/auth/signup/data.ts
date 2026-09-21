export interface PersonalData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  first_name: string;
  middle_name: string;
  last_name: string;
}

export interface BusinessData {
  business_name: string;
  business_category: BusinessCategory;
  business_address: string;
  cac_registration: string;
  tin: string;
  logo: File | null;
  logoPreview: string;
}

export type BusinessCategory = 'fashion' | 'food_drinks' | 'beauty_hair' | 'home_living' | 'baby_kids' | 'books_stationery' | 'health_wellness';

// Values must match BusinessCategoryEnum in the API spec exactly
export const BUSINESS_CATEGORIES: { value: BusinessCategory; label: string }[] = [
  { value: 'fashion', label: 'Fashion' },
  { value: 'food_drinks', label: 'Food & Drinks' },
  { value: 'beauty_hair', label: 'Beauty, Hair & Personal Care' },
  { value: 'home_living', label: 'Home & Living' },
  { value: 'baby_kids', label: 'Baby & Kids' },
  { value: 'books_stationery', label: 'Books & Stationery' },
  { value: 'health_wellness', label: 'Health & Wellness' },
];
