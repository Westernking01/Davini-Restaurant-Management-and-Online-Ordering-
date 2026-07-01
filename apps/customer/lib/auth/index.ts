import { createClient } from "../supabase/client";
import { syncUserProfileAction } from "@/actions/auth-actions";

export async function signUpCustomer(email: string, password: string, fullName: string, phone?: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone || null,
        role: "CUSTOMER",
      },
    },
  });
  if (data?.user) {
    try {
      await syncUserProfileAction(data.user.id, email, fullName, phone);
    } catch (e) {
      console.error("Failed to sync profile during signup:", e);
    }
  }
  return { data, error };
}

export async function loginCustomer(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function logoutCustomer() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function forgotPasswordCustomer(email: string) {
  const supabase = createClient();
  // Ensure strict redirect to customer application reset password page
  const resetBaseUrl = process.env.NEXT_PUBLIC_CUSTOMER_URL || window.location.origin;
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${resetBaseUrl}/reset-password`,
  });
  return { data, error };
}

export async function resetPasswordCustomer(newPassword: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
}
