import { User } from "@/lib/types";

export const ROLES = {
  ADMIN: "admin",
  ADMIN_EXAMS: "admin:exams",
  ADMIN_USERS: "admin:users",
  USER: "user",
  PUBLIC: "public",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const hasRole = (user: User | null, role: Role): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
};

export const hasAnyRole = (user: User | null, roles: Role[]): boolean => {
  if (!user || !user.roles) return false;
  return roles.some((role) => user.roles.includes(role));
};

export const REQUIRED_ROLES = {
  LEARNING_INSTITUTIONS: [ROLES.ADMIN, ROLES.ADMIN_USERS] as Role[],
  INSTRUCTIONAL_COURSES: [ROLES.ADMIN, ROLES.ADMIN_USERS] as Role[],
  USERS: [ROLES.ADMIN, ROLES.ADMIN_USERS] as Role[],
  EXAM_TEMPLATES: [ROLES.ADMIN, ROLES.ADMIN_EXAMS] as Role[],
} as const;
