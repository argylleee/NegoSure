import { render, screen, userEvent } from "@testing-library/react-native";
import ApplicationTrackingScreen from "../../app/applications/[id]";

const mockBack = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: mockBack, replace: jest.fn() }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

describe("ApplicationTrackingScreen", () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it("shows a not-found message when no application record exists for the id", async () => {
    // fire-safety is a real requirement but has no application record.
    mockUseLocalSearchParams.mockReturnValue({ id: "fire-safety" });
    await render(<ApplicationTrackingScreen />);
    expect(screen.getByText("No application on file yet.")).toBeTruthy();
  });

  it("renders the requirement title, provider, and reference number", async () => {
    mockUseLocalSearchParams.mockReturnValue({ id: "business-permit" });
    await render(<ApplicationTrackingScreen />);

    expect(screen.getByText("Business Permit Renewal")).toBeTruthy();
    expect(screen.getByText("eLGU · Ref ELG-2026-004821")).toBeTruthy();
  });

  it("renders each timeline event with its completion state and date", async () => {
    mockUseLocalSearchParams.mockReturnValue({ id: "business-permit" });
    await render(<ApplicationTrackingScreen />);

    expect(screen.getByLabelText("Application submitted, completed, Aug 18")).toBeTruthy();
    expect(screen.getByLabelText("Under review, completed, Aug 19")).toBeTruthy();
    expect(screen.getByLabelText("Approved, pending, Pending")).toBeTruthy();
    expect(screen.getByLabelText("Permit released, pending, Pending")).toBeTruthy();
  });

  it("Back navigates back", async () => {
    mockUseLocalSearchParams.mockReturnValue({ id: "business-permit" });
    const user = userEvent.setup();
    await render(<ApplicationTrackingScreen />);

    await user.press(screen.getByText("‹ Back"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
