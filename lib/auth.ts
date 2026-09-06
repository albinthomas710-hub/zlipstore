import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "zlip_admin_session";

// Derive a stable session token from the admin password using a hash.
// This way, changing ADMIN_PASSWORD in .env.local immediately invalidates all sessions.
function getSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD || "fallback_insecure_default";
  return crypto.createHmac("sha256", "zlip_store_salt_2025").update(password).digest("hex");
}

export async function createSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, getSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return token === getSessionToken();
}

export async function requireAuth() {
  const isAuthenticated = await verifySession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
