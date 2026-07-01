import { createServiceRoleClient } from "@/lib/supabase/service-role";

export interface RefundResult {
  success: boolean;
  refundReference?: string;
  errorMessage?: string;
}

export class RefundService {
  async processRefund(paymentId: string, amount: number, reason: string): Promise<RefundResult> {
    try {
      const supabase = createServiceRoleClient();

      // 1. Fetch original payment record
      const { data: payment, error: fetchError } = await supabase
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .single();

      if (fetchError || !payment) {
        return {
          success: false,
          errorMessage: `Payment record not found: ${fetchError?.message || paymentId}`,
        };
      }

      if (payment.status !== "SUCCESS" && payment.status !== "Completed") {
        return {
          success: false,
          errorMessage: `Cannot process refund for payment with status: ${payment.status}`,
        };
      }

      // 2. Generate refund reference token
      const refundRef = `REFUND_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // 3. Update payment record to REFUNDED
      const { error: updateError } = await supabase
        .from("payments")
        .update({ status: "REFUNDED" })
        .eq("id", paymentId);

      if (updateError) {
        return {
          success: false,
          errorMessage: `Failed to update payment status: ${updateError.message}`,
        };
      }

      // 4. Log audit event
      await supabase.from("audit_logs").insert({
        user_id: payment.user_id || "SYSTEM_ADMIN",
        action: `PROCESSED_REFUND_${amount}_NGN`,
        table_name: "payments",
        record_id: paymentId,
      });

      return {
        success: true,
        refundReference: refundRef,
      };
    } catch (err: any) {
      return {
        success: false,
        errorMessage: err.message || "An unexpected error occurred during refund processing.",
      };
    }
  }
}

export const refundService = new RefundService();
