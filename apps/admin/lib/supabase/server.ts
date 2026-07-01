import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Defensively clean URL and ANON KEY to prevent header/URL errors if comments or spaces are pasted
const cleanUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").split(/\s+/)[0].trim();
const cleanAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").split(/\s+/)[0].trim();

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    cleanUrl,
    cleanAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: any) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored when called from Server Component
          }
        },
      },
    }
  );
}
