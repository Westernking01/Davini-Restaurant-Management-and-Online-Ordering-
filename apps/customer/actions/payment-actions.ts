"use server";

import { supabaseAdmin } from "@/lib/supabase/service-role";
import { paystackProvider } from "@/services/payment/paystack-provider";

export interface VerifyPaymentResult {
  success: boolean;
  orderId?: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  errorMessage?: string;
}

export async function verifyPaymentAction(reference: string): Promise<VerifyPaymentResult> {
  try {
    if (!reference) {
      return { success: false, status: "FAILED", errorMessage: "No transaction reference provided." };
    }

    // Call Paystack Verify Transaction API
    const verificationResult = await paystackProvider.verifyTransaction(reference);

    const supabase = supabaseAdmin;

    // Find the corresponding payment record
    const { data: paymentRow, error: fetchError } = await supabase
      .from("payments")
      .select("id, order_id, status")
      .eq("transaction_reference", reference)
      .single();

    if (fetchError || !paymentRow) {
      return {
        success: false,
        status: "FAILED",
        errorMessage: `Payment record matching reference ${reference} not found in database.`,
      };
    }

    if (verificationResult.success && verificationResult.status === "SUCCESS") {
      // If successful: payments.status: SUCCESS, orders.status: CONFIRMED
      await supabase
        .from("payments")
        .update({
          status: "SUCCESS",
          paid_at: new Date().toISOString(),
        })
        .eq("id", paymentRow.id);

      await supabase
        .from("orders")
        .update({
          status: "CONFIRMED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", paymentRow.order_id);

      return {
        success: true,
        orderId: paymentRow.order_id,
        status: "SUCCESS",
      };
    } else {
      // If failed: payments.status: FAILED, order remains: PENDING
      await supabase
        .from("payments")
        .update({
          status: "FAILED",
        })
        .eq("id", paymentRow.id);

      return {
        success: false,
        orderId: paymentRow.order_id,
        status: "FAILED",
        errorMessage: verificationResult.errorMessage || "Payment verification failed or transaction abandoned.",
      };
    }
  } catch (err: any) {
    return {
      success: false,
      status: "FAILED",
      errorMessage: err.message || "An unexpected error occurred during payment verification.",
    };
  }
}
