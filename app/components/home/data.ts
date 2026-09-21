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

export interface HomeCategory {
  label: string;
  slug: string;
  image: string;
}

export interface VendorCard {
  image: string;
  name: string;
  tag: string;
}

/* All locally available product photography — used for the floating hero,
   vendor spotlight and customer collage until real photos are supplied. */
export const galleryImages = [
  '/images/products/fashion.jpg',
  '/images/products/wireless-earbuds.jpg',
  '/images/products/smartwatch.jpg',
  '/images/products/handbad.jpg',
  '/images/products/shoes-black.jpg',
  '/images/products/speaker.jpg',
  '/images/products/backpack.jpg',
  '/images/products/phone.png',
  '/images/products/lamp.jpg',
  '/images/products/bottle.jpg',
  '/images/products/sneakers-white.png',
  '/images/products/sneakers-orange.jpg',
  '/images/products/camera.jpg',
  '/images/products/controller.jpg',
  '/images/products/book.png',
  '/images/products/boots.jpg',
  '/images/products/hair.jpg',
  '/images/products/fruits.jpg',
  '/images/products/chicken.jpg',
  '/images/products/food.jpg',
  '/images/products/girl.jpg',
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

export const homeCategories: HomeCategory[] = [
  { label: 'Home & Living', slug: 'home_living', image: '/images/products/lamp.jpg' },
  { label: 'Beauty', slug: 'beauty_hair_personal_care', image: '/images/products/hair.jpg' },
  { label: 'Accessories', slug: 'accessories', image: '/images/products/handbad.jpg' },
  { label: 'Men', slug: 'mens_fashion', image: '/images/products/shoes-black.jpg' },
  { label: 'Women', slug: 'womens_fashion', image: '/images/products/fashion.jpg' },
  { label: 'Baby & Kids', slug: 'baby_kids', image: '/images/products/bottle.jpg' },
  { label: 'Food & Drinks', slug: 'food_drinks', image: '/images/products/fruits.jpg' },
];

export const vendorCards: VendorCard[] = [
  { image: '/images/products/fashion.jpg', name: "Sarah's Fashion", tag: 'Fashion' },
  { image: '/images/products/wireless-earbuds.jpg', name: 'TechHub NG', tag: 'Electronics' },
  { image: '/images/products/chicken.jpg', name: "Nkechi's Kitchen", tag: 'Food & Drinks' },
];

export const customerCollage = [
  '/images/products/fruits.jpg',
  '/images/products/controller.jpg',
  '/images/products/hair.jpg',
  '/images/products/backpack.jpg',
];
