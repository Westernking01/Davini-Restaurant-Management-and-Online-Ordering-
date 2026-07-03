import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  console.log("[OAuth] Callback received at /auth/callback");

  if (!code) {
    console.error("[OAuth] No authentication code provided in callback parameters.");
    return NextResponse.redirect(new URL("/login?error=oauth", origin));
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[OAuth] Error exchanging code for session:", error.message);
      return NextResponse.redirect(new URL("/login?error=oauth", origin));
    }

    console.log("[OAuth] Code exchanged successfully");

    const user = data?.session?.user;
    if (user) {
      console.log(`[OAuth] Session created for user ${user.id}`);

      const userId = user.id;
      const userEmail = user.email || "";
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        userEmail.split("@")[0] ||
        "VIP Guest";
      const avatarUrl =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        null;
      const createdAt = user.created_at || new Date().toISOString();

      // Check if user profile already exists in standard profiles table
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (!existingProfile) {
        console.log("[OAuth] User profile not found, creating profile record...");
        const { error: profileInsertError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            email: userEmail,
            full_name: fullName,
            avatar_url: avatarUrl,
            created_at: createdAt,
          });

        if (profileInsertError) {
          console.error("[OAuth] Notice during profile insert:", profileInsertError.message);
        } else {
          console.log("[OAuth] Profile created successfully in profiles table.");
        }
      } else {
        console.log("[OAuth] Existing profile found. Preserving profile information.");
      }

      // Also ensure application-level public.users and customer_profiles records exist for dashboard
      const { data: existingUserRecord } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .single();

      if (!existingUserRecord) {
        await supabase.from("users").insert({
          id: userId,
          name: fullName,
          email: userEmail,
          role: "CUSTOMER",
          created_at: createdAt,
          updated_at: createdAt,
        });

        await supabase.from("customer_profiles").insert({
          user_id: userId,
          profile_image: avatarUrl,
          loyalty_points: 0,
          created_at: createdAt,
        });
      }
    }

    console.log("[OAuth] Redirect completed to target:", next);
    // Ensure we redirect cleanly using origin or request base
    const redirectUrl = next.startsWith("http") ? next : `${origin}${next.startsWith("/") ? next : `/${next}`}`;
    return NextResponse.redirect(redirectUrl);
  } catch (err: any) {
    console.error("[OAuth] Unexpected error handling OAuth callback:", err?.message || err);
    return NextResponse.redirect(new URL("/login?error=oauth", origin));
  }
}
