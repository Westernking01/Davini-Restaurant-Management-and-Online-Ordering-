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
