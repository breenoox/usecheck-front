import "server-only";
import { redirect } from "next/navigation";

import { getToken } from "@/lib/session";

const BASE_URL = process.env.BACKEND_API_URL;

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type BackendFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Set to false for requests that should not attach the session token. */
  auth?: boolean;
};

/**
 * Server-only helper for calling the Java backend. The JWT is read from the
 * httpOnly session cookie and attached here — it never reaches client JS.
 */
export async function backendFetch<T>(
  path: string,
  options: BackendFetchOptions = {}
): Promise<T> {
  if (!BASE_URL) {
    throw new Error("BACKEND_API_URL não está configurada.");
  }

  const { body, auth = true, headers, ...rest } = options;
  const finalHeaders = new Headers(headers);
  finalHeaders.set("Content-Type", "application/json");

  if (auth) {
    const token = await getToken();
    if (!token) {
      redirect("/login");
    }
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await res.json().catch(() => undefined)
    : await res.text().catch(() => undefined);

  if (!res.ok) {
    if (res.status === 401) {
      // Session is present but the backend rejected it (expired/revoked).
      redirect("/login");
    }
    throw new ApiError(
      res.status,
      extractMessage(payload) ?? `Erro ao comunicar com o servidor (${res.status}).`,
      payload
    );
  }

  return payload as T;
}

function extractMessage(payload: unknown): string | undefined {
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.error === "string") return obj.error;
    if (Array.isArray(obj.errors) && obj.errors.length > 0) {
      return obj.errors.map(String).join(", ");
    }
  }
  if (typeof payload === "string" && payload.trim().length > 0) {
    // Errors raised below the application layer (e.g. the servlet container
    // rejecting a malformed request) come back as an HTML error page instead
    // of the app's JSON error shape — not useful to surface verbatim.
    if (payload.trim().startsWith("<")) return undefined;
    return payload;
  }
  return undefined;
}
