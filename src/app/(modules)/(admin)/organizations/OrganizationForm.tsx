"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import {
  createOrganizationAction,
  updateOrganizationAction,
  type OrganizationFormState,
} from "./actions";
import type { Organization } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldError } from "@/components/data/FieldError";

const initialState: OrganizationFormState = {};

type OrganizationFormProps = { mode: "create" } | { mode: "edit"; organization: Organization };

export function OrganizationForm(props: OrganizationFormProps) {
  const action =
    props.mode === "create"
      ? createOrganizationAction
      : updateOrganizationAction.bind(null, props.organization.id);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const organization = props.mode === "edit" ? props.organization : undefined;

  return (
    <form action={formAction}>
      <Card>
        <CardContent className="grid gap-5 pt-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" defaultValue={organization?.name} required />
            <FieldError messages={state.fieldErrors?.name} />
          </div>
          {props.mode === "edit" ? (
            <div className="flex items-center gap-2">
              <Checkbox id="active" name="active" defaultChecked={organization?.active ?? true} />
              <Label htmlFor="active" className="font-normal">
                Organização ativa
              </Label>
            </div>
          ) : null}
          {state.error ? (
            <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="outline" asChild>
            <Link href="/organizations">Cancelar</Link>
          </Button>
          <Button type="submit" variant="accent" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Salvar
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
