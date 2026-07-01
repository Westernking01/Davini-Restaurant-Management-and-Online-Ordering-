import { createBrowserClient } from "@supabase/ssr";

// Defensively clean URL and ANON KEY to prevent header/URL errors if comments or spaces are pasted
const cleanUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").split(/\s+/)[0].trim();
const cleanAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").split(/\s+/)[0].trim();

export function createClient() {
  return createBrowserClient(
    cleanUrl,
    cleanAnonKey
  );
}
