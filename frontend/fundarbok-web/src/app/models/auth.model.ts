export interface AuthResult {
  token: string;
  user: User;
  expiresAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  languagePreference: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'Secretary' | 'CommitteeMember';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
