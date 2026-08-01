import type { Metadata } from "next";

import { backendFetch } from "@/lib/backend";
import { mapClosingTemplateSummary } from "@/lib/mappers";
import { normalizePageResponse } from "@/lib/pagination";
import { PageHeader } from "@/components/data/PageHeader";
import { ClosingTemplateCreateForm } from "./ClosingTemplateCreateForm";
import { OpenTemplateForm } from "./OpenTemplateForm";

export const metadata: Metadata = { title: "Modelos de Fechamento" };

export default async function ClosingTemplatesPage() {
  const raw = await backendFetch<unknown>("/closing-templates?page=0&size=100");
  const templates = normalizePageResponse<Record<string, unknown>>(raw, 1, 100).items.map(
    mapClosingTemplateSummary
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Modelos de Fechamento"
        description="Configure os modelos que definem as etapas obrigatórias do fechamento mensal de cada organização."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <ClosingTemplateCreateForm />
        <OpenTemplateForm templates={templates} />
      </div>
    </div>
  );
}
