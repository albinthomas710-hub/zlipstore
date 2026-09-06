import { NextResponse } from "next/server";
import { createSession, destroySession } from "@/lib/auth";

// Simple in-memory rate limiting (resets on server restart)
// In production, use Redis or a proper rate limiter
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIP(request);
  const now = Date.now();
  
  // Check rate limit
  const attempts = loginAttempts.get(ip);
  if (attempts) {
    if (now < attempts.resetAt && attempts.count >= MAX_ATTEMPTS) {
      const retryAfterSeconds = Math.ceil((attempts.resetAt - now) / 1000);
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.` },
        { status: 429 }
      );
    }
    // Reset window if expired
    if (now >= attempts.resetAt) {
      loginAttempts.delete(ip);
    }
  }

  try {
    const { password } = await request.json();

    if (password === process.env.ADMIN_PASSWORD) {
      // Clear attempts on successful login
      loginAttempts.delete(ip);
      await createSession();
      return NextResponse.json({ success: true });
    }

    // Track failed attempt
    const current = loginAttempts.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
    current.count += 1;
    loginAttempts.set(ip, current);

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ success: true });
}
