import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "usecheck_token";
const PUBLIC_PATHS = ["/login"];

function isExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
    );
    if (typeof decoded.exp !== "number") return false;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    // If we can't decode it, let the backend be the source of truth.
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authenticated = Boolean(token) && !isExpired(token!);
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!authenticated && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    if (token) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (authenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
