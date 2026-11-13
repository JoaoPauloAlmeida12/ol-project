import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CalendarDays,
  Users,
  Wallet,
  ShieldCheck,
  Circle,
  CheckCircle2,
} from "lucide-react";
import { ClinicShell } from "@/features/clinic/shell";
import { modules } from "@/features/clinic/modules";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Visão geral | Clínica" }] }),
  component: Dashboard,
});
function Dashboard() {
  return (
    <ClinicShell>
      <div className="page-heading">
        <div>
          <p className="eyebrow">VISÃO GERAL</p>
          <h1>
            Mais organização.
            <br className="mobile-break" /> Mais tempo para cuidar.
          </h1>
          <p>Acompanhe a implantação e prepare a rotina da sua clínica.</p>
        </div>
        <Link className="primary-button" to="/$module" params={{ module: "configuracoes" }}>
          Configurar clínica <ArrowUpRight size={17} />
        </Link>
      </div>
      <section className="welcome-banner">
        <div>
          <span className="light-label">SEU NOVO PONTO DE PARTIDA</span>
          <h2>
            A gestão da clínica,
            <br />
            em um só lugar.
          </h2>
          <p>
            Da primeira consulta à organização financeira.
            <br />
            Uma estrutura pensada para o seu dia a dia.
          </p>
          <Link to="/login" className="banner-link">
            Conectar minha conta <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="banner-art" aria-hidden="true">
          <div className="art-ring" />
          <ActivityMark />
        </div>
      </section>
      <section className="metric-grid" aria-label="Indicadores">
        <Metric icon={Users} title="Pacientes cadastrados" />
        <Metric icon={CalendarDays} title="Consultas do dia" />
        <Metric icon={Wallet} title="Recebimentos do mês" />
      </section>
      <div className="section-heading">
        <div>
          <h2>O que você precisa, por perto</h2>
          <p>Acesse os módulos da sua clínica.</p>
        </div>
        <span className="muted-label">6 módulos</span>
      </div>
      <section className="module-grid" aria-label="Módulos da clínica">
        {modules.map((m) => (
          <Link to="/$module" params={{ module: m.slug }} key={m.slug} className="module-card">
            <span className="module-icon">
              <m.icon size={23} />
            </span>
            <ArrowUpRight className="card-arrow" size={18} />
            <h3>{m.title}</h3>
            <p>{m.description}</p>
            <span className="module-status">Acesso restrito</span>
          </Link>
        ))}
      </section>
      <section className="setup-card">
        <div className="setup-intro">
          <ShieldCheck size={27} />
          <div>
            <h2>Prepare seu ambiente</h2>
            <p>Etapas necessárias antes de usar dados clínicos.</p>
          </div>
        </div>
        <ul>
          <li>
            <CheckCircle2 size={18} /> Interface e navegação <span>Concluído</span>
          </li>
          <li>
            <Circle size={18} /> Conectar Supabase e autenticação <span>Pendente</span>
          </li>
          <li>
            <Circle size={18} /> Configurar permissões e políticas RLS <span>Pendente</span>
          </li>
        </ul>
        <p className="setup-footnote">
          Esta visão geral é pública e não consulta dados clínicos. A ativação dos módulos depende
          da configuração e validação do ambiente.
        </p>
      </section>
    </ClinicShell>
  );
}
function Metric({ icon: Icon, title }: { icon: typeof Users; title: string }) {
  return (
    <article className="metric">
      <span className="metric-icon">
        <Icon size={20} />
      </span>
      <p>{title}</p>
      <strong aria-label="Indisponível">—</strong>
      <small>Aguardando integração de dados</small>
    </article>
  );
}
function ActivityMark() {
  return (
    <svg viewBox="0 0 160 100" fill="none">
      <path
        d="M5 55h37l16-30 26 58 21-48 14 20h36"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
