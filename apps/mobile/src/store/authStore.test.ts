import { useAuthStore } from "./authStore";
import { supabase } from "../lib/supabase";

jest.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));

const mockGetSession = supabase.auth.getSession as jest.Mock;
const mockOnAuthStateChange = supabase.auth.onAuthStateChange as jest.Mock;

const session = {
  user: { email: "juan@example.com", user_metadata: { full_name: "Juan Dela Cruz" } },
};

describe("authStore", () => {
  let unsubscribe: jest.Mock;

  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, isInitializing: true, user: null });
    unsubscribe = jest.fn();
    mockGetSession.mockReset().mockResolvedValue({ data: { session: null } });
    mockOnAuthStateChange.mockReset().mockReturnValue({ data: { subscription: { unsubscribe } } });
  });

  it("starts initializing and signed out", () => {
    const state = useAuthStore.getState();
    expect(state.isInitializing).toBe(true);
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it("restores an existing session on initialize", async () => {
    mockGetSession.mockResolvedValue({ data: { session } });

    useAuthStore.getState().initialize();
    await Promise.resolve();
    await Promise.resolve();

    const state = useAuthStore.getState();
    expect(state.isInitializing).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ name: "Juan Dela Cruz", email: "juan@example.com" });
  });

  it("resolves to signed-out when there is no session", async () => {
    useAuthStore.getState().initialize();
    await Promise.resolve();
    await Promise.resolve();

    const state = useAuthStore.getState();
    expect(state.isInitializing).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it("updates state when onAuthStateChange fires", () => {
    useAuthStore.getState().initialize();
    const onChange = mockOnAuthStateChange.mock.calls[0][0];

    onChange("SIGNED_IN", session);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ name: "Juan Dela Cruz", email: "juan@example.com" });
  });

  it("returns an unsubscribe function", () => {
    const teardown = useAuthStore.getState().initialize();
    teardown();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
