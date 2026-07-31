import type { Metadata } from "next";

import { backendFetch } from "@/lib/backend";
import { mapTaxObligation } from "@/lib/mappers";
import { PageHeader } from "@/components/data/PageHeader";
import { TaxObligationScopeBadge } from "@/components/data/TaxObligationScopeBadge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Obrigações Fiscais" };

export default async function TaxObligationsPage() {
  const raw = await backendFetch<Record<string, unknown>[]>("/tax-obligations");
  const obligations = raw.map(mapTaxObligation);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Obrigações Fiscais"
        description="Catálogo global de obrigações usado para montar modelos e checklists de fechamento."
      />
      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Abrangência</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {obligations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="py-10 text-center text-muted-foreground">
                  Nenhuma obrigação fiscal cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              obligations.map((obligation) => (
                <TableRow key={obligation.id}>
                  <TableCell className="font-medium text-foreground">{obligation.name}</TableCell>
                  <TableCell>
                    <TaxObligationScopeBadge scope={obligation.scope} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
