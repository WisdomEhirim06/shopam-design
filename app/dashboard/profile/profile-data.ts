export const toTitleCase = (str: string) => {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
};

export const CATEGORY_LABEL: Record<string, string> = {
  fashion: 'Fashion',
  food: 'Food & Drinks',
  beauty_hair: 'Beauty, Hair & Personal Care',
  home_living: 'Home & Living',
  baby_kids: 'Baby & Kids',
  other: 'Other',
};

export const settingsItems = [
  { label: 'Edit Profile' },
  { label: 'Notification Preferences' },
  { label: 'Payment & Bank Details' },
  { label: 'Privacy & Security' },
  { label: 'Help & Support' },
];
