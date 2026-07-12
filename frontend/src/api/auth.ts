import api from "@/lib/api";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

interface AuthResponse {
  user: {
    username: string;
    email: string;
    isAdmin: boolean;
    id: string;
    // spriteURL: string;
  };
  accessToken: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", payload),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/auth/register", payload),

  logout: () => api.post("/auth/logout"),

  refresh: () =>
    api.post<{ accessToken: string }>("/auth/refresh"),
};
