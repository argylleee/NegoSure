import { render, screen, userEvent } from "@testing-library/react-native";
import ProfileScreen from "../../app/(tabs)/profile";
import { useAuthStore } from "../../src/store/authStore";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}));

describe("ProfileScreen", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    useAuthStore.setState({ isAuthenticated: false, user: null });
  });

  it("renders the signed-in user's name and email", async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { name: "Juan Dela Cruz", email: "juan@example.com" },
    });
    await render(<ProfileScreen />);

    expect(screen.getByText("Juan Dela Cruz")).toBeTruthy();
    expect(screen.getByText("juan@example.com")).toBeTruthy();
  });

  it("falls back gracefully when there is no user (should not happen post-auth-gate, but must not crash)", async () => {
    await render(<ProfileScreen />);
    expect(screen.getByText("—")).toBeTruthy();
  });

  it("renders the current business and settings groups", async () => {
    await render(<ProfileScreen />);
    expect(screen.getByText("Juan's Coffee Shop")).toBeTruthy();
    expect(screen.getByText("Business")).toBeTruthy();
    expect(screen.getByText("Business profile")).toBeTruthy();
    expect(screen.getByText("Account")).toBeTruthy();
    expect(screen.getByText("Notifications")).toBeTruthy();
    expect(screen.getByText("Support")).toBeTruthy();
    expect(screen.getByText("About NegoSure")).toBeTruthy();
  });

  it("signs out and navigates to Welcome when Sign out is pressed", async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { name: "Juan Dela Cruz", email: "juan@example.com" },
    });
    const user = userEvent.setup();
    await render(<ProfileScreen />);

    await user.press(screen.getByText("Sign out"));

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
    expect(mockReplace).toHaveBeenCalledWith("/(auth)/welcome");
  });
});
