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

interface TokenResponse {
  user: {
    username: string;
    email: string;
    isAdmin: boolean;
    id: string;
    // spriteURL: string;
  };
  accessToken: string;
}

export interface User {
  username: string;
  email: string;
  // spriteURL: string;
  id: string;
  firstname?: string;
  lastname?: string;
  isAdmin?: boolean;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<TokenResponse>("/auth/login", payload),

  register: (payload: RegisterPayload) =>
    api.post<TokenResponse>("/auth/register", payload),

  logout: () => api.post("/auth/logout"),

  refresh: () =>
    api.post<TokenResponse>("/auth/refresh"),
};
