export interface UserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: "ADMIN" | "MANAGER" | "USER";
  isActive: boolean;
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
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: "ADMIN" | "MANAGER" | "USER";
}
