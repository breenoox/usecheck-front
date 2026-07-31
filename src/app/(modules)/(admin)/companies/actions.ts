"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ApiError, backendFetch } from "@/lib/backend";
import {
  closingTemplateBindingSchema,
  companyCreateSchema,
  companyUpdateSchema,
} from "@/lib/validation";

export type CompanyFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createCompanyAction(
  _prevState: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  const parsed = companyCreateSchema.safeParse({
    organizationId: formData.get("organizationId"),
    businessName: formData.get("businessName"),
    companyName: formData.get("companyName"),
    cnpj: formData.get("cnpj"),
    active: formData.get("active") === "on",
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await backendFetch<unknown>("/companies", { method: "POST", body: parsed.data });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }

  revalidatePath("/companies");
  redirect("/companies");
}

export async function updateCompanyAction(
  id: number,
  _prevState: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  const parsed = companyUpdateSchema.safeParse({
    businessName: formData.get("businessName"),
    companyName: formData.get("companyName"),
    cnpj: formData.get("cnpj"),
    active: formData.get("active") === "on",
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await backendFetch<unknown>(`/companies/${id}`, { method: "PUT", body: parsed.data });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }

  revalidatePath("/companies");
  redirect("/companies");
}

export async function deleteCompanyAction(id: number): Promise<{ error?: string } | void> {
  try {
    await backendFetch(`/companies/${id}`, { method: "DELETE" });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }
  revalidatePath("/companies");
}

export type ClosingTemplateBindingFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function bindClosingTemplateAction(
  companyId: number,
  _prevState: ClosingTemplateBindingFormState,
  formData: FormData
): Promise<ClosingTemplateBindingFormState> {
  const parsed = closingTemplateBindingSchema.safeParse({
    closingTemplateId: formData.get("closingTemplateId"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await backendFetch<unknown>(`/companies/${companyId}/closing-template`, {
      method: "PUT",
      body: parsed.data,
    });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }

  revalidatePath(`/companies/${companyId}`);
  return {};
}
