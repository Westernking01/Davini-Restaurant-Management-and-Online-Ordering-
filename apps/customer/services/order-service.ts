import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { paystackProvider as paymentService } from "./payment/paystack-provider";

export interface CreateOrderPayload {
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  orderType: "DELIVERY" | "PICKUP" | "DINE_IN";
  deliveryAddress?: string;
  customerNote?: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    selectedOptions?: Record<string, any>;
  }>;
  paymentMethod: "CARD" | "BANK_TRANSFER" | "MOBILE_PAYMENT" | "CASH";
}

export interface OrderCreationResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  transactionReference?: string;
  authorizationUrl?: string;
  errorMessage?: string;
}

export class CustomerOrderService {
  private verifyConfiguration() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("CONFIGURATION_ERROR: Supabase credentials are missing. Please verify .env settings.");
    }
  }

  async createAtomicOrder(payload: CreateOrderPayload): Promise<OrderCreationResult> {
    this.verifyConfiguration();

    if (!payload.items || payload.items.length === 0) {
      return { success: false, errorMessage: "Cart is empty. Cannot create order." };
    }

    // Detect whether customer is authenticated or guest
    const isGuest = !payload.userId || payload.userId.startsWith("cust_guest");
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValidUuid = payload.userId && uuidRegex.test(payload.userId);

    const supabase = createServiceRoleClient();

    // Verify user exists in public.users to prevent foreign key violations
    let validUserIdToInsert: string | null = null;
    const targetUserId = (!isGuest && isValidUuid) ? payload.userId : null;

    if (targetUserId) {
      const { data: pubUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", targetUserId)
        .single();

      if (pubUser) {
        validUserIdToInsert = pubUser.id;
      } else {
        const email = payload.email || "customer@davinisfoodbank.com";
        const name = payload.customerName || email.split("@")[0] || "Customer";

        const { error: insertErr } = await supabase.from("users").insert({
          id: targetUserId,
          name: name,
          email: email,
          role: "CUSTOMER",
        });

        if (!insertErr) {
          validUserIdToInsert = targetUserId;
          await supabase.from("customer_profiles").upsert({
            user_id: targetUserId,
            loyalty_points: 0,
          }, { onConflict: "user_id" });
        } else {
          console.error("Failed to sync missing public.users row:", insertErr.message);
          validUserIdToInsert = null;
        }
      }
    }

    // 1. Calculate Totals
    const subtotal = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = payload.orderType === "DELIVERY" ? 1500 : 0;
    const tax = Math.round(subtotal * 0.075);
    const totalAmount = subtotal + deliveryFee + tax;
    const orderNumber = `DVB-${Date.now().toString().slice(-6)}`;
    const reference = `PYS_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    let createdOrderId: string | null = null;

    try {
      // 2. Insert Order Record (status: PENDING)
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: validUserIdToInsert,
          order_number: orderNumber,
          order_type: payload.orderType,
          status: "PENDING",
          subtotal,
          delivery_fee: deliveryFee,
          discount: 0,
          total_amount: totalAmount,
          delivery_address: payload.deliveryAddress || null,
          customer_note: payload.customerNote || null,
        })
        .select("id")
        .single();

      if (orderError || !orderData) {
        throw new Error(`Failed to insert order: ${orderError?.message || "Unknown DB error"}`);
      }

      createdOrderId = orderData.id;

      // 3. Validate product_id UUID format and Insert Immutable Order Items Snapshots
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      for (const item of payload.items) {
        if (!uuidRegex.test(item.productId)) {
          throw new Error(`Invalid product UUID format "${item.productId}" for item "${item.productName}". Please refresh your browser or clear old cart items.`);
        }
      }

      const orderItemsRows = payload.items.map((item) => ({
        order_id: createdOrderId,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        price: item.price,
        selected_options: item.selectedOptions || null,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItemsRows);

      if (itemsError) {
        throw new Error(`Failed to insert order items snapshots: ${itemsError.message}`);
      }

      // 4. Create payment record (status: PENDING)
      const { error: paymentError } = await supabase.from("payments").insert({
        order_id: createdOrderId,
        provider: payload.paymentMethod === "CASH" ? "CASH" : "PAYSTACK",
        payment_method: payload.paymentMethod,
        transaction_reference: reference,
        amount: totalAmount,
        status: "PENDING",
        paid_at: null,
      });

      if (paymentError) {
        throw new Error(`Failed to create payment record: ${paymentError.message}`);
      }

      // 5. Call Paystack Initialize Transaction API (only if CARD payment)
      let authorizationUrl: string | undefined = undefined;
      if (payload.paymentMethod !== "CASH") {
        const paymentInit = await paymentService.initializeTransaction(
          totalAmount,
          payload.email,
          reference
        );

        if (paymentInit.success && paymentInit.authorizationUrl) {
          authorizationUrl = paymentInit.authorizationUrl;
        } else {
          console.warn("Paystack transaction initialization fallback mode:", paymentInit.errorMessage);
        }
      }

      // 6. Clear Customer Cart (if exists in carts table for authenticated users)
      if (validUserIdToInsert) {
        const { data: userCart } = await supabase
          .from("carts")
          .select("id")
          .eq("user_id", validUserIdToInsert)
          .single();

        if (userCart) {
          await supabase.from("cart_items").delete().eq("cart_id", userCart.id);
        }
      }

      return {
        success: true,
        orderId: createdOrderId || undefined,
        orderNumber,
        transactionReference: reference,
        authorizationUrl,
      };
    } catch (err: any) {
      // ATOMIC ROLLBACK: If any insertion step failed, clean up created records
      if (createdOrderId) {
        await supabase.from("order_items").delete().eq("order_id", createdOrderId);
        await supabase.from("payments").delete().eq("order_id", createdOrderId);
        await supabase.from("orders").delete().eq("id", createdOrderId);
      }

      return {
        success: false,
        errorMessage: `Transaction rolled back due to error: ${err.message}`,
      };
    }
  }
}

export const customerOrderService = new CustomerOrderService();
