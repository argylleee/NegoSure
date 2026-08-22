import { render, screen, userEvent } from "@testing-library/react-native";
import RequirementDetailScreen from "../../app/requirements/[id]";

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, back: mockBack, replace: jest.fn() }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

describe("RequirementDetailScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
  });

  it("shows a not-found message for an unknown id", async () => {
    mockUseLocalSearchParams.mockReturnValue({ id: "does-not-exist" });
    await render(<RequirementDetailScreen />);
    expect(screen.getByText("Requirement not found.")).toBeTruthy();
  });

  it("renders full detail with the eLGU government-service labeling (MOBILE_UI.md §5)", async () => {
    mockUseLocalSearchParams.mockReturnValue({ id: "fire-safety" });
    await render(<RequirementDetailScreen />);

    expect(screen.getByText("Action required")).toBeTruthy();
    expect(screen.getByText("Fire Safety Inspection Certificate")).toBeTruthy();
    expect(screen.getByText("BFP")).toBeTruthy();
    expect(screen.getByText("Official government service")).toBeTruthy();
    expect(screen.getByText("Provider: eLGU")).toBeTruthy();
    expect(screen.getByText("Status synced: 2 hours ago")).toBeTruthy();
    // No application record exists for fire-safety.
    expect(screen.queryByText("Track application")).toBeNull();
  });

  it("renders the portal-only government-service labeling when no integration exists", async () => {
    mockUseLocalSearchParams.mockReturnValue({ id: "sanitary-permit" });
    await render(<RequirementDetailScreen />);

    expect(screen.getByText("Official portal")).toBeTruthy();
    expect(screen.getByText("No direct NegoSure integration")).toBeTruthy();
  });

  it("shows Track application only when an application record exists, and navigates to it", async () => {
    mockUseLocalSearchParams.mockReturnValue({ id: "business-permit" });
    const user = userEvent.setup();
    await render(<RequirementDetailScreen />);

    await user.press(screen.getByText("Track application"));
    expect(mockPush).toHaveBeenCalledWith("/applications/business-permit");
  });

  it("Back navigates back", async () => {
    mockUseLocalSearchParams.mockReturnValue({ id: "fire-safety" });
    const user = userEvent.setup();
    await render(<RequirementDetailScreen />);

    await user.press(screen.getByText("‹ Back"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
