// Server-side Supabase client (integration-ready).
//
// SECURITY: the service-role key is read ONLY here, in server code. Never import
// this module from a "use client" component. Install and uncomment when wiring:
//   npm install @supabase/supabase-js @supabase/ssr

export const serverSupabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
};

export const isServerSupabaseConfigured = Boolean(serverSupabaseConfig.url && serverSupabaseConfig.serviceRoleKey);

/*
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createServerSupabase() {
  const cookieStore = cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set: () => {},
      remove: () => {},
    },
  });
}

// Privileged admin client — bypasses RLS, server only.
import { createClient } from "@supabase/supabase-js";
export function createAdminSupabase() {
  return createClient(serverSupabaseConfig.url, serverSupabaseConfig.serviceRoleKey, {
    auth: { persistSession: false },
  });
}
*/
