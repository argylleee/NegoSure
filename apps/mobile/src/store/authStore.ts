import { create } from "zustand";

// Placeholder in-memory session — no backend/Supabase Auth wired yet.
// Real auth must issue a verified session the backend trusts; this store
// only gates client-side navigation for development. See .claude/CLAUDE.md
// §13: never trust a client-supplied identity as proof.
type AuthState = {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  signIn: (user: { name: string; email: string }) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  signIn: (user) => set({ isAuthenticated: true, user }),
  signOut: () => set({ isAuthenticated: false, user: null }),
}));
