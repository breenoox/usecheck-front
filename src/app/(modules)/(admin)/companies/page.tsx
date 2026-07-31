import Link from "next/link";
import type { Metadata } from "next";
import { ClipboardCheck, Pencil } from "lucide-react";

import { backendFetch } from "@/lib/backend";
import { mapCompany } from "@/lib/mappers";
import { normalizePageResponse, parseUiPage, toStartLimitParams } from "@/lib/pagination";
import { formatCnpj } from "@/lib/format";
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

import { deleteCompanyAction } from "./actions";

export const metadata: Metadata = { title: "Empresas" };

type CompaniesPageProps = {
  searchParams: Promise<{ page?: string; size?: string }>;
};

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const sp = await searchParams;
  const { page, size } = parseUiPage(sp);
  const params = toStartLimitParams(page, size);

  const raw = await backendFetch<unknown>(`/companies?${params.toString()}`);
  const { items, totalPages } = normalizePageResponse<Record<string, unknown>>(raw, page, size);
  const companies = items.map(mapCompany);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Empresas"
        description="Gerencie as empresas vinculadas às organizações."
        newHref="/companies/new"
        newLabel="Nova empresa"
      />
      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome fantasia</TableHead>
              <TableHead>Razão social</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Organização</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Nenhuma empresa encontrada.
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium text-foreground">
                    {company.companyName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{company.businessName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatCnpj(company.cnpj)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{company.organizationId}</TableCell>
                  <TableCell>
                    <ActiveBadge active={company.active} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" aria-label="Ver checklist de fechamento">
                        <Link href={`/closings?companyId=${company.id}`}>
                          <ClipboardCheck className="size-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon" aria-label="Editar empresa">
                        <Link href={`/companies/${company.id}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <DeleteButton
                        action={deleteCompanyAction}
                        id={company.id}
                        itemLabel="empresa"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination page={page} totalPages={totalPages} basePath="/companies" />
      </Card>
    </div>
  );
}
