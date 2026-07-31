import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <Logo />
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-sm text-muted-foreground">Página não encontrada.</p>
      <Button asChild variant="accent">
        <Link href="/">Voltar ao painel</Link>
      </Button>
    </div>
  );
}
