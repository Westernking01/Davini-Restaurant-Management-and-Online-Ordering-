import { createClient } from "@supabase/supabase-js";

/**
 * Server-side service role client for protected operational system tasks.
 * Uses ONLY @supabase/supabase-js createClient with SUPABASE_SERVICE_ROLE_KEY.
 * NEVER expose this to client components or browser environments.
 * Must NOT use cookies(), headers(), or createServerClient().
 */
export function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
