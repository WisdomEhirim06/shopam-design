// User & Authentication Types

// Matches /api/accounts/register/customer/ → UserRegisterRequest schema
export interface UserRegister {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  phone_country_code?: string;
  phone?: string;
  profile_pic?: File;
}

// Matches /api/accounts/register/vendor/ → VendorRegisterRequest schema
// Required: email, password, first_name, last_name, phone, business_name, business_category
export interface VendorRegister {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone_country_code?: string;  // default: '234' per spec
  phone: string;
  business_name: string;
  business_category: BusinessCategory;
  cac_registration?: string;    // writeOnly — sent only on registration
  tin?: string;                 // writeOnly
  business_address?: string;    // writeOnly — optional per spec
  logo?: File;                  // binary — sent as multipart when present
}

export interface VendorUpgradeRequest {
  business_name?: string;
  business_category?: BusinessCategory;
  business_address?: string;
  logo?: File;
  cac_registration?: string;
  tin?: string;
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

// Exact values from BusinessCategoryEnum in the API spec
export type BusinessCategory =
  | 'fashion'
  | 'beauty_hair'
  | 'home_living'
  | 'food_drinks'
  | 'baby_kids'
  | 'books_stationery'
  | 'health_wellness';

// Product Types (matches API ProductService schema)
export type ItemType = 'product' | 'service';

export interface ProductImage {
  id: string;
  image_url: string;
}

export interface ProductService {
  id: string;
  owner: string;
  owner_name: string;
  title: string;
  description?: string;
  taxonomy_path: string;
  price: string;
  tax_inclusive: boolean;
  item_type: ItemType;
  addons: AddOn[];
  images: ProductImage[];
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
  stock?: number; // local UI only — not persisted to backend
  taxonomy_id?: string; // UUID of the selected Taxonomy node
  images?: File[];
}

// Backward-compat alias
export type ProductCreate = ProductServiceCreate;

// Category / Taxonomy Types
// The API uses a single self-referencing Taxonomy model with infinite nesting via `parent`.
export interface Category {
  id: string;
  name: string;
  parent: string | null; // UUID of parent node, null for root categories
  subcategories: any;    // nested children returned by the API (may be array or URL string)
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
  id: string;
  subcart: string;
  product: string;
  product_details: Product;
  quantity: number;
  variant: string | null;
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
  product_id: string;
  quantity?: number;
  variant?: string | null;
  addon_ids?: string[];
}

export interface UpdateCartItemRequest {
  quantity?: number;
  variant?: string | null;
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
  variant: string | null;
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
  item_type?: ItemType;
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