import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApiError, backendFetch } from "@/lib/backend";
import { mapUser } from "@/lib/mappers";
import type { User } from "@/lib/types";
import { PageHeader } from "@/components/data/PageHeader";
import { UserForm } from "../UserForm";

export const metadata: Metadata = { title: "Editar usuário" };

type EditUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;

  let user: User;
  try {
    user = mapUser(await backendFetch<Record<string, unknown>>(`/users/${id}`));
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Editar usuário" description={`${user.name} ${user.surname}`} />
      <UserForm mode="edit" user={user} />
    </div>
  );
}
