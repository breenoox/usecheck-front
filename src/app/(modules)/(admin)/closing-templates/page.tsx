import type { Metadata } from "next";

import { PageHeader } from "@/components/data/PageHeader";
import { ClosingTemplateCreateForm } from "./ClosingTemplateCreateForm";
import { OpenTemplateForm } from "./OpenTemplateForm";

export const metadata: Metadata = { title: "Modelos de Fechamento" };

export default function ClosingTemplatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Modelos de Fechamento"
        description="Configure os modelos que definem as etapas obrigatórias do fechamento mensal de cada organização."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <ClosingTemplateCreateForm />
        <OpenTemplateForm />
      </div>
    </div>
  );
}
