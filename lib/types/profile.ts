export interface ProfileResponseDto {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  roles: ("admin:exams" | "admin:users" | "user" | "public")[];
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}
