import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, LayoutDashboard, ArrowUpRight, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { modules } from "./modules";

export function ClinicShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="clinic-app">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <aside className="clinic-sidebar">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <Activity size={25} />
          </span>
          <span>
            Clínica<span className="brand-sub">GESTÃO INTEGRADA</span>
          </span>
        </Link>
        <p className="nav-label">ÁREA DE TRABALHO</p>
        <nav aria-label="Navegação principal">
          <Link
            to="/"
            className={pathname === "/" ? "nav-item active" : "nav-item"}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <LayoutDashboard size={19} />
            Visão geral
          </Link>
          {modules.map((m) => (
            <Link
              key={m.slug}
              to="/$module"
              params={{ module: m.slug }}
              className={pathname === `/${m.slug}` ? "nav-item active" : "nav-item"}
              aria-current={pathname === `/${m.slug}` ? "page" : undefined}
            >
              <m.icon size={19} />
              {m.title}
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <ShieldCheck size={22} />
          <strong>Uma base para cuidar melhor</strong>
          <p>Organize sua rotina com acesso controlado às informações.</p>
          <Link to="/login">
            Acessar conta <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="workspace">
          <span className="workspace-avatar">C</span>
          <span>
            Minha clínica<small>Implantação · Etapa 1</small>
          </span>
        </div>
      </aside>
      <div className="clinic-body">
        <header className="topbar">
          <span>Seu espaço de gestão</span>
          <span className="stage-badge">
            <span /> Estrutura inicial
          </span>
          <Link to="/login" className="account-link">
            Entrar <ArrowUpRight size={16} />
          </Link>
        </header>
        <main id="conteudo" tabIndex={-1}>
          {children}
        </main>
        <footer>
          Gestão clínica · Etapa 1 <span>Sem dados clínicos conectados</span>
        </footer>
      </div>
    </div>
  );
}
