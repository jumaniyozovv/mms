export interface UserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: "ADMIN" | "MANAGER" | "USER";
  createdAt: string;
  updatedAt: string;
}

export interface UserListFilters {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: "ADMIN" | "MANAGER" | "USER";
}

export interface UpdateUserInput {
  firstName: string;
  lastName: string;
  phone?: string;
  role: "ADMIN" | "MANAGER" | "USER";
}
