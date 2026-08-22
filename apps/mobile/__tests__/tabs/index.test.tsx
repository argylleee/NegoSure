import { render, screen, userEvent } from "@testing-library/react-native";
import HomeScreen from "../../app/(tabs)/index";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}));

describe("HomeScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders the business summary", async () => {
    await render(<HomeScreen />);
    expect(screen.getByText("Juan's Coffee Shop")).toBeTruthy();
    expect(screen.getByText("Dasmariñas, Cavite")).toBeTruthy();
  });

  it("derives Needs Attention from the shared requirements data (ACTION_REQUIRED only)", async () => {
    await render(<HomeScreen />);
    // From src/data/requirements.ts: only fire-safety is ACTION_REQUIRED.
    // The row's title/subtitle text is consolidated into one accessibility
    // label (importantForAccessibility="no-hide-descendants" on the inner
    // text group), so it's queried by label, not by the hidden Text nodes.
    expect(
      screen.getByLabelText(/Fire Safety Inspection Certificate.*Expires in 12 days/),
    ).toBeTruthy();
    // Sanitary Permit is IN_PROGRESS, not ACTION_REQUIRED — must not appear here.
    expect(screen.queryByText("Sanitary Permit")).toBeNull();
  });

  it("navigates to the requirement detail when an alert row is pressed", async () => {
    const user = userEvent.setup();
    await render(<HomeScreen />);

    await user.press(screen.getByLabelText(/Fire Safety Inspection Certificate/));
    expect(mockPush).toHaveBeenCalledWith("/requirements/fire-safety");
  });

  it("navigates to Requirements when View all is pressed", async () => {
    const user = userEvent.setup();
    await render(<HomeScreen />);

    await user.press(screen.getByText("View all"));
    expect(mockPush).toHaveBeenCalledWith("/(tabs)/requirements");
  });

  it.each([
    ["Scan document", "/(tabs)/documents"],
    ["Requirements", "/(tabs)/requirements"],
    ["Gov't services", "/(tabs)/requirements"],
    ["Ask NegoSure", "/(tabs)/assistant"],
  ])("quick action %s navigates to %s", async (label, route) => {
    const user = userEvent.setup();
    await render(<HomeScreen />);

    await user.press(screen.getByText(label));
    expect(mockPush).toHaveBeenCalledWith(route);
  });
});
