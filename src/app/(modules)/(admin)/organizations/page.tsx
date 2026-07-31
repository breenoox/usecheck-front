import Link from "next/link";
import type { Metadata } from "next";
import { Pencil } from "lucide-react";

import { backendFetch } from "@/lib/backend";
import { mapOrganization } from "@/lib/mappers";
import { normalizePageResponse, parseUiPage, toStartLimitParams } from "@/lib/pagination";
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

import { deleteOrganizationAction } from "./actions";

export const metadata: Metadata = { title: "Organizações" };

type OrganizationsPageProps = {
  searchParams: Promise<{ page?: string; size?: string }>;
};

export default async function OrganizationsPage({ searchParams }: OrganizationsPageProps) {
  const sp = await searchParams;
  const { page, size } = parseUiPage(sp);
  const params = toStartLimitParams(page, size);

  const raw = await backendFetch<unknown>(`/organizations?${params.toString()}`);
  const { items, totalPages } = normalizePageResponse<Record<string, unknown>>(raw, page, size);
  const organizations = items.map(mapOrganization);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Organizações"
        description="Gerencie as organizações cadastradas."
        newHref="/organizations/new"
        newLabel="Nova organização"
      />
      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                  Nenhuma organização encontrada.
                </TableCell>
              </TableRow>
            ) : (
              organizations.map((organization) => (
                <TableRow key={organization.id}>
                  <TableCell className="font-medium text-foreground">
                    {organization.name}
                  </TableCell>
                  <TableCell>
                    <ActiveBadge active={organization.active} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        aria-label="Editar organização"
                      >
                        <Link href={`/organizations/${organization.id}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <DeleteButton
                        action={deleteOrganizationAction}
                        id={organization.id}
                        itemLabel="organização"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination page={page} totalPages={totalPages} basePath="/organizations" />
      </Card>
    </div>
  );
}
