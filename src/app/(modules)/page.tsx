import Link from "next/link";
import type { Metadata } from "next";

import { MODULES } from "@/lib/modules";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "usecheck",
};

export default function ModuleSelectionPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Selecione um módulo</h1>
      <p className="mt-1 text-sm text-muted-foreground">Organize. Acompanhe. Conclua.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
        {MODULES.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.key} href={module.href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-brand-green-dark">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="mt-3">{module.label}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
