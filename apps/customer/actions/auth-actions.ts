"use server";

import { supabaseAdmin } from "@/lib/supabase/service-role";

export async function syncUserProfileAction(userId: string, email: string, name: string, phone?: string) {
  try {
    const supabase = supabaseAdmin;

    // 1. Check if public.users already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (!existingUser) {
      const { error: insertError } = await supabase.from("users").insert({
        id: userId,
        name: name || email.split("@")[0] || "Customer",
        email: email,
        phone: phone || null,
        role: "CUSTOMER",
      });
      if (insertError) {
        console.error("Error creating public.users record:", insertError.message);
        return { success: false, error: insertError.message };
      }
    }

    // 2. Check if customer_profiles already exists
    const { data: existingProfile } = await supabase
      .from("customer_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (!existingProfile) {
      await supabase.from("customer_profiles").upsert({
        user_id: userId,
        loyalty_points: 0,
      }, { onConflict: "user_id" });
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error syncing user profile:", err.message);
    return { success: false, error: err.message };
  }
}

export async function fetchAccountDashboardDataAction(userId: string, authEmail?: string, authName?: string, authPhone?: string) {
  try {
    const supabase = supabaseAdmin;

    // Ensure user profile is synchronized
    if (authEmail) {
      await syncUserProfileAction(userId, authEmail, authName || authEmail.split("@")[0], authPhone);
    }

    // Fetch user row
    const { data: userRow } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    // Fetch profile row
    const { data: profileRow } = await supabase
      .from("customer_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    // Fetch orders
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*, order_items(*), payments(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const ordersList = ordersData || [];
    const totalOrders = ordersList.length;
    const totalSpent = ordersList
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

    return {
      success: true,
      data: {
        profile: {
          id: userId,
          name: userRow?.name || authName || authEmail?.split("@")[0] || "VIP Guest",
          email: userRow?.email || authEmail || "",
          phone: userRow?.phone || authPhone || "",
          address: profileRow?.address || "",
          loyaltyPoints: profileRow?.loyalty_points ?? (totalOrders * 50),
          memberSince: userRow?.created_at ? new Date(userRow.created_at).toLocaleDateString("en-NG", { month: "short", year: "numeric" }) : "Recent",
        },
        orders: ordersList,
        summary: {
          totalOrders,
          totalSpent,
        },
      },
    };
  } catch (err: any) {
    console.error("Error fetching dashboard data:", err.message);
    return { success: false, error: err.message };
  }
}

export async function updateAccountProfileAction(userId: string, data: { name: string; phone?: string; address?: string }) {
  try {
    const supabase = supabaseAdmin;

    const { error: userErr } = await supabase
      .from("users")
      .update({
        name: data.name,
        phone: data.phone || null,
      })
      .eq("id", userId);

    if (userErr) throw userErr;

    const { error: profErr } = await supabase
      .from("customer_profiles")
      .upsert({
        user_id: userId,
        address: data.address || null,
      }, { onConflict: "user_id" });

    if (profErr) throw profErr;

    return { success: true };
  } catch (err: any) {
    console.error("Error updating profile:", err.message);
    return { success: false, error: err.message };
  }
}
