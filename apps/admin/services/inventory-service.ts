import { createServiceRoleClient } from "@/lib/supabase/server";
import { UserRole } from "@/lib/context/admin-context";

export interface InventoryMutationResult {
  success: boolean;
  errorMessage?: string;
}

export class InventoryService {
  private verifyConfiguration() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("CONFIGURATION_ERROR: Supabase service credentials are missing or invalid.");
    }
  }

  async restockInventory(
    inventoryId: string,
    quantityToAdd: number,
    note: string,
    userId: string,
    userRole: UserRole
  ): Promise<InventoryMutationResult> {
    this.verifyConfiguration();

    // RBAC Security Check
    if (userRole !== "ADMIN" && userRole !== "MANAGER") {
      return { success: false, errorMessage: `RBAC_DENIED: Role ${userRole} is not authorized to restock inventory.` };
    }

    if (quantityToAdd <= 0) {
      return { success: false, errorMessage: "Restock quantity must be positive." };
    }

    try {
      const supabase = await createServiceRoleClient();

      // 1. Fetch current inventory level
      const { data: item, error: fetchError } = await supabase
        .from("inventory")
        .select("*")
        .eq("id", inventoryId)
        .single();

      if (fetchError || !item) {
        return { success: false, errorMessage: `Inventory item not found: ${fetchError?.message || inventoryId}` };
      }

      const newQty = item.quantity + quantityToAdd;
      const newStatus = newQty <= 0 ? "OUT_OF_STOCK" : newQty <= item.minimum_stock ? "LOW_STOCK" : "AVAILABLE";

      // 2. Update inventory record
      const { error: updateError } = await supabase
        .from("inventory")
        .update({ quantity: newQty, status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", inventoryId);

      if (updateError) {
        return { success: false, errorMessage: `Failed to update inventory quantity: ${updateError.message}` };
      }

      // 3. Create mandatory audit log in inventory_transactions
      const { error: txnError } = await supabase.from("inventory_transactions").insert({
        inventory_id: inventoryId,
        type: "ADD",
        quantity: quantityToAdd,
        note: note || `Restocked +${quantityToAdd} units by ${userRole}`,
      });

      if (txnError) {
        return { success: false, errorMessage: `Audit logging failed: ${txnError.message}` };
      }

      // 4. Log system audit log
      await supabase.from("audit_logs").insert({
        user_id: userId,
        action: `RESTOCK_INVENTORY_+${quantityToAdd}`,
        table_name: "inventory",
        record_id: inventoryId,
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, errorMessage: err.message || "Unexpected error during inventory restock." };
    }
  }

  async deductStockForOrder(
    orderId: string,
    items: Array<{ productId: string; productName: string; quantity: number }>,
    userId: string
  ): Promise<InventoryMutationResult> {
    this.verifyConfiguration();

    try {
      const supabase = await createServiceRoleClient();

      // For restaurant recipes, map sold product items to ingredients or deduct unit counts
      // Here we record transaction deductions against inventory items matching product name or linked recipe
      for (const item of items) {
        // Query inventory items linked or matching name
        const { data: invItems } = await supabase
          .from("inventory")
          .select("*")
          .ilike("name", `%${item.productName.split(" ")[0]}%`)
          .limit(1);

        if (invItems && invItems.length > 0) {
          const inv = invItems[0];
          const deductAmount = item.quantity;
          const newQty = Math.max(0, inv.quantity - deductAmount);
          const newStatus = newQty <= 0 ? "OUT_OF_STOCK" : newQty <= inv.minimum_stock ? "LOW_STOCK" : "AVAILABLE";

          await supabase
            .from("inventory")
            .update({ quantity: newQty, status: newStatus, updated_at: new Date().toISOString() })
            .eq("id", inv.id);

          await supabase.from("inventory_transactions").insert({
            inventory_id: inv.id,
            type: "REMOVE",
            quantity: deductAmount,
            note: `Order deduction for #${orderId} (${item.productName})`,
          });
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, errorMessage: err.message };
    }
  }
}

export const inventoryService = new InventoryService();
