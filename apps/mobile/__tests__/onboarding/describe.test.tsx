import { render, screen, userEvent } from "@testing-library/react-native";
import DescribeScreen from "../../app/(onboarding)/describe";
import { useOnboardingStore } from "../../src/store/onboardingStore";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}));

describe("DescribeScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
    useOnboardingStore.getState().reset();
  });

  it("Continue is disabled with no text, and pressing it does nothing", async () => {
    const user = userEvent.setup();
    await render(<DescribeScreen />);

    await user.press(screen.getByText("Continue"));

    expect(mockPush).not.toHaveBeenCalled();
    expect(useOnboardingStore.getState().description).toBe("");
  });

  it("typing a description and continuing extracts facts and navigates to confirm", async () => {
    const user = userEvent.setup();
    await render(<DescribeScreen />);

    await user.type(
      screen.getByLabelText("Describe your business"),
      "I'm opening a small coffee shop in Dasmariñas.",
    );
    await user.press(screen.getByText("Continue"));

    const state = useOnboardingStore.getState();
    expect(state.description).toBe("I'm opening a small coffee shop in Dasmariñas.");
    // Real extraction (not mocked) — this locks in the placeholder
    // heuristic's contract: every extracted fact starts unconfirmed.
    expect(state.facts.length).toBeGreaterThan(0);
    expect(state.facts.every((f) => f.confirmed === false)).toBe(true);
    expect(mockPush).toHaveBeenCalledWith("/(onboarding)/confirm");
  });
});
