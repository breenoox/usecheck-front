"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, ClipboardCheck } from "lucide-react";

import {
  bindClosingTemplateAction,
  type ClosingTemplateBindingFormState,
} from "../actions";
import { currentHtmlMonth } from "@/lib/closingMonth";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FieldError } from "@/components/data/FieldError";

const initialState: ClosingTemplateBindingFormState = {};

type ClosingTemplateSectionProps = {
  companyId: number;
  closingTemplateId?: number;
};

export function ClosingTemplateSection({
  companyId,
  closingTemplateId,
}: ClosingTemplateSectionProps) {
  const action = bindClosingTemplateAction.bind(null, companyId);
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fechamento fiscal</CardTitle>
        <CardDescription>
          {closingTemplateId
            ? `Esta empresa segue o modelo de fechamento #${closingTemplateId}.`
            : "Esta empresa ainda não tem um modelo de fechamento vinculado."}
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="flex flex-col gap-2 pt-0 sm:max-w-xs">
          <Label htmlFor="closingTemplateId">ID do modelo de fechamento</Label>
          <Input
            id="closingTemplateId"
            name="closingTemplateId"
            type="number"
            min={1}
            defaultValue={closingTemplateId}
            required
          />
          <FieldError messages={state.fieldErrors?.closingTemplateId} />
          {state.error ? (
            <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-3">
          {closingTemplateId ? (
            <Link
              href={`/closings?companyId=${companyId}&month=${currentHtmlMonth()}`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <ClipboardCheck className="size-4" />
              Ver checklist do mês
            </Link>
          ) : (
            <span
              className={cn(buttonVariants({ variant: "outline" }), "pointer-events-none opacity-50")}
            >
              <ClipboardCheck className="size-4" />
              Ver checklist do mês
            </span>
          )}
          <Button type="submit" variant="accent" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Vincular modelo
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
