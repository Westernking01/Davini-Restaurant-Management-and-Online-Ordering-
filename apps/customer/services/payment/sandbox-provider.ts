import { PaymentProvider, PaymentInitializationResult, PaymentVerificationResult, PaymentRefundResult } from "./payment-provider";

export class SandboxPaymentProvider implements PaymentProvider {
  async initializePayment(
    amount: number,
    email: string,
    orderId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentInitializationResult> {
    const reference = `SANDBOX_TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return {
      success: true,
      transactionReference: reference,
      authorizationUrl: `https://sandbox.davinisfoodbank.com/pay/${reference}`,
    };
  }

  async verifyPayment(reference: string): Promise<PaymentVerificationResult> {
    const isSandbox = reference.startsWith("SANDBOX_TXN_") || reference.startsWith("ORD-") || reference.startsWith("TXN-");
    if (isSandbox) {
      return {
        success: true,
        transactionReference: reference,
        amount: 0,
        status: "SUCCESS",
      };
    }
    return {
      success: false,
      transactionReference: reference,
      amount: 0,
      status: "FAILED",
      errorMessage: "Invalid sandbox transaction reference token.",
    };
  }

  async initializeTransaction(
    amount: number,
    email: string,
    reference: string,
    callbackUrl?: string
  ): Promise<PaymentInitializationResult> {
    return {
      success: true,
      transactionReference: reference,
      authorizationUrl: callbackUrl ? `${callbackUrl}?reference=${reference}` : `https://sandbox.davinisfoodbank.com/pay/${reference}`,
    };
  }

  async verifyTransaction(reference: string): Promise<PaymentVerificationResult> {
    return this.verifyPayment(reference);
  }

  async refundTransaction(reference: string, amount?: number): Promise<PaymentRefundResult> {
    return {
      success: true,
      refundReference: `SANDBOX_REFUND_${Date.now()}`,
    };
  }
}

export const paymentService = new SandboxPaymentProvider();
