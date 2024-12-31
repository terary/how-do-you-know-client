export interface ProfileResponseDto {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  roles: string[];
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}
