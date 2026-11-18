
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface User {
  id: string;
  email: string | null;
  fullName?: string;
  status: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  user?: T;
  token?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
}

export const api = {
  register: (payload: {
    fullName: string;
    email: string;
    password: string;
  }) =>
    request<ApiResponse<User>>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: {
    email: string;
    password: string;
  }) =>
    request<ApiResponse<User>>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: (token: string) =>
    request<ApiResponse<User>>("/api/auth/me", {}, token),

  updateProfile: (token: string, fullName: string) =>
    request<ApiResponse>("/api/users/profile", {
      method: "PATCH",
      body: JSON.stringify({ fullName }),
    }, token),

  logout: (token: string) =>
    request<ApiResponse>("/api/auth/logout", {
      method: "POST",
    }, token),
};
