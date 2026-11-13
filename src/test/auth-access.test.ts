import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { checkAccess } from "@/features/auth/access";
import { validConfiguration } from "@/features/auth/supabase";

function client(user: object | null, data: unknown = false, error: unknown = null) {
  const rpc = vi.fn().mockResolvedValue({ data, error });
  return { auth: { getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }) }, rpc };
}
const asClient = (value: ReturnType<typeof client>) => value as unknown as SupabaseClient;
describe("Fail-closed module authorization", () => {
  it("blocks absent configuration", async () => {
    expect(await checkAccess(null, "pacientes")).toBe("configuration");
  });
  it("does not call authorization without a verified user", async () => {
    const api = client(null, true);
    expect(await checkAccess(asClient(api), "pacientes")).toBe("anonymous");
    expect(api.rpc).not.toHaveBeenCalled();
  });
  it("rejects an invalid remote session", async () => {
    const api = client({ id: "synthetic" }, true);
    api.auth.getUser.mockResolvedValue({ data: { user: null }, error: { message: "expired" } });
    expect(await checkAccess(asClient(api), "agenda")).toBe("anonymous");
    expect(api.rpc).not.toHaveBeenCalled();
  });
  it.each([false, null, "true", 1, { allowed: true }])(
    "denies non-boolean authorization: %j",
    async (value) => {
      expect(await checkAccess(asClient(client({ id: "synthetic" }, value)), "financeiro")).toBe(
        "denied",
      );
    },
  );
  it("requires explicit server authorization for the requested module", async () => {
    const api = client({ id: "synthetic" }, true);
    expect(await checkAccess(asClient(api), "prontuarios")).toBe("allowed");
    expect(api.rpc).toHaveBeenCalledWith("can_access_module", { requested_module: "prontuarios" });
  });
  it("blocks missing RPC and backend failures", async () => {
    expect(
      await checkAccess(
        asClient(client({ id: "synthetic" }, true, { code: "PGRST202" })),
        "agenda",
      ),
    ).toBe("error");
    const api = client({ id: "synthetic" });
    api.rpc.mockRejectedValue(new Error("network"));
    expect(await checkAccess(asClient(api), "agenda")).toBe("error");
  });
});
describe("Public Supabase configuration", () => {
  it("accepts HTTPS and publishable keys", () => {
    expect(validConfiguration("https://example.supabase.co", "sb_publishable_test")).toBe(true);
  });
  it.each([undefined, "", "sb_secret_test", "eyJhbGciOiJIUzI1NiJ9.test.jwt"])(
    "rejects missing, secret or legacy keys: %s",
    (key) => {
      expect(validConfiguration("https://example.supabase.co", key)).toBe(false);
    },
  );
  it.each(["http://example.supabase.co", "invalid", "https://user:pass@example.com"])(
    "rejects unsafe URL: %s",
    (url) => {
      expect(validConfiguration(url, "sb_publishable_test")).toBe(false);
    },
  );
});
