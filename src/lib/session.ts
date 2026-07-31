import "server-only";
import { cookies } from "next/headers";

const SESSION_COOKIE = "usecheck_token";

export async function setSession(token: string, expiresInMs: number) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(1, Math.floor(expiresInMs / 1000)),
  });
}

export async function getToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
