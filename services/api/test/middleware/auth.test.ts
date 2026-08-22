import { describe, expect, it, vi } from "vitest";

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

const { SignJWT, importPKCS8 } = await import("jose");
const { requireAuth } = await import("../../src/middleware/auth.js");
const { signTestToken } = await import("../fixtures/testJwks.js");
type AuthedRequest = import("../../src/middleware/auth.js").AuthedRequest;

// A second, unrelated ES256 key — signs a token that doesn't match
// test-key-1's kid, simulating an invalid signature.
const WRONG_KEY_PKCS8 = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgFsEf1wa5YxWRUMZL
lyssx5KTM34NSe9MpwTbXmM6j72hRANCAATen7yL4wPnT4ow6uZoL7Y/lrmNdbTm
pnJiwPQ76PFqdpoBiqTbfWYdG90pj7d0qRrwRwl9nD0s4w07mE1RP/cR
-----END PRIVATE KEY-----`;

async function signWithWrongKey(claims: Record<string, unknown>): Promise<string> {
  const privateKey = await importPKCS8(WRONG_KEY_PKCS8, "ES256");
  return new SignJWT(claims)
    .setProtectedHeader({ alg: "ES256", kid: "test-key-1" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(privateKey);
}

function makeRes() {
  const res: { statusCode?: number; body?: unknown } = {};
  return {
    status: vi.fn(function status(this: unknown, code: number) {
      res.statusCode = code;
      return this;
    }),
    json: vi.fn(function json(this: unknown, body: unknown) {
      res.body = body;
      return this;
    }),
    _res: res,
  };
}

describe("requireAuth", () => {
  it("rejects a request with no bearer token", async () => {
    const req = { headers: {} } as AuthedRequest;
    const res = makeRes();
    const next = vi.fn();

    await requireAuth(req, res as never, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an invalid signature", async () => {
    const badToken = await signWithWrongKey({ sub: "user-1" });
    const req = { headers: { authorization: `Bearer ${badToken}` } } as AuthedRequest;
    const res = makeRes();
    const next = vi.fn();

    await requireAuth(req, res as never, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an expired token", async () => {
    const expiredToken = await signTestToken({ sub: "user-1" }, { expiresIn: "-10s" });
    const req = { headers: { authorization: `Bearer ${expiredToken}` } } as AuthedRequest;
    const res = makeRes();
    const next = vi.fn();

    await requireAuth(req, res as never, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("accepts a valid token and attaches userId/userEmail", async () => {
    const token = await signTestToken({ sub: "user-1", email: "juan@example.com" });
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthedRequest;
    const res = makeRes();
    const next = vi.fn();

    await requireAuth(req, res as never, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.userId).toBe("user-1");
    expect(req.userEmail).toBe("juan@example.com");
    expect(res.status).not.toHaveBeenCalled();
  });
});
