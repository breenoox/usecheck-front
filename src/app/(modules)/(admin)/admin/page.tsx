import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import { APP_ROUTES, EXTERNAL_TOOLS } from "@/lib/modules";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Painel Administrativo",
};

const ADMIN_ROUTES = APP_ROUTES.filter((route) => route.module === "admin");
const ADMIN_TOOLS = EXTERNAL_TOOLS.filter((tool) => tool.module === "admin");

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Painel Administrativo</h1>
      <p className="mt-1 text-sm text-muted-foreground">Cadastros e configurações do sistema.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_ROUTES.map((route) => {
          const Icon = route.icon;
          return (
            <Link key={route.href} href={route.href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-brand-green-dark">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="mt-3">{route.label}</CardTitle>
                  <CardDescription>{route.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
        {ADMIN_TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <a key={tool.key} href={tool.href} target="_blank" rel="noopener noreferrer">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                      <Icon className="size-5" />
                    </div>
                    <ExternalLink className="size-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-3">{tool.label}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}
