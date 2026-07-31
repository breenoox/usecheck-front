import Link from "next/link";
import type { Metadata } from "next";
import { Pencil } from "lucide-react";

import { backendFetch } from "@/lib/backend";
import { mapUser } from "@/lib/mappers";
import { normalizePageResponse, parseUiPage, toSpringParams } from "@/lib/pagination";
import { PageHeader } from "@/components/data/PageHeader";
import { Pagination } from "@/components/data/Pagination";
import { ActiveBadge } from "@/components/data/ActiveBadge";
import { DeleteButton } from "@/components/data/DeleteButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { deleteUserAction } from "./actions";

export const metadata: Metadata = { title: "Usuários" };

type UsersPageProps = {
  searchParams: Promise<{ page?: string; size?: string }>;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const sp = await searchParams;
  const { page, size } = parseUiPage(sp);
  const params = toSpringParams(page, size);

  const raw = await backendFetch<unknown>(`/users?${params.toString()}`);
  const { items, totalPages } = normalizePageResponse<Record<string, unknown>>(raw, page, size);
  const users = items.map(mapUser);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Usuários"
        description="Gerencie os usuários com acesso ao sistema."
        newHref="/users/new"
        newLabel="Novo usuário"
      />
      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Permissão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-foreground">
                    {user.name} {user.surname}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-muted-foreground">{user.permissionId}</TableCell>
                  <TableCell>
                    <ActiveBadge active={user.active} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" aria-label="Editar usuário">
                        <Link href={`/users/${user.id}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <DeleteButton action={deleteUserAction} id={user.id} itemLabel="usuário" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination page={page} totalPages={totalPages} basePath="/users" />
      </Card>
    </div>
  );
}
