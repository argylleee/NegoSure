import { useAuthStore } from "./authStore";

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, user: null });
  });

  it("starts signed out", () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it("signIn sets the session", () => {
    useAuthStore.getState().signIn({ name: "Juan Dela Cruz", email: "juan@example.com" });
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ name: "Juan Dela Cruz", email: "juan@example.com" });
  });

  it("signOut clears the session", () => {
    useAuthStore.getState().signIn({ name: "Juan Dela Cruz", email: "juan@example.com" });
    useAuthStore.getState().signOut();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
