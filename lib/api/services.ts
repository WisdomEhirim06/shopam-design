import apiClient, { API_ENDPOINTS } from './config';
import type {
  Order,
  CreateOrderRequest,
  OrderFilters,
  PaginatedResponse,
  Post,
  CreatePostRequest,
  PostFilters,
  Like,
  CreateLikeRequest,
  Comment,
  CreateCommentRequest,
  Follow,
  CreateFollowRequest,
  Review,
  CreateReviewRequest,
} from './types';

// Orders Service
export const ordersService = {
  /** Get the vendor's incoming orders */
  async getVendorOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get<PaginatedResponse<Order>>(
      API_ENDPOINTS.ORDERS.VENDOR_LIST,
      { params: filters }
    );
    return response.data;
  },

  /** Get all orders (general) */
  async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get<PaginatedResponse<Order>>(
      API_ENDPOINTS.ORDERS.LIST,
      { params: filters }
    );
    return response.data;
  },

  /** Get single order by ID */
  async getOrder(id: string): Promise<Order> {
    const response = await apiClient.get<Order>(
      API_ENDPOINTS.ORDERS.DETAIL(id)
    );
    return response.data;
  },

  /** Place a new order (Step 1) */
  async createOrder(data: CreateOrderRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.ORDERS.PLACE, data);
  },

  /** Step 2: Vendor reviews (accepts or proposes changes to) an order */
  async vendorReview(orderId: string, body?: Record<string, unknown>): Promise<void> {
    await apiClient.post(API_ENDPOINTS.ORDERS.VENDOR_REVIEW(orderId), body ?? {});
  },

  /** Step 5: Vendor sets the shipping fee */
  async setShippingFee(orderId: string, shippingFee: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.ORDERS.SET_SHIPPING_FEE(orderId), { shipping_fee: shippingFee });
  },

  /** Step 7: Vendor marks order as shipped / starts delivery */
  async startDelivery(orderId: string): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.ORDERS.START_DELIVERY(orderId));
  },

  /** Update order fields */
  async updateOrder(id: string, data: Partial<Order>): Promise<Order> {
    const response = await apiClient.patch<Order>(
      API_ENDPOINTS.ORDERS.UPDATE(id),
      data
    );
    return response.data;
  },
};

// Posts Service
export const postsService = {
  /**
   * Get posts (feed)
   */
  async getPosts(filters?: PostFilters): Promise<PaginatedResponse<Post>> {
    const response = await apiClient.get<PaginatedResponse<Post>>(
      API_ENDPOINTS.POSTS.LIST,
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get single post
   */
  async getPost(id: number): Promise<Post> {
    const response = await apiClient.get<Post>(
      API_ENDPOINTS.POSTS.DETAIL(id)
    );
    return response.data;
  },

  /**
   * Create post (vendor only)
   */
  async createPost(data: CreatePostRequest): Promise<Post> {
    const formData = new FormData();
    formData.append('caption', data.caption);
    
    if (data.media) {
      data.media.forEach((file) => {
        formData.append('media', file);
      });
    }

    const response = await apiClient.post<Post>(
      API_ENDPOINTS.POSTS.CREATE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Update post
   */
  async updatePost(id: number, data: Partial<CreatePostRequest>): Promise<Post> {
    const response = await apiClient.patch<Post>(
      API_ENDPOINTS.POSTS.UPDATE(id),
      data
    );
    return response.data;
  },

  /**
   * Delete post
   */
  async deletePost(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.POSTS.DELETE(id));
  },
};

// Likes Service
export const likesService = {
  /**
   * Like a post
   */
  async likePost(data: CreateLikeRequest): Promise<Like> {
    const response = await apiClient.post<Like>(
      API_ENDPOINTS.LIKES.CREATE,
      data
    );
    return response.data;
  },

  /**
   * Unlike a post
   */
  async unlikePost(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.LIKES.DELETE(id));
  },
};

// Comments Service
export const commentsService = {
  /**
   * Get comments for a post
   */
  async getComments(postId: number): Promise<Comment[]> {
    const response = await apiClient.get<Comment[]>(
      API_ENDPOINTS.COMMENTS.LIST,
      { params: { post: postId } }
    );
    return response.data;
  },

  /**
   * Add comment
   */
  async createComment(data: CreateCommentRequest): Promise<Comment> {
    const response = await apiClient.post<Comment>(
      API_ENDPOINTS.COMMENTS.CREATE,
      data
    );
    return response.data;
  },

  /**
   * Update comment
   */
  async updateComment(id: number, comment: string): Promise<Comment> {
    const response = await apiClient.patch<Comment>(
      API_ENDPOINTS.COMMENTS.UPDATE(id),
      { comment }
    );
    return response.data;
  },

  /**
   * Delete comment
   */
  async deleteComment(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COMMENTS.DELETE(id));
  },
};

// Follows Service
export const followsService = {
  /**
   * Follow a vendor
   */
  async followVendor(data: CreateFollowRequest): Promise<Follow> {
    const response = await apiClient.post<Follow>(
      API_ENDPOINTS.FOLLOWS.CREATE,
      data
    );
    return response.data;
  },

  /**
   * Unfollow a vendor
   */
  async unfollowVendor(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.FOLLOWS.DELETE(id));
  },
};

// Reviews Service
export const reviewsService = {
  /**
   * Get reviews for a product
   */
  async getReviews(productId?: string): Promise<Review[]> {
    const response = await apiClient.get<Review[]>(
      API_ENDPOINTS.REVIEWS.LIST,
      { params: productId ? { product: productId } : {} }
    );
    return response.data;
  },

  /**
   * Create review
   */
  async createReview(data: CreateReviewRequest): Promise<Review> {
    const response = await apiClient.post<Review>(
      API_ENDPOINTS.REVIEWS.CREATE,
      data
    );
    return response.data;
  },

  /**
   * Update review
   */
  async updateReview(id: number, data: Partial<CreateReviewRequest>): Promise<Review> {
    const response = await apiClient.patch<Review>(
      API_ENDPOINTS.REVIEWS.UPDATE(id),
      data
    );
    return response.data;
  },

  /**
   * Delete review
   */
  async deleteReview(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.REVIEWS.DELETE(id));
  },
};