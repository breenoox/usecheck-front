import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApiError, backendFetch } from "@/lib/backend";
import { mapClosingTemplateStep, mapTaxObligation } from "@/lib/mappers";
import { PageHeader } from "@/components/data/PageHeader";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddTemplateStepForm } from "./AddTemplateStepForm";

export const metadata: Metadata = { title: "Modelo de Fechamento" };

type ClosingTemplateDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; organizationId?: string }>;
};

export default async function ClosingTemplateDetailPage({
  params,
  searchParams,
}: ClosingTemplateDetailPageProps) {
  const { id } = await params;
  const { name, organizationId } = await searchParams;

  let stepsRaw: Record<string, unknown>[];
  try {
    stepsRaw = await backendFetch<Record<string, unknown>[]>(`/closing-templates/${id}/steps`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
  const steps = stepsRaw.map(mapClosingTemplateStep);

  const taxObligationsRaw = await backendFetch<Record<string, unknown>[]>("/tax-obligations");
  const taxObligations = taxObligationsRaw.map(mapTaxObligation);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={name ?? `Modelo de Fechamento #${id}`}
        description={
          organizationId
            ? `Organização #${organizationId} — etapas obrigatórias recorrentes deste modelo.`
            : "Etapas obrigatórias recorrentes deste modelo."
        }
      />
      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prioridade</TableHead>
              <TableHead>Obrigação fiscal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {steps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="py-10 text-center text-muted-foreground">
                  Nenhuma etapa configurada ainda.
                </TableCell>
              </TableRow>
            ) : (
              steps.map((step) => (
                <TableRow key={step.id}>
                  <TableCell className="text-muted-foreground">{step.priority}</TableCell>
                  <TableCell className="font-medium text-foreground">
                    {step.obligationName}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      <AddTemplateStepForm templateId={Number(id)} taxObligations={taxObligations} />
    </div>
  );
}
