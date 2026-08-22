import { render, screen, userEvent } from "@testing-library/react-native";
import SummaryScreen from "../../app/(onboarding)/summary";
import { useOnboardingStore } from "../../src/store/onboardingStore";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}));

describe("SummaryScreen", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    useOnboardingStore.getState().reset();
    useOnboardingStore.setState({
      facts: [
        { key: "businessType", label: "Business type", value: "Coffee shop", confirmed: true },
        { key: "location", label: "Location", value: "Dasmariñas", confirmed: true },
      ],
      followUps: { physicalStore: true, foodPreparation: true, onlineSelling: false },
    });
  });

  it("renders the confirmed facts and follow-up answers", async () => {
    await render(<SummaryScreen />);
    expect(screen.getByText("Coffee shop")).toBeTruthy();
    expect(screen.getByText("Dasmariñas")).toBeTruthy();
    expect(screen.getByText("Physical store or stall")).toBeTruthy();
    expect(screen.getByText("Prepares food on-site")).toBeTruthy();
    expect(screen.getByText("Sells online")).toBeTruthy();
  });

  it("marks onboarding complete and enters the app when pressed", async () => {
    const user = userEvent.setup();
    await render(<SummaryScreen />);

    expect(useOnboardingStore.getState().hasOnboarded).toBe(false);

    await user.press(screen.getByText("Enter NegoSure"));

    expect(useOnboardingStore.getState().hasOnboarded).toBe(true);
    expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
  });
});
