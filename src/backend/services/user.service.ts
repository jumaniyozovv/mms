import {
  findUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@/backend/repositories/user.repository";
import { hashPassword } from "@/backend/lib/password";
import type { User } from "@/app/generated/prisma/client";
import type {
  UserListItem,
  UserListFilters,
  PaginatedResult,
  CreateUserInput,
  UpdateUserInput,
} from "@/backend/types/user.types";

function toUserListItem(user: User): UserListItem {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function listUsers(
  filters: UserListFilters
): Promise<PaginatedResult<UserListItem>> {
  const { data, total } = await findUsers(filters);
  return {
    data: data.map(toUserListItem),
    total,
  };
}

export async function createNewUser(
  input: CreateUserInput
): Promise<UserListItem | null> {
  const existing = await findUserByEmail(input.email);
  if (existing) return null;

  const hashedPassword = await hashPassword(input.password);

  const user = await createUser({
    email: input.email,
    password: hashedPassword,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    role: input.role,
  });

  return toUserListItem(user);
}

export async function updateExistingUser(
  id: string,
  input: UpdateUserInput
): Promise<UserListItem | null> {
  const existing = await findUserById(id);
  if (!existing) return null;

  const user = await updateUser(id, {
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    role: input.role,
  });

  return toUserListItem(user);
}

export async function deleteExistingUser(
  id: string,
  requestingUserId: string
): Promise<{ success: boolean; error?: string }> {
  if (id === requestingUserId) {
    return { success: false, error: "Cannot delete your own account" };
  }

  const existing = await findUserById(id);
  if (!existing) {
    return { success: false, error: "User not found" };
  }

  await deleteUser(id);
  return { success: true };
}
