import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProtectedModule } from "@/features/auth/protected-module";
import { checkAccess } from "@/features/auth/access";
import { getSupabase } from "@/features/auth/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

vi.mock("@/features/auth/access", () => ({ checkAccess: vi.fn() }));
vi.mock("@/features/auth/supabase", () => ({ getSupabase: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getSupabase).mockReturnValue(null);
});
describe("Protected module UI", () => {
  it("blocks direct access while Supabase is unconfigured", async () => {
    vi.mocked(checkAccess).mockResolvedValue("configuration");
    render(<ProtectedModule module="pacientes" />);
    expect(await screen.findByText("Configuração necessária")).toBeInTheDocument();
    expect(screen.queryByText("Módulo em preparação")).not.toBeInTheDocument();
  });
  it("offers login for an anonymous visitor", async () => {
    vi.mocked(checkAccess).mockResolvedValue("anonymous");
    render(<ProtectedModule module="agenda" />);
    expect(await screen.findByText("Entre para continuar")).toBeInTheDocument();
  });
  it("discards late authorization results after changing module", async () => {
    let finish!: (value: "allowed") => void;
    vi.mocked(checkAccess)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finish = resolve;
          }),
      )
      .mockResolvedValue("denied");
    const view = render(<ProtectedModule key="pacientes" module="pacientes" />);
    view.rerender(<ProtectedModule key="financeiro" module="financeiro" />);
    expect(await screen.findByText("Acesso não autorizado")).toBeInTheDocument();
    await act(async () => {
      finish("allowed");
    });
    expect(screen.queryByText("Módulo em preparação")).not.toBeInTheDocument();
  });
  it("rechecks access after authentication changes and unsubscribes", async () => {
    let changed!: () => void;
    const unsubscribe = vi.fn();
    vi.mocked(getSupabase).mockReturnValue({
      auth: {
        onAuthStateChange: (callback: () => void) => {
          changed = callback;
          return { data: { subscription: { unsubscribe } } };
        },
      },
    } as unknown as SupabaseClient);
    vi.mocked(checkAccess).mockResolvedValueOnce("allowed").mockResolvedValue("anonymous");
    const view = render(<ProtectedModule module="documentos" />);
    expect(await screen.findByText("Módulo em preparação")).toBeInTheDocument();
    await act(async () => changed());
    await waitFor(() => expect(screen.getByText("Entre para continuar")).toBeInTheDocument());
    view.unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
