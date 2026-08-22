import { render, screen, userEvent } from "@testing-library/react-native";
import ConfirmScreen from "../../app/(onboarding)/confirm";
import { useOnboardingStore } from "../../src/store/onboardingStore";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}));

const seedFacts = [
  { key: "businessType", label: "Business type", value: "Coffee shop", confirmed: false },
  { key: "location", label: "Location", value: "Dasmariñas", confirmed: false },
];

describe("ConfirmScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
    useOnboardingStore.getState().reset();
    useOnboardingStore.setState({ facts: seedFacts.map((f) => ({ ...f })) });
  });

  it("starts with Continue disabled until every fact is confirmed and every follow-up answered", async () => {
    await render(<ConfirmScreen />);
    const continueButton = screen.getByLabelText("Continue");
    expect(continueButton.props.accessibilityState.disabled).toBe(true);
  });

  it("tapping a fact row toggles its confirmed state without affecting the other fact", async () => {
    const user = userEvent.setup();
    await render(<ConfirmScreen />);

    await user.press(screen.getByLabelText("Business type: Coffee shop"));

    const facts = useOnboardingStore.getState().facts;
    expect(facts.find((f) => f.key === "businessType")?.confirmed).toBe(true);
    expect(facts.find((f) => f.key === "location")?.confirmed).toBe(false);
  });

  it("enables Continue once all facts are confirmed and all follow-ups answered, then navigates", async () => {
    const user = userEvent.setup();
    await render(<ConfirmScreen />);

    await user.press(screen.getByLabelText("Business type: Coffee shop"));
    await user.press(screen.getByLabelText("Location: Dasmariñas"));
    await user.press(screen.getByLabelText("Do you have a physical store or stall?: Yes"));
    await user.press(screen.getByLabelText("Do you prepare or cook food on-site?: Yes"));
    await user.press(screen.getByLabelText("Do you also sell online?: No"));

    expect(screen.getByLabelText("Continue").props.accessibilityState.disabled).toBe(false);

    await user.press(screen.getByLabelText("Continue"));
    expect(mockPush).toHaveBeenCalledWith("/(onboarding)/summary");
  });
});
