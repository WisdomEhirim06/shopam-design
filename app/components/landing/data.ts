import {
  ShoppingBag,
  Home,
  Utensils,
  Dumbbell,
  Camera,
  GraduationCap,
  Scissors,
  Wrench,
  Shield,
  Truck,
  HeadphonesIcon,
  type LucideIcon,
} from 'lucide-react';

export interface HeroSlide {
  image: string;
  title: string;
  titleHighlight: string;
  titleEnd?: string;
  subtitle: string;
}

export interface StressPhrase {
  text: string;
  image: string;
  isResolution?: boolean;
}

export interface TrendingProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  vendor: string;
  rating: number;
  reviews: number;
}

export interface CategoryItem {
  name: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  iconBg: string;
}

export interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const heroSlides: HeroSlide[] = [
  {
    image: '/images/hero-shopping.jpg',
    title: 'Shopping Never Gets',
    titleHighlight: 'Stressful',
    subtitle: 'Discover amazing products from trusted vendors',
  },
  {
    image: '/images/hero-3.jpg',
    title: 'Find Everything',
    titleHighlight: 'You Need',
    titleEnd: 'in One Place',
    subtitle: 'From fashion to electronics, we have it all',
  },
  {
    image: '/images/hero-man-shopping.JPG',
    title: 'Shop with',
    titleHighlight: 'Confidence',
    titleEnd: 'Every Time',
    subtitle: 'Verified vendors, quality products, trusted service',
  },
];

export const stressPhrases: StressPhrase[] = [
  { text: "Tired of fake products?", image: '/images/stress-1.jpg' },
  { text: "Can't find what you need?", image: '/images/stress-2.jpeg' },
  { text: "Worried about getting scammed?", image: '/images/stress-3.jpg' },
  { text: "Frustrated with poor customer service?", image: '/images/stress-4.jpg' },
  { text: "ShopAm is different.", image: '/images/stress-5.jpg', isResolution: true },
];

export const trendingProducts: TrendingProduct[] = [
  { id: 1, name: 'Wireless Earbuds', price: 15000, originalPrice: 20000, discount: 25, image: '/images/products/wireless-earbuds.jpg', vendor: 'TechHub NG', rating: 4.8, reviews: 234 },
  { id: 2, name: 'Ankara Dress', price: 28000, image: '/images/products/fashion.jpg', vendor: "Sarah's Fashion", rating: 4.9, reviews: 189 },
  { id: 3, name: 'Smart Watch', price: 45000, originalPrice: 55000, discount: 18, image: '/images/products/smartwatch.jpg', vendor: 'Gadgets Plus', rating: 4.7, reviews: 456 },
  { id: 4, name: 'Leather Handbag', price: 32000, image: '/images/products/handbad.jpg', vendor: 'Luxury Bags', rating: 4.6, reviews: 321 },
  { id: 5, name: 'Running Shoes', price: 25000, image: '/images/products/shoes-black.jpg', vendor: 'SportFit NG', rating: 4.8, reviews: 278 },
  { id: 6, name: 'Bluetooth Speaker', price: 18000, originalPrice: 25000, discount: 28, image: '/images/products/speaker.jpg', vendor: 'Audio World', rating: 4.7, reviews: 445 },
  { id: 7, name: 'Laptop Backpack', price: 12000, image: '/images/products/backpack.jpg', vendor: 'Bags & More', rating: 4.5, reviews: 167 },
  { id: 8, name: 'Phone Case', price: 3500, image: '/images/products/phone.png', vendor: 'Accessories Hub', rating: 4.6, reviews: 892 },
  { id: 9, name: 'Desk Lamp', price: 8500, image: '/images/products/lamp.jpg', vendor: 'Home Essentials', rating: 4.7, reviews: 234 },
  { id: 10, name: 'Water Bottle', price: 4000, image: '/images/products/bottle.jpg', vendor: 'Fitness Gear', rating: 4.8, reviews: 567 },
];

export const productImages = [
  '/images/products/fruits.jpg',
  '/images/products/shoes-black.jpg',
  '/images/products/chicken.jpg',
  '/images/products/sneakers-white.png',
  '/images/products/phone.png',
  '/images/products/fashion.jpg',
  '/images/products/hair.jpg',
];

export const productImages2 = [
  '/images/products/camera.jpg',
  '/images/products/sneakers-orange.jpg',
  '/images/products/book.png',
  '/images/products/boots.jpg',
  '/images/products/food.jpg',
  '/images/products/controller.jpg',
  '/images/products/girl.jpg',
];

export const categories: CategoryItem[] = [
  { name: 'Beauty & Hair', icon: Scissors, color: 'bg-pink-50', textColor: 'text-pink-600', iconBg: 'bg-pink-100' },
  { name: 'Tech & Repair', icon: Wrench, color: 'bg-blue-50', textColor: 'text-blue-600', iconBg: 'bg-blue-100' },
  { name: 'Home Services', icon: Home, color: 'bg-green-50', textColor: 'text-green-600', iconBg: 'bg-green-100' },
  { name: 'Fashion', icon: ShoppingBag, color: 'bg-purple-50', textColor: 'text-purple-600', iconBg: 'bg-purple-100' },
  { name: 'Food & Catering', icon: Utensils, color: 'bg-orange-50', textColor: 'text-orange-600', iconBg: 'bg-orange-100' },
  { name: 'Fitness & Wellness', icon: Dumbbell, color: 'bg-pink-50', textColor: 'text-pink-600', iconBg: 'bg-pink-100' },
  { name: 'Photography', icon: Camera, color: 'bg-yellow-50', textColor: 'text-yellow-600', iconBg: 'bg-yellow-100' },
  { name: 'Education', icon: GraduationCap, color: 'bg-blue-50', textColor: 'text-blue-600', iconBg: 'bg-blue-100' },
];

export const benefits: Benefit[] = [
  { icon: Shield, title: 'Verified Vendors', description: 'All vendors are thoroughly vetted' },
  { icon: Truck, title: 'Fast Delivery', description: 'Quick and reliable delivery' },
  { icon: HeadphonesIcon, title: '24/7 Support', description: 'Always here to help you' },
];
