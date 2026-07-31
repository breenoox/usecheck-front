"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Não foi possível carregar os dados</h2>
          <p className="text-sm text-muted-foreground">
            {error.message || "Verifique se o servidor está disponível e tente novamente."}
          </p>
          <Button onClick={reset} variant="accent" className="mt-2">
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
