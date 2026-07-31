"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { createCompanyAction, updateCompanyAction, type CompanyFormState } from "./actions";
import type { Company } from "@/lib/types";
import { formatCnpj } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldError } from "@/components/data/FieldError";

const initialState: CompanyFormState = {};

type CompanyFormProps = { mode: "create" } | { mode: "edit"; company: Company };

export function CompanyForm(props: CompanyFormProps) {
  const action =
    props.mode === "create" ? createCompanyAction : updateCompanyAction.bind(null, props.company.id);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const company = props.mode === "edit" ? props.company : undefined;
  const [cnpj, setCnpj] = useState(formatCnpj(company?.cnpj ?? ""));

  return (
    <form action={formAction}>
      <Card>
        <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
          {props.mode === "create" ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="organizationId">Organização (ID)</Label>
              <Input
                id="organizationId"
                name="organizationId"
                type="number"
                min={1}
                required
              />
              <FieldError messages={state.fieldErrors?.organizationId} />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Label htmlFor="organizationId">Organização (ID)</Label>
              <Input id="organizationId" value={company?.organizationId} disabled />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              name="cnpj"
              value={cnpj}
              onChange={(event) => setCnpj(formatCnpj(event.target.value))}
              placeholder="00.000.000/0000-00"
              inputMode="numeric"
              required
            />
            <FieldError messages={state.fieldErrors?.cnpj} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="businessName">Razão social</Label>
            <Input
              id="businessName"
              name="businessName"
              defaultValue={company?.businessName}
              required
            />
            <FieldError messages={state.fieldErrors?.businessName} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="companyName">Nome fantasia</Label>
            <Input
              id="companyName"
              name="companyName"
              defaultValue={company?.companyName}
              required
            />
            <FieldError messages={state.fieldErrors?.companyName} />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Checkbox id="active" name="active" defaultChecked={company?.active ?? true} />
            <Label htmlFor="active" className="font-normal">
              Empresa ativa
            </Label>
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
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="outline" asChild>
            <Link href="/companies">Cancelar</Link>
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
