import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const findUnique = vi.fn();
const create = vi.fn();

vi.mock("../../../src/lib/prisma.js", () => ({
  prisma: {
    user: {
      findUnique: (...args: unknown[]) => findUnique(...args),
      create: (...args: unknown[]) => create(...args),
    },
  },
}));

// vi.mock factories are hoisted above imports, so the test keypair is
// duplicated here (vi.hoisted) rather than imported from testJwks.ts —
// importing that file would transitively import "jose" before this mock
// is registered, causing a TDZ error.
const { testJwk } = vi.hoisted(() => ({
  testJwk: {
    kty: "EC",
    x: "rZSNtFYL6aDAsKqLu35dZDOzJc4zY17egvWU9rSjCIo",
    y: "_wOIk8hFs3bjGqpqLBPdBBNCBoPJ11PMAWFZNPEGLgc",
    crv: "P-256",
    kid: "test-key-1",
    alg: "ES256",
    use: "sig",
  },
}));

// The real middleware fetches Supabase's JWKS over the network; swap it for
// a local key set built from the fixed test keypair.
vi.mock("jose", async (importOriginal) => {
  const actual = await importOriginal<typeof import("jose")>();
  const localJwks = actual.createLocalJWKSet({ keys: [testJwk] });
  return { ...actual, createRemoteJWKSet: () => localJwks };
});

const { createApp } = await import("../../../src/app.js");
const { signTestToken } = await import("../../fixtures/testJwks.js");

describe("GET /api/v1/me", () => {
  beforeEach(() => {
    findUnique.mockReset();
    create.mockReset();
  });

  it("401s with no token", async () => {
    const app = createApp();
    const res = await request(app).get("/api/v1/me");
    expect(res.status).toBe(401);
  });

  it("401s with an invalid token", async () => {
    const app = createApp();
    const res = await request(app)
      .get("/api/v1/me")
      .set("Authorization", "Bearer not-a-real-token");
    expect(res.status).toBe(401);
  });

  it("returns the existing profile for a valid token", async () => {
    findUnique.mockResolvedValue({
      id: "user-1",
      email: "juan@example.com",
      name: "Juan Dela Cruz",
    });
    const token = await signTestToken({ sub: "user-1", email: "juan@example.com" });

    const app = createApp();
    const res = await request(app).get("/api/v1/me").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: "user-1",
      email: "juan@example.com",
      name: "Juan Dela Cruz",
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("creates the profile on first login", async () => {
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue({ id: "user-2", email: "bagong@example.com", name: null });
    const token = await signTestToken({ sub: "user-2", email: "bagong@example.com" });

    const app = createApp();
    const res = await request(app).get("/api/v1/me").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(create).toHaveBeenCalledWith({ data: { id: "user-2", email: "bagong@example.com" } });
    expect(res.body).toEqual({ id: "user-2", email: "bagong@example.com", name: null });
  });
});
