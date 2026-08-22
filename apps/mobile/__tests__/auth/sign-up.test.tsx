import { render, screen, userEvent, waitFor } from "@testing-library/react-native";
import SignUpScreen from "../../app/(auth)/sign-up";
import { supabase } from "../../src/lib/supabase";

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

jest.mock("../../src/lib/supabase", () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

const mockSignUp = supabase.auth.signUp as jest.Mock;

describe("SignUpScreen", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();
    mockSignUp.mockReset();
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
    expect(mockSignUp).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  }, 15000);

  it("signs up and routes into onboarding, not straight to the tabs (unlike sign-in)", async () => {
    mockSignUp.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    await render(<SignUpScreen />);

    await user.type(screen.getByLabelText("Full name"), "Juan Dela Cruz");
    await user.type(screen.getByLabelText("Email"), "juan@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "password123");
    await user.press(screen.getByText("Create account"));

    expect(mockSignUp).toHaveBeenCalledWith({
      email: "juan@example.com",
      password: "password123",
      options: { data: { full_name: "Juan Dela Cruz" } },
    });
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/(onboarding)/describe"));
  }, 15000);

  it("shows the Supabase error message and does not navigate on failure", async () => {
    mockSignUp.mockResolvedValue({ error: { message: "User already registered" } });
    const user = userEvent.setup();
    await render(<SignUpScreen />);

    await user.type(screen.getByLabelText("Full name"), "Juan Dela Cruz");
    await user.type(screen.getByLabelText("Email"), "juan@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "password123");
    await user.press(screen.getByText("Create account"));

    expect(await screen.findByText("User already registered")).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  }, 15000);

  it("Already have an account? navigates to sign-in", async () => {
    const user = userEvent.setup();
    await render(<SignUpScreen />);

    await user.press(screen.getByText("Already have an account? Sign in"));
    expect(mockPush).toHaveBeenCalledWith("/(auth)/sign-in");
  });
});
