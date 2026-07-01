"use server";

import { supabaseAdmin } from "@/lib/supabase/service-role";
import { orderStateMachine, OrderStatus } from "@/services/order-state-machine";
import { inventoryService } from "@/services/inventory-service";
import { UserRole } from "@/lib/context/admin-context";

export async function updateOrderStatusAction(
  orderId: string,
  currentStatus: OrderStatus,
  targetStatus: OrderStatus,
  userId: string,
  userRole: UserRole
) {
  try {
    return await orderStateMachine.transitionOrderState(orderId, currentStatus, targetStatus, userId, userRole);
  } catch (err: any) {
    return { success: false, errorMessage: err.message || "Server action failed." };
  }
}

export async function restockInventoryAction(
  inventoryId: string,
  quantityToAdd: number,
  note: string,
  userId: string,
  userRole: UserRole
) {
  try {
    return await inventoryService.restockInventory(inventoryId, quantityToAdd, note, userId, userRole);
  } catch (err: any) {
    return { success: false, errorMessage: err.message || "Server action failed." };
  }
}

export async function fetchAdminDashboardDataAction() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("CONFIGURATION_ERROR: Supabase service role key or URL is missing.");
    }

    const supabase = supabaseAdmin;

    const [ordersRes, productsRes, inventoryRes, customersRes, paymentsRes] = await Promise.all([
      supabase.from("orders").select("*, order_items(*), payments(*)").order("created_at", { ascending: false }),
      supabase.from("products").select("*").order("name", { ascending: true }),
      supabase.from("inventory").select("*").order("name", { ascending: true }),
      supabase.from("customer_profiles").select("*, users(*)").order("created_at", { ascending: false }),
      supabase.from("payments").select("*").order("paid_at", { ascending: false }),
    ]);

    if (ordersRes.error) throw new Error(`Orders fetch failed: ${ordersRes.error.message}`);
    if (productsRes.error) throw new Error(`Products fetch failed: ${productsRes.error.message}`);
    if (inventoryRes.error) throw new Error(`Inventory fetch failed: ${inventoryRes.error.message}`);

    return {
      success: true,
      data: {
        orders: ordersRes.data || [],
        products: productsRes.data || [],
        inventory: inventoryRes.data || [],
        customers: customersRes.data || [],
        payments: paymentsRes.data || [],
      },
    };
  } catch (err: any) {
    return {
      success: false,
      errorMessage: err.message || "Failed to fetch dashboard intelligence data from Supabase.",
      data: null,
    };
  }
}

export async function toggleProductAvailabilityAction(productId: string, currentAvailable: boolean, userRole: UserRole) {
  if (userRole === "STAFF" || userRole === "DELIVERY") {
    return { success: false, errorMessage: "RBAC_DENIED: Your role cannot modify menu availability." };
  }
  try {
    const supabase = supabaseAdmin;
    const { error } = await supabase
      .from("products")
      .update({ available: !currentAvailable, updated_at: new Date().toISOString() })
      .eq("id", productId);

    if (error) return { success: false, errorMessage: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, errorMessage: err.message };
  }
}
