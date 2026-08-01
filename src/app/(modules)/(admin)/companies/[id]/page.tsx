import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApiError, backendFetch } from "@/lib/backend";
import { mapClosingTemplateBinding, mapClosingTemplateSummary, mapCompany } from "@/lib/mappers";
import { normalizePageResponse } from "@/lib/pagination";
import type { Company } from "@/lib/types";
import { PageHeader } from "@/components/data/PageHeader";
import { CompanyForm } from "../CompanyForm";
import { ClosingTemplateSection } from "./ClosingTemplateSection";

export const metadata: Metadata = { title: "Editar empresa" };

type EditCompanyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCompanyPage({ params }: EditCompanyPageProps) {
  const { id } = await params;

  let company: Company;
  try {
    company = mapCompany(await backendFetch<Record<string, unknown>>(`/companies/${id}`));
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const bindingRaw = await backendFetch<Record<string, unknown> | undefined>(
    `/companies/${id}/closing-template`
  );
  const closingTemplateId = bindingRaw
    ? mapClosingTemplateBinding(bindingRaw).closingTemplateId
    : undefined;

  const templatesRaw = await backendFetch<unknown>("/closing-templates?page=0&size=100");
  const templates = normalizePageResponse<Record<string, unknown>>(templatesRaw, 1, 100).items.map(
    mapClosingTemplateSummary
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Editar empresa" description={company.companyName} />
      <CompanyForm mode="edit" company={company} />
      <ClosingTemplateSection
        companyId={company.id}
        closingTemplateId={closingTemplateId}
        templates={templates}
      />
    </div>
  );
}
