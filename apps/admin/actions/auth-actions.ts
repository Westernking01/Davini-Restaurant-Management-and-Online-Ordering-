"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { AdminRole } from "@/lib/context/admin-context";

export async function adminLoginAction(email: string, password: string) {
  const tStart = performance.now();
  console.log(`\n[Admin Login Timing] === Starting authentication for ${email} ===`);

  try {
    const supabase = await createClient();

    // 1. Measure login request time (signInWithPassword)
    const tLoginStart = performance.now();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    const tLoginEnd = performance.now();
    const loginDuration = tLoginEnd - tLoginStart;
    console.log(`[Admin Login Timing] 1. login request time: ${loginDuration.toFixed(2)}ms`);

    if (authError || !authData.session || !authData.user) {
      return {
        success: false,
        errorMessage: authError?.message || "Invalid administrative credentials.",
      };
    }

    // 2. Measure session retrieval time (Session already returned in auth payload)
    const tSessionStart = performance.now();
    const session = authData.session;
    const user = authData.user;
    const tSessionEnd = performance.now();
    const sessionDuration = tSessionEnd - tSessionStart;
    console.log(`[Admin Login Timing] 2. session retrieval time: ${sessionDuration.toFixed(2)}ms`);

    // 3. Measure role verification time (One query only to public.users using authenticated user id)
    const tRoleStart = performance.now();
    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    const tRoleEnd = performance.now();
    const roleDuration = tRoleEnd - tRoleStart;
    console.log(`[Admin Login Timing] 3. role verification time: ${roleDuration.toFixed(2)}ms`);

    if (roleError || !userData) {
      return {
        success: false,
        errorMessage: "Access denied: User profile not found in system directory.",
      };
    }

    const allowedRoles: AdminRole[] = ["ADMIN", "MANAGER", "STAFF", "DELIVERY"];
    if (!allowedRoles.includes(userData.role as AdminRole)) {
      return {
        success: false,
        errorMessage: `Access denied: Role '${userData.role}' does not have operational dashboard access.`,
      };
    }

    // 4. Measure redirect time / cookie preparation
    const tRedirectStart = performance.now();
    const cookieStore = await cookies();
    
    cookieStore.set("admin-session", session.access_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    cookieStore.set("user-role", userData.role, {
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
    const tRedirectEnd = performance.now();
    const redirectDuration = tRedirectEnd - tRedirectStart;
    console.log(`[Admin Login Timing] 4. redirect preparation time: ${redirectDuration.toFixed(2)}ms`);

    const totalDuration = tRedirectEnd - tStart;
    console.log(`[Admin Login Timing] === Total Login Workflow: ${totalDuration.toFixed(2)}ms ===\n`);

    return {
      success: true,
      role: userData.role as AdminRole,
      timing: {
        login: loginDuration,
        session: sessionDuration,
        role: roleDuration,
        redirect: redirectDuration,
        total: totalDuration,
      },
    };
  } catch (err: any) {
    const totalFail = performance.now() - tStart;
    console.error(`[Admin Login Timing] Unexpected error after ${totalFail.toFixed(2)}ms:`, err);
    return {
      success: false,
      errorMessage: err.message || "An unexpected error occurred during login verification.",
    };
  }
}

export async function adminLogoutAction() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    const cookieStore = await cookies();
    cookieStore.delete("admin-session");
    cookieStore.delete("user-role");
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
