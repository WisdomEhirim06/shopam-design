import type { Product } from '@/lib/api';

/* ── Dummy products shown while real vendor listings are pending ── */
export const DUMMY_PRODUCTS: Product[] = [
  { id: 'd1', owner: 'vendor1', owner_name: 'Adaeze Couture', title: 'African Print Wrap Dress', description: 'Vibrant Ankara wrap dress, available in M/L/XL', price: '28000', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.8', review_count: '124' },
  { id: 'd2', owner: 'vendor2', owner_name: "Mama Nkechi's Kitchen", title: 'Jollof Rice Family Platter', description: 'Party-size smoky Jollof for 5–6 people', price: '8500', tax_inclusive: false, item_type: 'service', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '5.0', review_count: '87' },
  { id: 'd3', owner: 'vendor3', owner_name: 'Lagos Craft House', title: 'Handwoven Rattan Basket Set', description: 'Set of 3 handcrafted storage baskets', price: '12500', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.6', review_count: '52' },
  { id: 'd4', owner: 'vendor4', owner_name: 'Tunde Skincare', title: 'Shea Butter Body Cream 250ml', description: 'Cold-pressed natural shea butter, unscented', price: '5500', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.9', review_count: '210' },
  { id: 'd5', owner: 'vendor5', owner_name: 'Chioma Tech Hub', title: 'Phone Screen Repair (Any Model)', description: 'Same-day screen replacement service, warranty included', price: '15000', tax_inclusive: true, item_type: 'service', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.7', review_count: '63' },
  { id: 'd6', owner: 'vendor6', owner_name: 'Eko Fabrics', title: 'Aso-Oke Head Tie Set', description: 'Premium woven aso-oke, 3-piece gele set', price: '35000', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.5', review_count: '39' },
  { id: 'd7', owner: 'vendor1', owner_name: 'Adaeze Couture', title: 'Beaded Ankara Clutch Bag', description: 'Hand-beaded evening clutch, various colours', price: '9500', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.4', review_count: '28' },
  { id: 'd8', owner: 'vendor7', owner_name: 'Naija Fresh Farm', title: 'Organic Ofada Rice 5kg', description: 'Stone-free, sun-dried local Ofada variety', price: '7200', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.8', review_count: '156' },
  { id: 'd9', owner: 'vendor8', owner_name: 'Kemi Beauty Bar', title: 'Lace Front Wig 20" Natural', description: 'Brazilian hair lace front, natural black', price: '85000', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.9', review_count: '72' },
  { id: 'd10', owner: 'vendor9', owner_name: 'IbadanWood Works', title: 'Custom Wooden Photo Frame', description: 'Personalized engraved hardwood frame, 8×10"', price: '6800', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.7', review_count: '44' },
  { id: 'd11', owner: 'vendor2', owner_name: "Mama Nkechi's Kitchen", title: 'Egusi Soup + Fufu Combo', description: 'Rich egusi soup with goat meat, served with fufu', price: '4500', tax_inclusive: false, item_type: 'service', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '5.0', review_count: '198' },
  { id: 'd12', owner: 'vendor5', owner_name: 'Chioma Tech Hub', title: 'Laptop Battery Replacement', description: 'Genuine replacement batteries, all laptop brands', price: '25000', tax_inclusive: true, item_type: 'service', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.6', review_count: '31' },
];

export const FILTER_CATEGORIES = [
  { label: "Food and Drinks", slug: 'food_drinks' },
  { label: "Home and Living", slug: 'home_living' },
  { label: "Beauty, Hair and Personal Care", slug: 'beauty_hair_personal_care' },
  { label: "Accessories", slug: 'accessories' },
  { label: "Women's Fashion", slug: 'womens_fashion' },
  { label: "Men's Fashion", slug: 'mens_fashion' },
  { label: "Baby and Kids", slug: 'baby_kids' },
];
