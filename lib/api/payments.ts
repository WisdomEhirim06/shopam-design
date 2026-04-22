import apiClient, { API_ENDPOINTS } from './config';
import type {
  Payment,
  CheckoutInitRequest,
  CheckoutInitResponse,
  DirectCardChargeRequest,
  BankTransferInitRequest,
  OTPAuthorizeRequest,
} from './types';

export const paymentsService = {
  /**
   * Step 6a: Initialize a Monnify checkout for an order.
   * Returns a checkout_url to open in browser/WebView, plus a transaction_reference
   * needed for direct card charge.
   */
  async initCheckout(data: CheckoutInitRequest): Promise<CheckoutInitResponse> {
    const response = await apiClient.post<CheckoutInitResponse>(
      API_ENDPOINTS.PAYMENTS.INIT,
      data
    );
    return response.data;
  },

  /**
   * Step 6b (card): Charge an ATM card directly — collects card details in-app.
   * Call initCheckout first to get transaction_reference.
   * Response may be: success, OTP_REQUIRED, or BANK_AUTHORIZATION_REQUIRED.
   */
  async directCharge(data: DirectCardChargeRequest): Promise<Record<string, unknown>> {
    const response = await apiClient.post<Record<string, unknown>>(
      API_ENDPOINTS.PAYMENTS.DIRECT_CHARGE,
      data
    );
    return response.data;
  },

  /**
   * Step 6b (bank): Generate a dynamic bank account number for transfer payment.
   * Show the returned account number to the customer.
   */
  async bankTransfer(data: BankTransferInitRequest): Promise<Record<string, unknown>> {
    const response = await apiClient.post<Record<string, unknown>>(
      API_ENDPOINTS.PAYMENTS.BANK_TRANSFER,
      data
    );
    return response.data;
  },

  /**
   * Submit OTP when directCharge returns OTP_REQUIRED.
   */
  async authorizeOTP(data: OTPAuthorizeRequest): Promise<Record<string, unknown>> {
    const response = await apiClient.post<Record<string, unknown>>(
      API_ENDPOINTS.PAYMENTS.AUTHORIZE_OTP,
      data
    );
    return response.data;
  },

  /**
   * Get the authenticated user's payment history.
   */
  async getHistory(): Promise<Payment[]> {
    const response = await apiClient.get<Payment[]>(API_ENDPOINTS.PAYMENTS.HISTORY);
    return response.data;
  },

  /**
   * Get pending (unpaid) payments for the user.
   */
  async getPending(): Promise<Payment[]> {
    const response = await apiClient.get<Payment[]>(API_ENDPOINTS.PAYMENTS.PENDING);
    return response.data;
  },

  /**
   * Check the current status of a transaction by its tx_ref.
   */
  async getStatus(txRef: string): Promise<Record<string, unknown>> {
    const response = await apiClient.get<Record<string, unknown>>(
      API_ENDPOINTS.PAYMENTS.STATUS(txRef)
    );
    return response.data;
  },

  /**
   * Get full detail of a payment by its tx_ref.
   */
  async getDetail(txRef: string): Promise<Payment> {
    const response = await apiClient.get<Payment>(
      API_ENDPOINTS.PAYMENTS.DETAIL(txRef)
    );
    return response.data;
  },
};
