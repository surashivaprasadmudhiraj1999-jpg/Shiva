// Browser Supabase client (integration-ready).
//
// This file is intentionally dependency-free until you run:
//   npm install @supabase/supabase-js @supabase/ssr
// then uncomment the implementation below. Keeping it stubbed lets the
// demo build without external packages while documenting the wiring.

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

export const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);

/*
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey);
}
*/

export function createClient(): never {
  throw new Error(
    "Supabase is not configured. Install @supabase/ssr, set NEXT_PUBLIC_SUPABASE_* env vars, and uncomment the implementation in lib/supabase/client.ts.",
  );
}
