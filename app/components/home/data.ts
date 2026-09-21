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
  { label: 'Men', slug: 'mens_fashion', image: '/images/shopam pictures/men wear.jpg' },
  { label: 'Women', slug: 'womens_fashion', image: '/images/shopam pictures/womenwears.jpg' },
  { label: 'Baby & Kids', slug: 'baby_kids', image: '/images/shopam pictures/babytoys.jpg' },
  { label: 'Food & Drinks', slug: 'food_drinks', image: '/images/products/fruits.jpg' },
];

export interface FloatingProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  vendor: string;
  rating: number;
  reviews: number;
  tag?: string;
}

export const floatingProductSets: FloatingProduct[][] = [
  // Set 1
  [
    { id: 1, name: 'Air Retro High', price: 28000, image: '/images/products/sneakers-orange.jpg', vendor: 'Urban Kicks', rating: 4.9, reviews: 48, tag: 'Sneakers' },
    { id: 2, name: 'Clothes', price: 15000, image: '/images/shopam pictures/clothing lines.jpg', vendor: 'Plain Tees', rating: 4.8, reviews: 234, tag: 'Clothing' },
    { id: 3, name: 'Traditional Soups', price: 10000, image: '/images/shopam pictures/soupdishes.jpg', vendor: 'Grandmas Taste', rating: 4.7, reviews: 456, tag: 'Dishes' },
    { id: 4, name: 'Leather Tote', price: 32000, image: '/images/products/handbad.jpg', vendor: 'Luxury Bags', rating: 4.6, reviews: 321, tag: 'Fashion' },
    { id: 5, name: 'Moisturizer', price: 18000, image: '/images/shopam pictures/ladiesskincare.jpg', vendor: 'Velva Skin', rating: 4.7, reviews: 445, tag: 'Beauty' },
  ],
  // Set 2
  [
    { id: 6, name: 'Nordic Lamp', price: 8500, image: '/images/products/lamp.jpg', vendor: 'Home Living', rating: 4.7, reviews: 234, tag: 'Home' },
    { id: 7, name: 'Ankara Gown', price: 28000, image: '/images/products/fashion.jpg', vendor: "Sarah's Fashion", rating: 4.9, reviews: 189, tag: 'Fashion' },
    { id: 8, name: 'Face Care', price: 22000, image: '/images/shopam pictures/makeup.jpg', vendor: 'Velva Skin', rating: 4.8, reviews: 312, tag: 'Beauty' },
    { id: 9, name: 'SpeedRunner X', price: 25000, image: '/images/products/shoes-black.jpg', vendor: 'SportFit NG', rating: 4.8, reviews: 278, tag: 'Footwear' },
    { id: 10, name: 'Hydro Thermo', price: 4000, image: '/images/products/bottle.jpg', vendor: 'Fitness Gear', rating: 4.8, reviews: 567, tag: 'Fitness' },
  ],
  // Set 3
  [
    { id: 11, name: 'Retro Cam 4K', price: 65000, image: '/images/products/sneakers-white.png', vendor: "Sarah's Fashion", rating: 4.9, reviews: 92, tag: 'Fashion' },
    { id: 12, name: 'Novel Books', price: 3500, image: '/images/products/book.png', vendor: 'Libraries NG', rating: 4.6, reviews: 892, tag: 'Books' },
    { id: 13, name: 'Urban Commute', price: 12000, image: '/images/products/backpack.jpg', vendor: 'Bags & More', rating: 4.5, reviews: 167, tag: 'Bags' },
    { id: 14, name: 'Timber Boot', price: 38000, image: '/images/products/boots.jpg', vendor: 'Footwear NG', rating: 4.7, reviews: 140, tag: 'Boots' },
    { id: 15, name: 'Organic Basket', price: 9500, image: '/images/products/fruits.jpg', vendor: 'Fresh Market', rating: 4.9, reviews: 380, tag: 'Groceries' },
  ],
];

export const vendorCards: VendorCard[] = [
  { image: '/images/shopam pictures/african-vendor.jpg', name: "Sarah's Fashion", tag: 'Fashion & Wears' },
  { image: '/images/shopam pictures/ankara stalls.jpg', name: 'Ankara Den', tag: 'Fashion & Wears' },
  { image: '/images/shopam pictures/food-vendors.jpg', name: "Nkechi's Kitchen", tag: 'Food & Drinks' },
  { image: '/images/products/hair.jpg', name: 'Glow Care', tag: 'Beauty & Hair' },
  { image: '/images/products/sneakers-orange.jpg', name: 'Urban Footwear', tag: 'Shoes & Sneakers' },
];

export const customerCollage = [
  '/images/shopam pictures/black-friends.jpg',
  '/images/shopam pictures/black-family.jpg',
  '/images/shopam pictures/blackcustomers.jpg',
  '/images/products/backpack.jpg',
];
