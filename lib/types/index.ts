// Common types
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Re-export feature types
export * from "../features/questionnaire/types";
export * from "../features/auth/types";
