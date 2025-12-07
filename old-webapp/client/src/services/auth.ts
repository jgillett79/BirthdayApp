import { User, AuthResponse } from '@shared/types';
import { api } from './api';

export async function login(email: string, password: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/login', { email, password });
}

export async function register(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/register', { email, password, name });
}

export async function getCurrentUser(): Promise<User> {
  return api.get<User>('/auth/me');
}
