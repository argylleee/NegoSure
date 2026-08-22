import { render, screen, userEvent } from "@testing-library/react-native";
import WelcomeScreen from "../../app/(auth)/welcome";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}));

describe("WelcomeScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("shows the not-a-government-service disclaimer (CLAUDE.md §0)", async () => {
    await render(<WelcomeScreen />);
    expect(
      screen.getByText("NegoSure is an independent app, not a government service."),
    ).toBeTruthy();
  });

  it("Get started navigates to sign-up", async () => {
    const user = userEvent.setup();
    await render(<WelcomeScreen />);

    await user.press(screen.getByText("Get started"));
    expect(mockPush).toHaveBeenCalledWith("/(auth)/sign-up");
  });

  it("I already have an account navigates to sign-in", async () => {
    const user = userEvent.setup();
    await render(<WelcomeScreen />);

    await user.press(screen.getByText("I already have an account"));
    expect(mockPush).toHaveBeenCalledWith("/(auth)/sign-in");
  });
});
