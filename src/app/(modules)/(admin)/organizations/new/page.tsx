import type { Metadata } from "next";

import { PageHeader } from "@/components/data/PageHeader";
import { OrganizationForm } from "../OrganizationForm";

export const metadata: Metadata = { title: "Nova organização" };

export default function NewOrganizationPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Nova organização" description="Cadastre uma nova organização." />
      <OrganizationForm mode="create" />
    </div>
  );
}
