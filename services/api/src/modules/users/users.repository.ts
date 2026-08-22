import type { User } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export function findById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export function create(id: string, email: string): Promise<User> {
  return prisma.user.create({ data: { id, email } });
}
