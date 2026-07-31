"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ApiError, backendFetch } from "@/lib/backend";
import { organizationCreateSchema, organizationUpdateSchema } from "@/lib/validation";

export type OrganizationFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createOrganizationAction(
  _prevState: OrganizationFormState,
  formData: FormData
): Promise<OrganizationFormState> {
  const parsed = organizationCreateSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await backendFetch<unknown>("/organizations", { method: "POST", body: parsed.data });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }

  revalidatePath("/organizations");
  redirect("/organizations");
}

export async function updateOrganizationAction(
  id: number,
  _prevState: OrganizationFormState,
  formData: FormData
): Promise<OrganizationFormState> {
  const parsed = organizationUpdateSchema.safeParse({
    name: formData.get("name"),
    active: formData.get("active") === "on",
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await backendFetch<unknown>(`/organizations/${id}`, {
      method: "PUT",
      body: parsed.data,
    });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }

  revalidatePath("/organizations");
  redirect("/organizations");
}

export async function deleteOrganizationAction(
  id: number
): Promise<{ error?: string } | void> {
  try {
    await backendFetch(`/organizations/${id}`, { method: "DELETE" });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }
  revalidatePath("/organizations");
}
