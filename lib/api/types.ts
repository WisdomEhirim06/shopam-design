// User & Authentication Types
export interface UserRegister {
  username: string;
  email: string;
  password: string;
  phone: string;
  first_name?: string;
  last_name?: string;
}

export interface VendorRegister {
  user: string; // UUID
  business_category: BusinessCategory;
  cac_registration?: string;
  tin?: string;
  password: string;
}

export interface LoginRequest {
  username: string; // Can be username or email
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  is_customer?: boolean;
  is_vendor?: boolean;
}

export type BusinessCategory = 
  | 'retail' 
  | 'wholesale' 
  | 'service' 
  | 'food' 
  | 'fashion' 
  | 'tech' 
  | 'beauty'
  | 'electronics'
  | 'other';

// Product Types
export interface Product {
  id: string;
  vendor: string;
  category: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  images?: string[];
  is_active: boolean;
  rating?: number;
  reviews_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  category: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  images?: File[];
}

export interface AddOn {
  id: number;
  product: string;
  name: string;
  price: string;
  is_available: boolean;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  is_active: boolean;
}

// Cart Types
export interface Cart {
  id: string;
  user: string;
  items: CartItem[];
  subtotal: string;
  total: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  cart: string;
  product: Product;
  quantity: number;
  selected_addons: AddOn[];
  price: string;
}

export interface AddToCartRequest {
  product: string; // UUID
  quantity: number;
  selected_addons?: number[]; // Add-on IDs
}

export interface UpdateCartItemRequest {
  quantity?: number;
  selected_addons?: number[];
}

// Order Types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  user: string;
  status: OrderStatus;
  items: OrderItem[];
  total_price: string;
  shipping_address: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order: string;
  product: Product;
  quantity: number;
  price: string;
  selected_addons: AddOn[];
}

export interface CreateOrderRequest {
  shipping_address: string;
  payment_method?: string;
}

// Transaction Types
export type TransactionStatus = 'processing' | 'completed' | 'cancelled';

export interface Transaction {
  id: string;
  order: string;
  product: string;
  vendor: string;
  quantity: number;
  selected_addons: AddOn[];
  total_price: string;
  tax_amount: string;
  platform_fee: string;
  vendor_payout: string;
  status: TransactionStatus;
  created_at: string;
  updated_at: string;
}

// Review Types
export interface Review {
  id: number;
  customer: string;
  transaction: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewRequest {
  transaction: string; // UUID
  rating: number;
  comment: string;
}

// Social - Post Types
export interface Post {
  id: number;
  vendor: UserProfile;
  caption: string;
  media?: string[]; // URLs
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked?: boolean; // If current user has liked
  created_at: string;
  updated_at: string;
}

export interface CreatePostRequest {
  caption: string;
  media?: File[];
}

// Social - Like Types
export interface Like {
  id: number;
  user: UserProfile;
  post: number;
  created_at: string;
}

export interface CreateLikeRequest {
  post: number;
}

// Social - Comment Types
export interface Comment {
  id: number;
  user: UserProfile;
  post: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentRequest {
  post: number;
  comment: string;
}

// Social - Follow Types
export interface Follow {
  id: number;
  follower: UserProfile;
  followed_vendor: string; // UUID
  created_at: string;
}

export interface CreateFollowRequest {
  followed_vendor: string; // UUID
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface APIError {
  status: 'error';
  message: string;
  errors?: Record<string, string[]>;
}

export interface APISuccess<T> {
  status: 'success';
  data: T;
  message?: string;
}

// Filter & Query Types
export interface ProductFilters {
  category?: number;
  vendor?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  is_active?: boolean;
  ordering?: 'price' | '-price' | 'created_at' | '-created_at' | 'name';
  page?: number;
  page_size?: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  page?: number;
  page_size?: number;
}

export interface PostFilters {
  vendor?: string;
  page?: number;
  page_size?: number;
}