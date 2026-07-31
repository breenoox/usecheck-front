import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FileWarning, Search } from "lucide-react";

import { ApiError, backendFetch } from "@/lib/backend";
import { mapClosing, mapCompany, mapTaxObligation } from "@/lib/mappers";
import { normalizePageResponse, toStartLimitParams } from "@/lib/pagination";
import { currentHtmlMonth, htmlMonthToApiMonth, isValidHtmlMonth } from "@/lib/closingMonth";
import { PageHeader } from "@/components/data/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ClosingsFilterForm } from "./ClosingsFilterForm";
import { ClosingChecklist } from "./ClosingChecklist";

export const metadata: Metadata = { title: "Fechamentos" };

type ClosingsPageProps = {
  searchParams: Promise<{ companyId?: string; month?: string }>;
};

export default async function ClosingsPage({ searchParams }: ClosingsPageProps) {
  const sp = await searchParams;
  const month = sp.month && isValidHtmlMonth(sp.month) ? sp.month : currentHtmlMonth();
  const companyId = sp.companyId;

  const companiesRaw = await backendFetch<unknown>(`/companies?${toStartLimitParams(1, 500)}`);
  const { items } = normalizePageResponse<Record<string, unknown>>(companiesRaw, 1, 500);
  const companies = items.map(mapCompany);

  let selectedCompany: ReturnType<typeof mapCompany> | undefined;
  let closing: ReturnType<typeof mapClosing> | undefined;
  let notFoundForMonth = false;

  if (companyId) {
    try {
      selectedCompany = mapCompany(
        await backendFetch<Record<string, unknown>>(`/companies/${companyId}`)
      );
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 404)) throw err;
    }

    if (selectedCompany) {
      const referenceMonth = htmlMonthToApiMonth(month);
      try {
        closing = mapClosing(
          await backendFetch<Record<string, unknown>>(
            `/companies/${companyId}/closings?referenceMonth=${encodeURIComponent(referenceMonth)}`
          )
        );
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          notFoundForMonth = true;
        } else {
          throw err;
        }
      }
    }
  }

  const taxObligationsRaw = await backendFetch<Record<string, unknown>[]>("/tax-obligations");
  const taxObligations = taxObligationsRaw.map(mapTaxObligation);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fechamentos"
        description="Consulte o checklist de obrigações fiscais de uma empresa em uma competência."
      />
      <ClosingsFilterForm companies={companies} companyId={companyId} month={month} />

      {!companyId ? (
        <EmptyState
          icon={<Search className="size-6" />}
          title="Selecione uma empresa"
          description="Escolha uma empresa e uma competência acima para visualizar o checklist do fechamento."
        />
      ) : !selectedCompany ? (
        <EmptyState
          icon={<FileWarning className="size-6" />}
          title="Empresa não encontrada"
          description="A empresa selecionada não existe mais."
        />
      ) : notFoundForMonth ? (
        <EmptyState
          icon={<FileWarning className="size-6" />}
          title="Fechamento ainda não gerado"
          description={`Não existe fechamento para ${selectedCompany.companyName} na competência ${htmlMonthToApiMonth(
            month
          )}. Ele é criado automaticamente quando a competência é processada.`}
        />
      ) : closing ? (
        <>
          <p className="text-sm text-muted-foreground">
            {selectedCompany.companyName} · {selectedCompany.cnpj} · competência{" "}
            {htmlMonthToApiMonth(month)}
          </p>
          <ClosingChecklist
            closingId={closing.id}
            initialSteps={closing.steps}
            taxObligations={taxObligations}
          />
        </>
      ) : null}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
