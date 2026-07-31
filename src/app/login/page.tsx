import type { Metadata } from "next";

import { Logo } from "@/components/brand/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Entrar | usecheck",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="relative hidden w-1/2 flex-col justify-between bg-brand-navy px-12 py-12 text-white lg:flex">
        <Logo monochrome tagline />
        <div className="max-w-sm">
          <h1 className="text-3xl font-semibold leading-snug">
            Gestão de fechamentos fiscais e checklists, sem esforço.
          </h1>
          <p className="mt-4 text-sm text-white/70">
            Acompanhe etapas, pendências e conclusões de cada empresa com clareza e
            organização.
          </p>
        </div>
        <p className="text-xs text-white/50">© {new Date().getFullYear()} usecheck</p>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo tagline />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Bem-vindo de volta</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Entre com suas credenciais para acessar o painel.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
