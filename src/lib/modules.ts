import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Building2,
  ClipboardCheck,
  ClipboardList,
  FileStack,
  ScrollText,
  Settings2,
  Users2,
} from "lucide-react";

/**
 * Single source of truth for the app's modules and their routes. Read by the
 * module-selection home page, the admin tile grid, the Sidebar (module-scoped
 * nav) and the Topbar (module label) so all four stay in sync.
 *
 * "admin" is config/setup — will eventually be gated behind an ADMIN role
 * once the backend JWT carries one. "pos-escrituracao" is the day-to-day
 * operational module every authenticated user gets, regardless of role.
 */

export type AppModule = "admin" | "pos-escrituracao";

export type ModuleInfo = {
  key: AppModule;
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export const MODULES: ModuleInfo[] = [
  {
    key: "admin",
    label: "Painel Administrativo",
    href: "/admin",
    description: "Usuários, organizações, empresas e cadastros fiscais.",
    icon: Settings2,
  },
  {
    key: "pos-escrituracao",
    label: "Pós Escrituração",
    href: "/closings",
    description: "Acompanhe e confira as entregas das obrigações fiscais do mês.",
    icon: ClipboardCheck,
  },
];

export type AppRoute = {
  href: string;
  label: string;
  description: string;
  module: AppModule;
  icon: LucideIcon;
};

/** Leaf pages inside each module — drives the module-scoped sidebar nav and the admin tile grid. */
export const APP_ROUTES: AppRoute[] = [
  {
    href: "/closings",
    label: "Fechamentos",
    description: "Checklist de obrigações fiscais por empresa e competência.",
    module: "pos-escrituracao",
    icon: ClipboardCheck,
  },
  {
    href: "/users",
    label: "Usuários",
    description: "Gerencie os usuários com acesso ao sistema.",
    module: "admin",
    icon: Users2,
  },
  {
    href: "/organizations",
    label: "Organizações",
    description: "Gerencie as organizações cadastradas.",
    module: "admin",
    icon: ClipboardList,
  },
  {
    href: "/companies",
    label: "Empresas",
    description: "Gerencie as empresas vinculadas às organizações.",
    module: "admin",
    icon: Building2,
  },
  {
    href: "/tax-obligations",
    label: "Obrigações Fiscais",
    description: "Catálogo global de obrigações fiscais.",
    module: "admin",
    icon: ScrollText,
  },
  {
    href: "/closing-templates",
    label: "Modelos de Fechamento",
    description: "Configure os modelos de fechamento das organizações.",
    module: "admin",
    icon: FileStack,
  },
];

export type ExternalTool = {
  key: string;
  label: string;
  description: string;
  href: string;
  module: AppModule;
  icon: LucideIcon;
};

/**
 * Links out to standalone services that aren't Next.js routes — always open
 * in a new tab. JobRunr is its own embedded server (org.jobrunr.dashboard.port
 * in the backend), separate from the main API.
 */
export const EXTERNAL_TOOLS: ExternalTool[] = [
  {
    key: "jobrunr",
    label: "Jobs em segundo plano",
    description: "Painel do JobRunr — acompanhe a execução do job mensal que gera os fechamentos.",
    href: process.env.NEXT_PUBLIC_JOBRUNR_URL ?? "http://localhost:8000",
    module: "admin",
    icon: Activity,
  },
];

export const MODULE_LABELS: Record<AppModule, string> = Object.fromEntries(
  MODULES.map((module) => [module.key, module.label])
) as Record<AppModule, string>;

const MODULE_PREFIXES: { prefix: string; module: AppModule }[] = [
  ...MODULES.map((module) => ({ prefix: module.href, module: module.key })),
  ...APP_ROUTES.map((route) => ({ prefix: route.href, module: route.module })),
];

export function moduleForPathname(pathname: string): AppModule | undefined {
  const match = MODULE_PREFIXES.find(
    (entry) => pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`)
  );
  return match?.module;
}
