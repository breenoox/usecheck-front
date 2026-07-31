"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ApiError, backendFetch } from "@/lib/backend";
import { mapClosingTemplate } from "@/lib/mappers";
import { closingTemplateCreateSchema, closingTemplateStepCreateSchema } from "@/lib/validation";

export type ClosingTemplateFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createClosingTemplateAction(
  _prevState: ClosingTemplateFormState,
  formData: FormData
): Promise<ClosingTemplateFormState> {
  const parsed = closingTemplateCreateSchema.safeParse({
    organizationId: formData.get("organizationId"),
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let template;
  try {
    template = mapClosingTemplate(
      await backendFetch<Record<string, unknown>>("/closing-templates", {
        method: "POST",
        body: parsed.data,
      })
    );
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }

  const params = new URLSearchParams({
    name: template.name,
    organizationId: String(template.organizationId),
  });
  redirect(`/closing-templates/${template.id}?${params.toString()}`);
}

export type AddTemplateStepFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function addClosingTemplateStepAction(
  templateId: number,
  _prevState: AddTemplateStepFormState,
  formData: FormData
): Promise<AddTemplateStepFormState> {
  const parsed = closingTemplateStepCreateSchema.safeParse({
    taxObligationId: formData.get("taxObligationId"),
    priority: formData.get("priority"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await backendFetch<unknown>(`/closing-templates/${templateId}/steps`, {
      method: "POST",
      body: parsed.data,
    });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }

  revalidatePath(`/closing-templates/${templateId}`);
  return {};
}
