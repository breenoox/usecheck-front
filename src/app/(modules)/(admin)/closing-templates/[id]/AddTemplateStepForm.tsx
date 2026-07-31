"use client";

import { useActionState } from "react";
import { Loader2, Plus } from "lucide-react";

import { addClosingTemplateStepAction, type AddTemplateStepFormState } from "../actions";
import type { TaxObligation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError } from "@/components/data/FieldError";

const initialState: AddTemplateStepFormState = {};

type AddTemplateStepFormProps = {
  templateId: number;
  taxObligations: TaxObligation[];
};

export function AddTemplateStepForm({ templateId, taxObligations }: AddTemplateStepFormProps) {
  const action = addClosingTemplateStepAction.bind(null, templateId);
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar etapa obrigatória</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid gap-5 pt-0 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="taxObligationId">Obrigação fiscal</Label>
            <Select name="taxObligationId">
              <SelectTrigger id="taxObligationId">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {taxObligations.map((obligation) => (
                  <SelectItem key={obligation.id} value={String(obligation.id)}>
                    {obligation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError messages={state.fieldErrors?.taxObligationId} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Input id="priority" name="priority" type="number" min={1} required />
            <FieldError messages={state.fieldErrors?.priority} />
          </div>
          {state.error ? (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive sm:col-span-2"
            >
              {state.error}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" variant="accent" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Adicionar etapa
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
