export interface PaymentInitializationResult {
  success: boolean;
  transactionReference: string;
  authorizationUrl?: string;
  errorMessage?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  transactionReference: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  errorMessage?: string;
}

export interface PaymentRefundResult {
  success: boolean;
  refundReference?: string;
  errorMessage?: string;
}

export interface PaymentProvider {
  initializePayment(
    amount: number,
    email: string,
    orderId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentInitializationResult>;

  verifyPayment(reference: string): Promise<PaymentVerificationResult>;

  initializeTransaction(
    amount: number,
    email: string,
    reference: string,
    callbackUrl?: string
  ): Promise<PaymentInitializationResult>;

  verifyTransaction(reference: string): Promise<PaymentVerificationResult>;

  refundTransaction(reference: string, amount?: number): Promise<PaymentRefundResult>;
}
