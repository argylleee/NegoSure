import { render, screen, userEvent } from "@testing-library/react-native";
import RequirementsScreen from "../../app/(tabs)/requirements";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}));

// Row title/status/source text is consolidated into one accessibility label
// (importantForAccessibility="no-hide-descendants" on the inner groups), so
// rows are queried by label, not by the hidden Text nodes underneath.
describe("RequirementsScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("shows all requirements under the All filter by default", async () => {
    await render(<RequirementsScreen />);
    expect(screen.getByLabelText(/^Fire Safety Inspection Certificate/)).toBeTruthy();
    expect(screen.getByLabelText(/^Sanitary Permit/)).toBeTruthy();
    expect(screen.getByLabelText(/^Business Permit Renewal/)).toBeTruthy();
    expect(screen.getByLabelText(/^BIR Certificate of Registration/)).toBeTruthy();
  });

  it("filter chips actually filter the list (previously dead UI, no onPress at all)", async () => {
    const user = userEvent.setup();
    await render(<RequirementsScreen />);

    await user.press(screen.getByText("Action required"));

    expect(screen.getByLabelText(/^Fire Safety Inspection Certificate/)).toBeTruthy();
    expect(screen.queryByLabelText(/^Sanitary Permit/)).toBeNull();
    expect(screen.queryByLabelText(/^Business Permit Renewal/)).toBeNull();
    expect(screen.queryByLabelText(/^BIR Certificate of Registration/)).toBeNull();
  });

  it("switching back to All restores the full list", async () => {
    const user = userEvent.setup();
    await render(<RequirementsScreen />);

    await user.press(screen.getByText("Settled"));
    expect(screen.queryByLabelText(/^Fire Safety Inspection Certificate/)).toBeNull();

    await user.press(screen.getByText("All"));
    expect(screen.getByLabelText(/^Fire Safety Inspection Certificate/)).toBeTruthy();
    expect(screen.getByLabelText(/^BIR Certificate of Registration/)).toBeTruthy();
  });

  it("navigates to the requirement detail when a row is pressed", async () => {
    const user = userEvent.setup();
    await render(<RequirementsScreen />);

    await user.press(screen.getByLabelText(/^Sanitary Permit/));
    expect(mockPush).toHaveBeenCalledWith("/requirements/sanitary-permit");
  });
});
