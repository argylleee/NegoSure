import { render, screen, userEvent } from "@testing-library/react-native";
import SignInScreen from "../../app/(auth)/sign-in";
import { useAuthStore } from "../../src/store/authStore";

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

describe("SignInScreen", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();
    useAuthStore.setState({ isAuthenticated: false, user: null });
  });

  it("shows validation errors and does not sign in on invalid input", async () => {
    const user = userEvent.setup();
    await render(<SignInScreen />);

    await user.type(screen.getByTestId("email-input"), "not-an-email");
    await user.type(screen.getByTestId("password-input"), "short");
    await user.press(screen.getByTestId("sign-in-submit"));

    expect(await screen.findByText("Enter a valid email")).toBeTruthy();
    expect(await screen.findByText("At least 8 characters")).toBeTruthy();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("signs in and navigates to the tabs on valid input", async () => {
    const user = userEvent.setup();
    await render(<SignInScreen />);

    await user.type(screen.getByTestId("email-input"), "juan@example.com");
    await user.type(screen.getByTestId("password-input"), "password123");
    await user.press(screen.getByTestId("sign-in-submit"));

    expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe("juan@example.com");
  });
});
