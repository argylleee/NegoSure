import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "../config/env.js";

export interface AuthedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

// Supabase projects sign access tokens with a per-project asymmetric key
// (ES256), published at this JWKS endpoint — not a shared secret. jose
// caches the key set and re-fetches automatically on a kid it hasn't seen.
const jwks = createRemoteJWKSet(new URL("/auth/v1/.well-known/jwks.json", env.SUPABASE_URL));

// Supabase Auth issues and validates sign-in itself; this middleware only
// verifies the token it issued and never trusts a client-supplied user id
// (CLAUDE.md §13).
export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (!token) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  try {
    const { payload } = await jwtVerify(token, jwks);
    if (typeof payload.sub !== "string") {
      res.status(401).json({ error: "Token missing subject" });
      return;
    }
    req.userId = payload.sub;
    req.userEmail = typeof payload.email === "string" ? payload.email : undefined;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
