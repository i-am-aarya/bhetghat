// import { toast } from "@/hooks/use-toast";
import { toast } from "sonner";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_BASE = import.meta.env.VITE_GAME_SERVER;
const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/logout",
  "/auth/refresh",
];

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// request interceptor: adds authorization header
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

function flushQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error || !token) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

// response interceptor: runs on every response that comes back
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!originalRequest || error.response?.status !== 401) {
      if (!error.response) {
        toast("Network error", {
          description: "Check your connection and try again",
        });
      } else if (error.response.status >= 500) {
        toast("Server error", { description: getApiErrorMessage(error) });
      }

      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) =>
      originalRequest.url?.includes(path),
    );

    if (isAuthEndpoint) {
      if (originalRequest.url?.includes("/auth/refresh")) {
        setAccessToken(null);
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post<{ accessToken: string }>(
        `${API_BASE}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      setAccessToken(data.accessToken);
      flushQueue(null, data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (error) {
      flushQueue(error, null);
      setAccessToken(null);
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    console.log("inside getApiErrorMessage: ", error.response?.data.error);
    if (error.response)
      return (
        (error.response.data as { error?: string })?.error ??
        error.message ??
        "Something went wrong"
      );
    return "Network error - check your connection"; // no response = network fail
  }
  return "Something went wrong";
}
