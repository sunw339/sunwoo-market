import { create } from "zustand";
import type { User } from "@/types";
import { getMe, refreshToken } from "@/lib/api";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAdmin: () => boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  isAdmin: () => {
    return get().user?.role === "admin";
  },

  setAuth: (user, accessToken, rt) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", rt);
    set({ user, accessToken, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  hydrate: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      set({ accessToken: token, isAuthenticated: true });
      const user = await getMe();
      set({ user });
    } catch {
      // accessToken 만료 시 refresh 시도
      const refreshed = await get().refreshAccessToken();
      if (!refreshed) {
        get().logout();
      }
    }
  },

  refreshAccessToken: async () => {
    const rt = localStorage.getItem("refreshToken");
    if (!rt) return false;

    try {
      const { accessToken, refreshToken: newRt } = await refreshToken(rt);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRt);
      set({ accessToken, isAuthenticated: true });
      const user = await getMe();
      set({ user });
      return true;
    } catch {
      return false;
    }
  },
}));
