import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

// Supabase Auth is the source of truth for identity (.claude/CLAUDE.md §1,
// §13) — this store only mirrors its session state for the UI. Screens call
// supabase.auth.* directly (sign-in.tsx, sign-up.tsx, profile.tsx); this
// store never issues or accepts a session on their behalf.
type AuthUser = { name: string; email: string };

type AuthState = {
  isAuthenticated: boolean;
  isInitializing: boolean;
  user: AuthUser | null;
  initialize: () => () => void;
};

function toAuthUser(session: Session | null): AuthUser | null {
  const authUser = session?.user;
  if (!authUser?.email) return null;
  const fullName = authUser.user_metadata?.full_name;
  return { name: typeof fullName === "string" ? fullName : authUser.email, email: authUser.email };
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isInitializing: true,
  user: null,

  // Restores the session on cold start, then keeps state in sync with
  // sign-in/sign-out/token-refresh. Returns an unsubscribe function.
  initialize: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ isAuthenticated: !!session, user: toAuthUser(session), isInitializing: false });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ isAuthenticated: !!session, user: toAuthUser(session), isInitializing: false });
    });

    return () => subscription.unsubscribe();
  },
}));
