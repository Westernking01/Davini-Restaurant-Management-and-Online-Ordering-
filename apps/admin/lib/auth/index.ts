import { createClient } from "../supabase/client";

export async function loginAdmin(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function logoutAdmin() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function forgotPasswordAdmin(email: string) {
  const supabase = createClient();
  // Ensure strict redirect to admin application reset password page
  const resetBaseUrl = process.env.NEXT_PUBLIC_ADMIN_URL || window.location.origin;
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${resetBaseUrl}/reset-password`,
  });
  return { data, error };
}

export async function resetPasswordAdmin(newPassword: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
}

/**
 * Verify internal role authorization (ADMIN, MANAGER, STAFF, DELIVERY).
 * Note: There is intentionally NO public admin signup method.
 */
export async function verifyAdminRole(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return { role: null, error };
  }

  const allowedRoles = ["ADMIN", "MANAGER", "STAFF", "DELIVERY"];
  if (!allowedRoles.includes(data.role)) {
    return { role: null, error: new Error("Unauthorized role access.") };
  }

  return { role: data.role, error: null };
}
