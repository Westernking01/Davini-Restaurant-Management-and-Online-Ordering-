import { createClient } from "@supabase/supabase-js";

// Defensively clean the key in case multiple tokens or comments (# Application Application URLs) were pasted into the environment variable field
const cleanServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").split(/\s+/)[0].trim();

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  cleanServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

export function createServiceRoleClient() {
  return supabaseAdmin;
}
