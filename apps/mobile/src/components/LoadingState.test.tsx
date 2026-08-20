import { render, screen } from "@testing-library/react-native";
import { LoadingState } from "./LoadingState";

describe("LoadingState", () => {
  it("renders with the default label", async () => {
    await render(<LoadingState />);
    expect(screen.getByTestId("loading-state")).toBeTruthy();
    expect(screen.getByText("Loading")).toBeTruthy();
  });

  it("renders a custom label", async () => {
    await render(<LoadingState label="Fetching requirements" />);
    expect(screen.getByText("Fetching requirements")).toBeTruthy();
  });
});
