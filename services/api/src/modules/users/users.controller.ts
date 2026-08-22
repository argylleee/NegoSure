import type { Response } from "express";
import type { AuthedRequest } from "../../middleware/auth.js";
import * as usersService from "./users.service.js";
import { meResponseSchema } from "./users.schema.js";

export async function getMe(req: AuthedRequest, res: Response): Promise<void> {
  // requireAuth guarantees userId; userEmail comes from the same verified
  // token and is only missing if Supabase omitted the "email" claim.
  const userId = req.userId as string;
  const userEmail = req.userEmail ?? "";

  const user = await usersService.getOrCreateProfile(userId, userEmail);
  res.json(meResponseSchema.parse(user));
}
