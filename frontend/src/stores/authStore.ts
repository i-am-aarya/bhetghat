import { authApi, type LoginPayload, type RegisterPayload } from "@/api/auth";
import { setAccessToken } from "@/lib/api";
import { create } from "zustand";

interface User {
  username: string;
  email: string;
  // spriteURL: string;
  id: string;
  firstname?: string;
  lastname?: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  isSubmitting: boolean;
  isCheckingSession: boolean;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  initAuth: () => Promise<void>;

  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isSubmitting: false,
  isCheckingSession: true,
  isAuthenticated: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isSubmitting: loading }),

  initAuth: async () => {
    set({isCheckingSession: true})

    try {
      const {data} = await authApi.refresh()
      setAccessToken(data.accessToken)
      set({user: data.user, isAuthenticated: true})
    } catch {
      setAccessToken(null)
      set({user: null, isAuthenticated: false})
    } finally {
      set({
        isCheckingSession: false
      })
    }
  },

  login: async (payload) => {
    if(get().isSubmitting) return
    set({ isSubmitting: true });
    try {
      const { data } = await authApi.login(payload);
      set({ user: data.user, isAuthenticated: true });
      setAccessToken(data.accessToken)
    } catch (error) {
      console.error(error)
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  register: async (payload) => {
    if(get().isSubmitting) return
    set({ isSubmitting: true });
    try {
      const { data } = await authApi.register(payload);
      set({ user: data.user, isAuthenticated: true });
      setAccessToken(data.accessToken)
    } catch {
      // console.error(error)
      // throw error;
      setAccessToken(null)
    } finally {
      set({ isSubmitting: false });
    }
  },

  logout: async () => {
    if(get().isSubmitting) return
    set({ isSubmitting: true });
    try {
      await authApi.logout();
    } catch (error) {
      console.error("logout error: ", error);
    } finally {
      setAccessToken(null)
      set({ user: null, isAuthenticated: false, isSubmitting:false });
    }
  },
}));
