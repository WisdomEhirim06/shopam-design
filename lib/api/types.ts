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
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone_country_code?: string;
  phone: string;
  business_name: string;
  business_category: BusinessCategory;
  cac_registration?: string;
  tin?: string;
  business_address: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  reset_token: string;
  password: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  username?: string;
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

export interface VendorProfile {
  business_name: string;
  business_category: BusinessCategory;
  business_address?: string;
  bio?: string;
  cac_registration?: string;
  tin?: string;
  cac_verified?: boolean;
  tin_verified?: boolean;
  address_verified?: boolean;
}

export interface FullProfile {
  user: UserProfile;
  vendor_profile?: VendorProfile;
}

export type BusinessCategory =
  | 'fashion'
  | 'food'
  | 'beauty_hair'
  | 'home_living'
  | 'baby_kids'
  | 'other';

// Product Types (matches API ProductService schema)
export type ItemType = 'product' | 'service';

export interface ProductService {
  id: string;
  owner: string;
  owner_name: string;
  title: string;
  description?: string;
  category?: string;
  price: string;
  tax_inclusive: boolean;
  item_type: ItemType;
  addons: AddOn[];
  created_at: string;
  updated_at: string;
  average_rating: string;
  review_count: string;
}

// Backward-compat alias
export type Product = ProductService;

export interface ProductServiceCreate {
  title: string;
  description?: string;
  price: string;
  tax_inclusive?: boolean;
  item_type: ItemType;
  // Included for UI and future backend support (API accepts but currently ignores these)
  stock?: number;
  category?: string;
  images?: File[];
}

// Backward-compat alias
export type ProductCreate = ProductServiceCreate;

// Category Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  is_active: boolean;
}

// Cart Types
export interface SubCart {
  id: string;
  vendor_id: string;
  vendor_name: string;
  items: CartItem[];
}

export interface Cart {
  id: string;
  user: string;
  subcarts: SubCart[]; // Updated to match spec
}

export interface CartItem {
  id: string; // Updated from number to UUID string
  subcart: string;
  product: string;
  product_details: Product;
  quantity: number;
  selected_addons: string[];
  addon_details: AddOn[];
  total_price: string;
}

export interface AddOn {
  id: string; // Updated from number to UUID string
  product_service: string;
  title: string;
  description?: string;
  price: string;
  tax_inclusive: boolean;
  created_at?: string;
}

export interface AddToCartRequest {
  product_id: string; // Per spec field name
  quantity?: number;
  addon_ids?: string[]; // Per spec field name
}

export interface UpdateCartItemRequest {
  quantity?: number;
  selected_addons?: string[];
}

// Auth Request Types
export interface PasswordChangeRequest {
  old_password: string;
  new_password: string;
}

export interface TokenBlacklistRequest {
  refresh: string;
}

// Order Types (matches API Order schema)
export type OrderStatus =
  | 'pending_vendor_review'
  | 'pending_customer_approval'
  | 'awaiting_shipping_details'
  | 'shipping_set'
  | 'awaiting_payment'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'disputed'
  | 'completed'
  | 'cancelled';

export type ShippingType = 'pickup' | 'delivery';

export interface Order {
  id: string;
  customer: string;
  vendor: string;
  vendor_name: string;
  status: OrderStatus;
  shipping_type: ShippingType | null;
  shipping_address: string | null;
  shipping_fee: string;
  grand_total: string;
  items: OrderItem[];
  confirmation_code: string;
  delivery_proof_image: string | null;
  delivered_at: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  product: string;
  product_details: ProductService;
  quantity: number;
  vendor_proposed_quantity: number | null;
  active_quantity: string;
  selected_addons: string[];
  addon_details: AddOn[];
  total_price: string;
}

export interface CreateOrderRequest {
  target_type: 'cart' | 'subcart' | 'item';
  target_id: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  page?: number;
  page_size?: number;
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

// Review Types — matches spec ReviewRequest / Review schemas
export interface Review {
  id: string;
  customer: string;
  product: string | null;  // nullable UUID
  order: string | null;    // nullable UUID
  rating: number;          // 1-5
  comment?: string;
  created_at: string;
}

export interface CreateReviewRequest {
  product?: string | null; // UUID of the product
  order?: string | null;   // UUID of the order
  rating: number;
  comment?: string;
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
  category?: string; // Updated to string (UUID)
  vendor?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  is_active?: boolean;
  ordering?: 'price' | '-price' | 'created_at' | '-created_at' | 'name';
  page?: number;
  page_size?: number;
}

export interface PostFilters {
  vendor?: string;
  page?: number;
  page_size?: number;
}

// Payment Types — matches spec Payment schema exactly
export type PaymentStatus = 'pending' | 'successful' | 'failed';

export interface Payment {
  id: string;
  order: string | null;
  total_amount: string;
  vat_amount: string;
  platform_fee: string;
  vendor_payout_amount: string;
  status: PaymentStatus;
  tx_ref: string;
  monnify_ref: string;
  is_settled_to_vendor: boolean;
  created_at: string;
  updated_at: string;
}

export interface CheckoutInitRequest {
  order_id: string;
}

export interface CheckoutInitResponse {
  checkout_url: string;
  transaction_reference: string;
}

export interface DirectCardChargeRequest {
  transaction_reference: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  pin?: string;
}

export interface BankTransferInitRequest {
  transaction_reference: string;
  bank_code?: string;
}

export interface OTPAuthorizeRequest {
  transaction_reference: string;
  token_id: string;
  token: string;
}

// Order flow step types
export interface SetShippingRequest {
  shipping_type: 'delivery' | 'pickup';
  shipping_address?: string;
}

export interface CustomerApprovalRequest {
  action: 'accept' | 'reject';
}

export interface CustomerPaymentDecisionRequest {
  action: 'pay' | 'cancel';
}

export interface ConfirmHandoverRequest {
  code: string;
}

export interface RaiseDisputeRequest {
  email: string;   // required by spec
  reason: string;
}

// Message / Chat Types
export interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  is_edited: boolean;
  created_at: string;
  can_be_edited: string;
}

export interface SendMessageRequest {
  recipient: string;
  content: string;
}

// Notification Types
export interface Notification {
  id: number;
  recipient: string;
  actor: UserProfile;
  verb: string;
  target_type: string;
  target_object_id: number | null;
  is_read: boolean;
  created_at: string;
}