import { render, screen, userEvent } from "@testing-library/react-native";
import SignUpScreen from "../../app/(auth)/sign-up";
import { useAuthStore } from "../../src/store/authStore";

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

describe("SignUpScreen", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();
    useAuthStore.setState({ isAuthenticated: false, user: null });
  });

  it("shows a mismatched-password error and does not sign up", async () => {
    const user = userEvent.setup();
    await render(<SignUpScreen />);

    await user.type(screen.getByLabelText("Full name"), "Juan Dela Cruz");
    await user.type(screen.getByLabelText("Email"), "juan@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "different123");
    await user.press(screen.getByText("Create account"));

    expect(await screen.findByText("Passwords don't match")).toBeTruthy();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("signs up and routes into onboarding, not straight to the tabs (unlike sign-in)", async () => {
    const user = userEvent.setup();
    await render(<SignUpScreen />);

    await user.type(screen.getByLabelText("Full name"), "Juan Dela Cruz");
    await user.type(screen.getByLabelText("Email"), "juan@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "password123");
    await user.press(screen.getByText("Create account"));

    expect(mockReplace).toHaveBeenCalledWith("/(onboarding)/describe");
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ name: "Juan Dela Cruz", email: "juan@example.com" });
  }, 15000);

  it("Already have an account? navigates to sign-in", async () => {
    const user = userEvent.setup();
    await render(<SignUpScreen />);

    await user.press(screen.getByText("Already have an account? Sign in"));
    expect(mockPush).toHaveBeenCalledWith("/(auth)/sign-in");
  });
});
