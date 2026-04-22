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
  SetShippingRequest,
  CustomerApprovalRequest,
  CustomerPaymentDecisionRequest,
  ConfirmHandoverRequest,
  RaiseDisputeRequest,
  Message,
  SendMessageRequest,
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

  /** Get single order by ID — tries vendor detail endpoint first, falls back to customer history search */
  async getOrder(id: string): Promise<Order> {
    try {
      const response = await apiClient.get<Order>(API_ENDPOINTS.ORDERS.DETAIL(id));
      return response.data;
    } catch {
      // Buyer can't access /commerceorders/{id}/ directly — search history instead
      const hist = await apiClient.get<PaginatedResponse<Order>>(API_ENDPOINTS.ORDERS.HISTORY);
      const match = hist.data.results?.find((o) => o.id === id);
      if (match) return match;
      throw new Error('Order not found');
    }
  },

  /** Place a new order (Step 1) — returns the created orders array */
  async createOrder(data: CreateOrderRequest): Promise<Order[]> {
    const response = await apiClient.post<Order[]>(API_ENDPOINTS.ORDERS.PLACE, data);
    return Array.isArray(response.data) ? response.data : [response.data as unknown as Order];
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

  /** Step 3: Customer accepts or rejects vendor modifications */
  async customerApprove(orderId: string, data: CustomerApprovalRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.ORDERS.CUSTOMER_APPROVE(orderId), data);
  },

  /** Step 4: Customer provides shipping type and address */
  async setShipping(orderId: string, data: SetShippingRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.ORDERS.SET_SHIPPING(orderId), data);
  },

  /** Step 6: Customer decides to pay or cancel (must call paymentsService.initCheckout first) */
  async paymentDecision(orderId: string, data: CustomerPaymentDecisionRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.ORDERS.PAYMENT_DECISION(orderId), data);
  },

  /** Step 8: Customer confirms delivery with the handover code */
  async confirmHandover(orderId: string, data: ConfirmHandoverRequest): Promise<{ status: string; payout_date: string }> {
    const response = await apiClient.post<{ status: string; payout_date: string }>(
      API_ENDPOINTS.ORDERS.CONFIRM_HANDOVER(orderId),
      data
    );
    return response.data;
  },

  /** Step 9: Customer raises a dispute within 7 days of delivery */
  async raiseDispute(orderId: string, data: RaiseDisputeRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.ORDERS.RAISE_DISPUTE(orderId), data);
  },

  /** Customer's full order history (paginated, newest first) */
  async getOrderHistory(page = 1, pageSize = 20): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get<PaginatedResponse<Order>>(
      API_ENDPOINTS.ORDERS.HISTORY,
      { params: { page, page_size: pageSize } }
    );
    return response.data;
  },

  /** Smart filter endpoint — auto-detects vendor vs customer */
  async filterOrders(filters?: { order_id?: string; status?: string; page?: number }): Promise<Order | PaginatedResponse<Order>> {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.FILTER, { params: filters });
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

// Direct Messages Service
export const messagesService = {
  /** Get all DM conversations (list of messages) */
  async getMessages(): Promise<Message[]> {
    const response = await apiClient.get<Message[]>(API_ENDPOINTS.MESSAGES.LIST);
    return response.data;
  },

  /** Get the full chat thread between current user and another user */
  async getThread(userId: string): Promise<Message[]> {
    const response = await apiClient.get<Message[]>(
      API_ENDPOINTS.MESSAGES.THREAD,
      { params: { user_id: userId } }
    );
    return response.data;
  },

  /** Send a direct message */
  async sendMessage(data: SendMessageRequest): Promise<Message> {
    const response = await apiClient.post<Message>(API_ENDPOINTS.MESSAGES.LIST, data);
    return response.data;
  },

  /** Delete a message (sender only) */
  async deleteMessage(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.MESSAGES.DETAIL(id));
  },
};