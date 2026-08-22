import { z } from "zod";

export const meResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
});

export type MeResponse = z.infer<typeof meResponseSchema>;
