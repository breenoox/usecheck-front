"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ExternalLink, LayoutGrid, type LucideIcon } from "lucide-react";

import { APP_ROUTES, EXTERNAL_TOOLS, MODULES, MODULE_LABELS, moduleForPathname } from "@/lib/modules";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const currentModule = moduleForPathname(pathname);
  const moduleInfo = MODULES.find((module) => module.key === currentModule);
  const moduleRoutes = currentModule
    ? APP_ROUTES.filter((route) => route.module === currentModule)
    : [];
  const moduleTools = currentModule
    ? EXTERNAL_TOOLS.filter((tool) => tool.module === currentModule)
    : [];
  // Only show a "back to this module's tile grid" link when the module has a
  // dedicated index screen distinct from its leaf pages (admin today).
  const showModuleHomeLink =
    moduleInfo && !moduleRoutes.some((route) => route.href === moduleInfo.href);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-brand-navy px-4 py-6 text-white lg:flex">
      <Link href="/" className="px-2">
        <Logo monochrome />
      </Link>

      {moduleInfo ? (
        <div className="mt-8 flex items-center gap-2 px-2">
          <Link
            href="/"
            aria-label="Voltar para seleção de módulos"
            className="flex size-7 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wide text-white/50">
            {MODULE_LABELS[moduleInfo.key]}
          </span>
        </div>
      ) : null}

      <nav className="mt-4 flex flex-1 flex-col gap-1">
        {showModuleHomeLink && moduleInfo ? (
          <NavLink
            href={moduleInfo.href}
            label="Painel"
            icon={LayoutGrid}
            active={pathname === moduleInfo.href}
          />
        ) : null}
        {moduleRoutes.map((route) => (
          <NavLink
            key={route.href}
            href={route.href}
            label={route.label}
            icon={route.icon}
            active={isActive(pathname, route.href)}
          />
        ))}
        {moduleTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <a
              key={tool.key}
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon className="size-4" />
              <span className="flex-1">{tool.label}</span>
              <ExternalLink className="size-3.5 text-white/40" />
            </a>
          );
        })}
      </nav>
      <p className="px-2 text-[11px] text-white/40">© {new Date().getFullYear()} usecheck</p>
    </aside>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active ? "bg-brand-green text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}
