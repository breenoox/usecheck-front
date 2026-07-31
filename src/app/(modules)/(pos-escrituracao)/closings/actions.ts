"use server";

import { ApiError, backendFetch } from "@/lib/backend";
import { mapClosingStep } from "@/lib/mappers";
import { closingStepCreateSchema } from "@/lib/validation";
import type { ClosingStep } from "@/lib/types";

export async function completeClosingStepAction(
  stepId: number
): Promise<{ step?: ClosingStep; error?: string }> {
  try {
    const raw = await backendFetch<Record<string, unknown>>(`/closing-steps/${stepId}/complete`, {
      method: "PATCH",
    });
    return { step: mapClosingStep(raw) };
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }
}

export async function addClosingStepAction(
  closingId: number,
  taxObligationId: number
): Promise<{ step?: ClosingStep; error?: string }> {
  const parsed = closingStepCreateSchema.safeParse({ taxObligationId });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.taxObligationId?.[0] ?? "Dados inválidos." };
  }

  try {
    const raw = await backendFetch<Record<string, unknown>>(`/closings/${closingId}/steps`, {
      method: "POST",
      body: parsed.data,
    });
    return { step: mapClosingStep(raw) };
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }
}
