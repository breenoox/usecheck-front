"use server";

import { redirect } from "next/navigation";

import { setSession } from "@/lib/session";
import { loginSchema } from "@/lib/validation";

export type LoginState = {
  error?: string;
};

const BASE_URL = process.env.BACKEND_API_URL;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  if (!BASE_URL) {
    return { error: "Configuração do servidor ausente." };
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });
  } catch {
    return { error: "Não foi possível conectar ao servidor." };
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 400) {
      return { error: "E-mail ou senha inválidos." };
    }
    return { error: "Erro ao efetuar login. Tente novamente." };
  }

  const data = (await res.json().catch(() => null)) as {
    token?: string;
    tokenExpiresIn?: number;
  } | null;

  if (!data?.token) {
    return { error: "Resposta inválida do servidor." };
  }

  await setSession(data.token, data.tokenExpiresIn ?? 15 * 60 * 1000);
  redirect("/");
}
