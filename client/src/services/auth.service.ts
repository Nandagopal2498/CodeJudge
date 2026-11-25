import { User, AuthResponse } from '../types/auth.js';

const API_BASE = '/api/auth';
export const TOKEN_STORAGE_KEY = 'codejudge_token';
export const USER_STORAGE_KEY = 'codejudge_user';

export function getStoredToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token?: string | null, rememberMe: boolean = false): void {
  try {
    if (token) {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
      if (rememberMe) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } else {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {}
}

export function getStoredUser(): User | null {
  try {
    const raw = sessionStorage.getItem(USER_STORAGE_KEY) || localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user?: User | null, rememberMe: boolean = false): void {
  try {
    if (user) {
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      if (rememberMe) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } else {
      sessionStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch {}
}

export function clearStoredAuth(): void {
  try {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch {}
}

export function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Handle 401 unauthorized responses across the frontend:
 * clears auth storage and redirects to /login.
 */
export function handleUnauthorized(): void {
  clearStoredAuth();
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
    window.location.href = '/login';
  }
}

export async function getMeApi(): Promise<User> {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_BASE}/me`, {
    headers,
    credentials: 'include',
  });
  if (!res.ok) {
    if (res.status === 401) {
      handleUnauthorized();
    }
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Unauthorized');
  }
  const data = await res.json();
  if (data.user) {
    // Preserve token in current session
    setStoredUser(data.user, !!localStorage.getItem(TOKEN_STORAGE_KEY));
  }
  return data.user;
}

export async function registerApi(username: string, email: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  if (data.token) {
    setStoredToken(data.token, rememberMe);
  }
  if (data.user) {
    setStoredUser(data.user, rememberMe);
  }
  return data;
}

export async function loginApi(emailOrUsername: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ emailOrUsername, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  if (data.token) {
    setStoredToken(data.token, rememberMe);
  }
  if (data.user) {
    setStoredUser(data.user, rememberMe);
  }
  return data;
}

export async function logoutApi(): Promise<{ message: string }> {
  const headers = getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      headers,
      credentials: 'include',
    });
    clearStoredAuth();
    const data = await res.json().catch(() => ({ message: 'Logged out' }));
    return data;
  } catch {
    clearStoredAuth();
    return { message: 'Logged out locally' };
  }
}
