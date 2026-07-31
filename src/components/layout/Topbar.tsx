"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { logoutAction } from "@/app/(modules)/actions";
import { MODULE_LABELS, moduleForPathname } from "@/lib/modules";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const pathname = usePathname();
  const currentModule = moduleForPathname(pathname);
  const label = currentModule ? MODULE_LABELS[currentModule] : "usecheck";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <form action={logoutAction}>
        <Button type="submit" variant="ghost" size="sm">
          <LogOut className="size-4" />
          Sair
        </Button>
      </form>
    </header>
  );
}
