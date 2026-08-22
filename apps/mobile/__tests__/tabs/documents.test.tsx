import { render, screen } from "@testing-library/react-native";
import DocumentsScreen from "../../app/(tabs)/documents";

// Rows are `accessible` (whole subtree collapses into one accessibility
// node), so they're queried by label, not by the inner hidden Text nodes.
describe("DocumentsScreen", () => {
  it("shows the total document count", async () => {
    await render(<DocumentsScreen />);
    expect(screen.getByText("4 documents")).toBeTruthy();
  });

  it("renders each document with its name, category, status, and meta", async () => {
    await render(<DocumentsScreen />);
    expect(
      screen.getByLabelText(
        "DTI Business Name Certificate, Registration, Verified, Uploaded Jul 3",
      ),
    ).toBeTruthy();
    expect(
      screen.getByLabelText(
        "Fire Safety Inspection Certificate, Fire Safety, Expiring soon, Expires in 12 days",
      ),
    ).toBeTruthy();
    expect(
      screen.getByLabelText("Business Permit (previous year), Permit, Expired, Expired Jun 30"),
    ).toBeTruthy();
    expect(
      screen.getByLabelText("Sanitary Permit Application, Health, Analyzing, Uploaded 2 hours ago"),
    ).toBeTruthy();
  });

  it("shows the VERIFIED stamp only for verified documents", async () => {
    await render(<DocumentsScreen />);
    // Only one of the four placeholder documents is "verified".
    expect(screen.getAllByText("VERIFIED")).toHaveLength(1);
  });
});
