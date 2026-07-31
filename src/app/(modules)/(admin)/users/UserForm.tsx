"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { createUserAction, updateUserAction, type UserFormState } from "./actions";
import type { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldError } from "@/components/data/FieldError";

const initialState: UserFormState = {};

type UserFormProps = { mode: "create" } | { mode: "edit"; user: User };

export function UserForm(props: UserFormProps) {
  const action =
    props.mode === "create" ? createUserAction : updateUserAction.bind(null, props.user.id);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const user = props.mode === "edit" ? props.user : undefined;

  return (
    <form action={formAction}>
      <Card>
        <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" defaultValue={user?.name} required />
            <FieldError messages={state.fieldErrors?.name} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="surname">Sobrenome</Label>
            <Input id="surname" name="surname" defaultValue={user?.surname} required />
            <FieldError messages={state.fieldErrors?.surname} />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" defaultValue={user?.email} required />
            <FieldError messages={state.fieldErrors?.email} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />
            {props.mode === "edit" ? (
              <p className="text-xs text-muted-foreground">
                Informe a senha atual (ou uma nova) para confirmar a alteração.
              </p>
            ) : null}
            <FieldError messages={state.fieldErrors?.password} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="permissionId">Permissão (ID)</Label>
            <Input
              id="permissionId"
              name="permissionId"
              type="number"
              min={1}
              defaultValue={user?.permissionId ?? 1}
              required
            />
            <FieldError messages={state.fieldErrors?.permissionId} />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Checkbox id="active" name="active" defaultChecked={user?.active ?? true} />
            <Label htmlFor="active" className="font-normal">
              Usuário ativo
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
            <Link href="/users">Cancelar</Link>
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
