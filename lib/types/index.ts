import type { Role } from "@/lib/features/auth/roles";

// Common types
export interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  roles: Role[];
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Re-export feature types
export * from "../features/questionnaire/types";
export * from "../features/auth/types";

export * from "./profile";
