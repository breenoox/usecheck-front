"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ApiError, backendFetch } from "@/lib/backend";
import { userCreateSchema, userUpdateSchema } from "@/lib/validation";

export type UserFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

function readUserFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    surname: formData.get("surname"),
    email: formData.get("email"),
    password: formData.get("password"),
    active: formData.get("active") === "on",
    permissionId: formData.get("permissionId"),
  };
}

export async function createUserAction(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const parsed = userCreateSchema.safeParse(readUserFormData(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await backendFetch<unknown>("/users", { method: "POST", body: parsed.data });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function updateUserAction(
  id: number,
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const parsed = userUpdateSchema.safeParse(readUserFormData(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await backendFetch<unknown>(`/users/${id}`, { method: "PUT", body: parsed.data });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function deleteUserAction(id: number): Promise<{ error?: string } | void> {
  try {
    await backendFetch(`/users/${id}`, { method: "DELETE" });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }
  revalidatePath("/users");
}
