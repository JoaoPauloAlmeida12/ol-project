import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { modules, type ModuleSlug } from "../clinic/modules";
import { checkAccess, type Access } from "./access";
import { getSupabase } from "./supabase";
export function ProtectedModule({ module }: { module: ModuleSlug }) {
  const info = modules.find((m) => m.slug === module)!;
  const [access, setAccess] = useState<Access | "loading">("loading");
  useEffect(() => {
    const client = getSupabase();
    let sequence = 0;
    let active = true;
    const refresh = () => {
      const current = ++sequence;
      setAccess("loading");
      void checkAccess(client, module).then((result) => {
        if (active && current === sequence) setAccess(result);
      });
    };
    refresh();
    const subscription = client?.auth.onAuthStateChange(() => {
      queueMicrotask(refresh);
    });
    window.addEventListener("focus", refresh);
    return () => {
      active = false;
      subscription?.data.subscription.unsubscribe();
      window.removeEventListener("focus", refresh);
    };
  }, [module]);
  const messages = {
    loading: ["Verificando acesso", "Aguarde a validação da sua sessão e das permissões."],
    configuration: [
      "Configuração necessária",
      "O Supabase ainda não está configurado. Este módulo permanece bloqueado.",
    ],
    anonymous: [
      "Entre para continuar",
      "Sua sessão precisa ser validada para acessar este módulo.",
    ],
    denied: [
      "Acesso não autorizado",
      "Sua conta não tem permissão para este módulo. Solicite acesso ao administrador.",
    ],
    error: [
      "Não foi possível validar o acesso",
      "A autorização está indisponível ou ainda não foi configurada. O acesso permanece bloqueado.",
    ],
    allowed: [
      "Módulo em preparação",
      "Acesso validado. As operações deste módulo serão implementadas após a configuração e validação das políticas de dados pelo Lovable.",
    ],
  };
  return (
    <>
      <p className="eyebrow">ÁREA DA CLÍNICA</p>
      <h1>{info.title}</h1>
      <p className="page-description">{info.description}</p>
      <section className="access-card" aria-live="polite" aria-busy={access === "loading"}>
        <span className="access-icon">
          <LockKeyhole size={28} />
        </span>
        <h2>{messages[access][0]}</h2>
        <p>{messages[access][1]}</p>
        {access === "anonymous" && (
          <Link className="primary-button" to="/login">
            Entrar na conta
          </Link>
        )}
        {access === "error" && (
          <button className="secondary-button" onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        )}
        <Link className="text-link" to="/">
          Voltar à visão geral
        </Link>
      </section>
    </>
  );
}
