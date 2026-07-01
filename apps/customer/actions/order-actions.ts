"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { customerOrderService, CreateOrderPayload, OrderCreationResult } from "@/services/order-service";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from "@/lib/data/mock-data";

export async function createOrderAction(payload: CreateOrderPayload): Promise<OrderCreationResult> {
  try {
    return await customerOrderService.createAtomicOrder(payload);
  } catch (err: any) {
    return {
      success: false,
      errorMessage: err.message || "Server action failed during order creation.",
    };
  }
}

export async function fetchMenuProductsAction() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("products").select("*, food_options(*)").order("created_at", { ascending: false });
    if (error) throw error;

    if (!data || data.length === 0) {
      const serviceClient = await createServiceRoleClient();
      const catRows = INITIAL_CATEGORIES.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        image_url: c.image,
      }));
      await serviceClient.from("categories").upsert(catRows, { onConflict: "id" });

      const prodRows = INITIAL_PRODUCTS.map((p) => ({
        id: p.id,
        category_id: p.categoryId,
        name: p.name,
        description: p.description,
        price: p.price,
        image_url: p.image,
        preparation_time: p.prepTime,
        available: p.available,
        featured: p.featured,
      }));
      await serviceClient.from("products").upsert(prodRows, { onConflict: "id" });

      const { data: seeded } = await supabase.from("products").select("*, food_options(*)").order("created_at", { ascending: false });
      return { success: true, data: seeded || [] };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, errorMessage: err.message, data: null };
  }
}

export async function fetchCategoriesAction() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true });
    if (error) throw error;

    if (!data || data.length === 0) {
      const serviceClient = await createServiceRoleClient();
      const catRows = INITIAL_CATEGORIES.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        image_url: c.image,
      }));
      await serviceClient.from("categories").upsert(catRows, { onConflict: "id" });
      const { data: seededCats } = await supabase.from("categories").select("*").order("name", { ascending: true });
      return { success: true, data: seededCats || [] };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, errorMessage: err.message, data: null };
  }
}

export async function fetchCustomerOrdersAction(userId: string) {
  try {
    const isGuest = !userId || userId.startsWith("cust_guest");
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (isGuest || !uuidRegex.test(userId)) {
      return { success: true, data: [] };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*), payments(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, errorMessage: err.message, data: null };
  }
}
