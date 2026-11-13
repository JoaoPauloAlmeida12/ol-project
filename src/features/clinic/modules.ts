import { CalendarDays, Users, ClipboardList, Files, Wallet, Settings } from "lucide-react";

export const modules = [
  {
    slug: "pacientes",
    title: "Pacientes",
    description: "Cadastro e acompanhamento de pacientes.",
    icon: Users,
  },
  {
    slug: "agenda",
    title: "Agenda",
    description: "Organização de consultas e disponibilidade.",
    icon: CalendarDays,
  },
  {
    slug: "prontuarios",
    title: "Prontuários",
    description: "Histórico clínico e evolução dos atendimentos.",
    icon: ClipboardList,
  },
  {
    slug: "documentos",
    title: "Documentos",
    description: "Documentos e arquivos da clínica.",
    icon: Files,
  },
  {
    slug: "financeiro",
    title: "Financeiro",
    description: "Controle de recebimentos e despesas.",
    icon: Wallet,
  },
  {
    slug: "configuracoes",
    title: "Configurações",
    description: "Equipe, permissões e preferências da clínica.",
    icon: Settings,
  },
] as const;
export type ModuleSlug = (typeof modules)[number]["slug"];
