import type { User } from "@prisma/client";
import * as usersRepository from "./users.repository.js";

export async function getOrCreateProfile(id: string, email: string): Promise<User> {
  const existing = await usersRepository.findById(id);
  if (existing) return existing;
  return usersRepository.create(id, email);
}
