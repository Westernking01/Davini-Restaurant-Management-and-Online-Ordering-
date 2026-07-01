import { PaymentProvider, PaymentInitializationResult, PaymentVerificationResult, PaymentRefundResult } from "./payment-provider";

export class PaystackPaymentProvider implements PaymentProvider {
  private getSecretKey(): string {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new Error("SECURITY_ERROR: PAYSTACK_SECRET_KEY is not defined on the server environment.");
    }
    return secretKey;
  }

  async initializeTransaction(
    amount: number,
    email: string,
    reference: string,
    callbackUrl?: string
  ): Promise<PaymentInitializationResult> {
    try {
      const secretKey = this.getSecretKey();
      // Amount must convert: NGN to kobo (Example: ₦5000 = 500000 kobo)
      const amountInKobo = Math.round(amount * 100);

      const payload: Record<string, any> = {
        email: email || "customer@davinisfoodbank.com",
        amount: amountInKobo,
        reference,
      };

      if (callbackUrl) {
        payload.callback_url = callbackUrl;
      } else if (process.env.NEXT_PUBLIC_CUSTOMER_URL) {
        payload.callback_url = `${process.env.NEXT_PUBLIC_CUSTOMER_URL}/payment/callback`;
      }

      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok || !resData.status) {
        return {
          success: false,
          transactionReference: reference,
          errorMessage: resData.message || "Failed to initialize transaction with Paystack.",
        };
      }

      return {
        success: true,
        transactionReference: resData.data?.reference || reference,
        authorizationUrl: resData.data?.authorization_url,
      };
    } catch (err: any) {
      return {
        success: false,
        transactionReference: reference,
        errorMessage: err.message || "Network error while calling Paystack API.",
      };
    }
  }

  async verifyTransaction(reference: string): Promise<PaymentVerificationResult> {
    try {
      const secretKey = this.getSecretKey();

      const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });

      const resData = await response.json();

      if (!response.ok || !resData.status || !resData.data) {
        return {
          success: false,
          transactionReference: reference,
          amount: 0,
          status: "FAILED",
          errorMessage: resData.message || "Failed to verify transaction with Paystack.",
        };
      }

      const paystackStatus = resData.data.status;
      const amountInNgn = (resData.data.amount || 0) / 100;

      let status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED" = "FAILED";
      if (paystackStatus === "success") {
        status = "SUCCESS";
      } else if (paystackStatus === "pending" || paystackStatus === "ongoing" || paystackStatus === "queued") {
        status = "PENDING";
      } else if (paystackStatus === "reversed" || paystackStatus === "refunded") {
        status = "REFUNDED";
      } else {
        status = "FAILED";
      }

      return {
        success: status === "SUCCESS",
        transactionReference: resData.data.reference || reference,
        amount: amountInNgn,
        status,
      };
    } catch (err: any) {
      return {
        success: false,
        transactionReference: reference,
        amount: 0,
        status: "FAILED",
        errorMessage: err.message || "Network error while verifying Paystack transaction.",
      };
    }
  }

  async refundTransaction(reference: string, amount?: number): Promise<PaymentRefundResult> {
    try {
      const secretKey = this.getSecretKey();
      const payload: Record<string, any> = {
        transaction: reference,
      };
      if (amount && amount > 0) {
        payload.amount = Math.round(amount * 100);
      }

      const response = await fetch("https://api.paystack.co/refund", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok || !resData.status) {
        return {
          success: false,
          errorMessage: resData.message || "Failed to initiate refund with Paystack.",
        };
      }

      return {
        success: true,
        refundReference: resData.data?.reference || `REFUND_${Date.now()}`,
      };
    } catch (err: any) {
      return {
        success: false,
        errorMessage: err.message || "Network error during Paystack refund processing.",
      };
    }
  }

  async initializePayment(
    amount: number,
    email: string,
    orderId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentInitializationResult> {
    const reference = metadata?.reference || `PYS_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const callbackUrl = metadata?.callbackUrl;
    return this.initializeTransaction(amount, email, reference, callbackUrl);
  }

  async verifyPayment(reference: string): Promise<PaymentVerificationResult> {
    return this.verifyTransaction(reference);
  }
}

export const paystackProvider = new PaystackPaymentProvider();
