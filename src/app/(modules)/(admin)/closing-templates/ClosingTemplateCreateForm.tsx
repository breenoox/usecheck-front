"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { createClosingTemplateAction, type ClosingTemplateFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError } from "@/components/data/FieldError";

const initialState: ClosingTemplateFormState = {};

export function ClosingTemplateCreateForm() {
  const [state, formAction, isPending] = useActionState(createClosingTemplateAction, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo modelo de fechamento</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="flex flex-col gap-5 pt-0">
          <div className="flex flex-col gap-2">
            <Label htmlFor="organizationId">Organização (ID)</Label>
            <Input id="organizationId" name="organizationId" type="number" min={1} required />
            <FieldError messages={state.fieldErrors?.organizationId} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome do modelo</Label>
            <Input id="name" name="name" placeholder="Fechamento Padrão PJ" required />
            <FieldError messages={state.fieldErrors?.name} />
          </div>
          {state.error ? (
            <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" variant="accent" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Criar modelo
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
