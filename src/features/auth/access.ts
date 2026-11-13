import type { SupabaseClient } from "@supabase/supabase-js";
import type { ModuleSlug } from "../clinic/modules";

export type Access = "configuration" | "anonymous" | "denied" | "allowed" | "error";
// UX guard only. The database MUST independently enforce tenant isolation and RLS.
export async function checkAccess(
  client: SupabaseClient | null,
  module: ModuleSlug,
): Promise<Access> {
  if (!client) return "configuration";
  try {
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (error || !user) return "anonymous";
    const result = await client.rpc("can_access_module", { requested_module: module });
    if (result.error) return "error";
    return result.data === true ? "allowed" : "denied";
  } catch {
    return "error";
  }
}
