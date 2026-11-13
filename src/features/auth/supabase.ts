import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Only a publishable key is accepted. Never configure service_role or a secret key here.
export function validConfiguration(url: unknown, key: unknown): boolean {
  if (typeof url !== "string" || typeof key !== "string") return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      !parsed.username &&
      !parsed.password &&
      /^sb_publishable_[A-Za-z0-9_-]+$/.test(key)
    );
  } catch {
    return false;
  }
}
let client: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (typeof url !== "string" || typeof key !== "string" || !validConfiguration(url, key))
    return null;
  client ??= createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  });
  return client;
}
