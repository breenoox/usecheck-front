import type { Metadata } from "next";

import { PageHeader } from "@/components/data/PageHeader";
import { CompanyForm } from "../CompanyForm";

export const metadata: Metadata = { title: "Nova empresa" };

export default function NewCompanyPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Nova empresa" description="Cadastre uma nova empresa." />
      <CompanyForm mode="create" />
    </div>
  );
}
