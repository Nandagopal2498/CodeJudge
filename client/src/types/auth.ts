export interface User {
  id: number;
  username: string;
  email: string;
  role: 'User' | 'Admin';
  created_at?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}
