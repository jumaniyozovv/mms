import { prisma } from "@/backend/lib/prisma";
import type { User } from "@/app/generated/prisma/client";

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function updateUserPassword(
  userId: string,
  hashedPassword: string
): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

export async function createUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "ADMIN" | "MANAGER" | "USER";
}): Promise<User> {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || "USER",
    },
  });
}

export async function getUserCount(): Promise<number> {
  return prisma.user.count();
}
