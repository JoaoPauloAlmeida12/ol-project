import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ClinicShell } from "@/features/clinic/shell";
import { getSupabase } from "@/features/auth/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar | Clínica" }] }),
  component: Login,
});
function Login() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const client = getSupabase();
    setReady(!!client);
    let active = true;
    void client?.auth.getUser().then(({ data }) => {
      if (active) setSignedIn(!!data.user);
    });
    const subscription = client?.auth.onAuthStateChange((_event, session) =>
      setSignedIn(!!session),
    );
    return () => {
      active = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabase();
    if (!client || busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setMessage("");
    try {
      const { error } = await client.auth.signInWithPassword({
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      setMessage(
        error
          ? "Não foi possível entrar. Verifique suas credenciais e tente novamente."
          : "Sessão iniciada. Acesse um módulo no menu para validar suas permissões.",
      );
    } catch {
      setMessage("Serviço indisponível. Tente novamente mais tarde.");
    } finally {
      setBusy(false);
    }
  }
  async function signOut() {
    const client = getSupabase();
    if (!client) return;
    setBusy(true);
    try {
      const { error } = await client.auth.signOut();
      setMessage(
        error ? "Não foi possível encerrar a sessão. Tente novamente." : "Sessão encerrada.",
      );
    } catch {
      setMessage("Não foi possível encerrar a sessão. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <ClinicShell>
      <section className="login-card">
        <p className="eyebrow">ACESSO À CLÍNICA</p>
        <h1>{signedIn ? "Sua conta" : "Boas-vindas de volta"}</h1>
        <p>Use a conta fornecida pelo administrador da clínica.</p>
        {!ready && (
          <div className="configuration-notice">
            Configuração pendente: conecte o Supabase pelo fluxo do Lovable para habilitar o acesso.
            Nenhuma sessão de demonstração será criada.
          </div>
        )}
        {signedIn ? (
          <button className="primary-button" disabled={busy} onClick={signOut}>
            Sair da conta
          </button>
        ) : (
          <form onSubmit={submit}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              disabled={!ready || busy}
            />
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={!ready || busy}
            />
            <button className="primary-button" disabled={!ready || busy}>
              {busy ? "Validando…" : "Entrar"}
            </button>
          </form>
        )}
        <p role="status">{message}</p>
        <small>O acesso aos módulos depende das permissões concedidas à sua conta.</small>
      </section>
    </ClinicShell>
  );
}
