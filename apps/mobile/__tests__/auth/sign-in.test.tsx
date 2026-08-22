import { render, screen, userEvent, waitFor } from "@testing-library/react-native";
import SignInScreen from "../../app/(auth)/sign-in";
import { supabase } from "../../src/lib/supabase";

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

jest.mock("../../src/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;

describe("SignInScreen", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();
    mockSignIn.mockReset();
  });

  it("shows validation errors and does not call Supabase on invalid input", async () => {
    const user = userEvent.setup();
    await render(<SignInScreen />);

    await user.type(screen.getByTestId("email-input"), "not-an-email");
    await user.type(screen.getByTestId("password-input"), "short");
    await user.press(screen.getByTestId("sign-in-submit"));

    expect(await screen.findByText("Enter a valid email")).toBeTruthy();
    expect(await screen.findByText("At least 8 characters")).toBeTruthy();
    expect(mockSignIn).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("signs in and navigates to the tabs on valid input", async () => {
    mockSignIn.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    await render(<SignInScreen />);

    await user.type(screen.getByTestId("email-input"), "juan@example.com");
    await user.type(screen.getByTestId("password-input"), "password123");
    await user.press(screen.getByTestId("sign-in-submit"));

    expect(mockSignIn).toHaveBeenCalledWith({
      email: "juan@example.com",
      password: "password123",
    });
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/(tabs)"));
  });

  it("shows the Supabase error message and does not navigate on failure", async () => {
    mockSignIn.mockResolvedValue({ error: { message: "Invalid login credentials" } });
    const user = userEvent.setup();
    await render(<SignInScreen />);

    await user.type(screen.getByTestId("email-input"), "juan@example.com");
    await user.type(screen.getByTestId("password-input"), "wrongpassword");
    await user.press(screen.getByTestId("sign-in-submit"));

    expect(await screen.findByText("Invalid login credentials")).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
