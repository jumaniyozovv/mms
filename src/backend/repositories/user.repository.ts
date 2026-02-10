import { prisma } from "@/backend/lib/prisma";
import type { Prisma, User } from "@/app/generated/prisma/client";
import type { UserListFilters } from "@/backend/types/user.types";

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
  phone: string;
  role: "ADMIN" | "MANAGER" | "USER";
}): Promise<User> {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role || "USER",
    },
  });
}

export async function findUsers(
  filters: UserListFilters
): Promise<{ data: User[]; total: number }> {
  const { page, limit, search } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = search
    ? {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.user.count({ where }),
  ]);

  return { data, total };
}

export async function updateUser(
  id: string,
  data: { firstName: string; lastName: string; phone?: string; role: "ADMIN" | "MANAGER" | "USER" }
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string): Promise<User> {
  return prisma.user.delete({
    where: { id },
  });
}

export async function getUserCount(): Promise<number> {
  return prisma.user.count();
}
