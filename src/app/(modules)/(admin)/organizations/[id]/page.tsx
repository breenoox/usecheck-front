import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApiError, backendFetch } from "@/lib/backend";
import { mapOrganization } from "@/lib/mappers";
import type { Organization } from "@/lib/types";
import { PageHeader } from "@/components/data/PageHeader";
import { OrganizationForm } from "../OrganizationForm";

export const metadata: Metadata = { title: "Editar organização" };

type EditOrganizationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditOrganizationPage({ params }: EditOrganizationPageProps) {
  const { id } = await params;

  let organization: Organization;
  try {
    organization = mapOrganization(
      await backendFetch<Record<string, unknown>>(`/organizations/${id}`)
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Editar organização" description={organization.name} />
      <OrganizationForm mode="edit" organization={organization} />
    </div>
  );
}
