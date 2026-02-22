import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: () => boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  isAdmin: () => {
    return get().user?.role === "admin";
  },

  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    // todo0040 - refresh token 등 추가 토큰 저장 로직 필요 시 수정
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrate: () => {
    const token = localStorage.getItem("token");
    if (token) {
      // todo0041 - /auth/me 같은 엔드포인트를 호출해서 user 정보 가져오기
      set({ token, isAuthenticated: true });
    }
  },
}));
