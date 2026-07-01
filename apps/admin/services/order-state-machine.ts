import { createServiceRoleClient } from "@/lib/supabase/server";
import { UserRole } from "@/lib/context/admin-context";
import { inventoryService } from "./inventory-service";

export type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";

export interface StateTransitionResult {
  success: boolean;
  errorMessage?: string;
}

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY"],
  READY: ["OUT_FOR_DELIVERY", "DELIVERED"], // DELIVERED directly for PICKUP/DINE_IN
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export class OrderStateMachine {
  private verifyConfiguration() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("CONFIGURATION_ERROR: Supabase service credentials are missing or invalid.");
    }
  }

  async transitionOrderState(
    orderId: string,
    currentStatus: OrderStatus,
    targetStatus: OrderStatus,
    userId: string,
    userRole: UserRole
  ): Promise<StateTransitionResult> {
    this.verifyConfiguration();

    // 1. Validate State Machine Jump
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
      return {
        success: false,
        errorMessage: `INVALID_STATUS_JUMP: Cannot transition directly from ${currentStatus} to ${targetStatus}.`,
      };
    }

    // 2. Validate RBAC Permissions
    if (userRole === "DELIVERY") {
      const allowedForDelivery: OrderStatus[] = ["OUT_FOR_DELIVERY", "DELIVERED"];
      if (!allowedForDelivery.includes(targetStatus)) {
        return {
          success: false,
          errorMessage: `RBAC_DENIED: Role DELIVERY is restricted to dispatch tracking transitions (OUT_FOR_DELIVERY / DELIVERED).`,
        };
      }
    }

    try {
      const supabase = await createServiceRoleClient();

      // 3. Perform Database Update
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: targetStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (updateError) {
        return { success: false, errorMessage: `Database update failed: ${updateError.message}` };
      }

      // 4. Inventory Integration Rule: On CONFIRMED, deduct required inventory and log audit
      if (targetStatus === "CONFIRMED") {
        const { data: orderItems } = await supabase
          .from("order_items")
          .select("product_id, product_name, quantity")
          .eq("order_id", orderId);

        if (orderItems && orderItems.length > 0) {
          await inventoryService.deductStockForOrder(
            orderId,
            orderItems.map((i) => ({ productId: i.product_id, productName: i.product_name, quantity: i.quantity })),
            userId
          );
        }
      }

      // 5. Log System Audit Event
      await supabase.from("audit_logs").insert({
        user_id: userId,
        action: `TRANSITION_ORDER_STATUS_${currentStatus}_TO_${targetStatus}`,
        table_name: "orders",
        record_id: orderId,
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, errorMessage: err.message || "Error transitioning order status." };
    }
  }
}

export const orderStateMachine = new OrderStateMachine();
