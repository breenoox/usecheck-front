import type { Metadata } from "next";

import { PageHeader } from "@/components/data/PageHeader";
import { UserForm } from "../UserForm";

export const metadata: Metadata = { title: "Novo usuário" };

export default function NewUserPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Novo usuário" description="Cadastre um novo usuário no sistema." />
      <UserForm mode="create" />
    </div>
  );
}
