import { importPKCS8, SignJWT } from "jose";

// A fixed ES256 keypair used only in tests, mirroring the asymmetric
// signing keys Supabase issues real access tokens with (see
// middleware/auth.ts) — not a real project's key.
export const testJwk = {
  kty: "EC",
  x: "rZSNtFYL6aDAsKqLu35dZDOzJc4zY17egvWU9rSjCIo",
  y: "_wOIk8hFs3bjGqpqLBPdBBNCBoPJ11PMAWFZNPEGLgc",
  crv: "P-256",
  kid: "test-key-1",
  alg: "ES256",
  use: "sig",
};

const testPrivatePkcs8 = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgMkZf/d+LcQVZv9G9
vXh7TAITfPsLBhYESkyE62hzaMqhRANCAAStlI20VgvpoMCwqou7fl1kM7MlzjNj
Xt6C9ZT2tKMIiv8DiJPIRbN24xqqaiwT3QQTQgaDyddTzAFhWTTxBi4H
-----END PRIVATE KEY-----`;

export async function signTestToken(
  claims: Record<string, unknown>,
  options: { expiresIn?: string } = {},
): Promise<string> {
  const privateKey = await importPKCS8(testPrivatePkcs8, "ES256");
  return new SignJWT(claims)
    .setProtectedHeader({ alg: "ES256", kid: testJwk.kid })
    .setIssuedAt()
    .setExpirationTime(options.expiresIn ?? "1h")
    .sign(privateKey);
}
