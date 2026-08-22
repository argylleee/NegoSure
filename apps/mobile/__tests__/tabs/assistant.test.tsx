import { render, screen, userEvent } from "@testing-library/react-native";
import AssistantScreen from "../../app/(tabs)/assistant";

describe("AssistantScreen", () => {
  it("shows the empty state before anything is asked", async () => {
    await render(<AssistantScreen />);
    expect(screen.getByTestId("empty-state")).toBeTruthy();
    expect(screen.getByText("Ask your first question")).toBeTruthy();
  });

  it("shows the answer contract (question, confidence, sources, warning) after asking", async () => {
    const user = userEvent.setup();
    await render(<AssistantScreen />);

    // A long typed string exceeds the default 5s test timeout with
    // userEvent's per-character interaction — not a bug in the screen.
    await user.type(
      screen.getByTestId("assistant-input"),
      "Do I need a Fire Safety Inspection Certificate?",
    );
    await user.press(screen.getByTestId("assistant-ask"));

    expect(screen.queryByTestId("empty-state")).toBeNull();
    expect(screen.getByText("Do I need a Fire Safety Inspection Certificate?")).toBeTruthy();
    expect(screen.getByText("Confidence")).toBeTruthy();
    expect(screen.getByText("High")).toBeTruthy();
    expect(screen.getByText("Sources")).toBeTruthy();
  }, 15000);

  it("does not submit an empty question", async () => {
    const user = userEvent.setup();
    await render(<AssistantScreen />);

    await user.press(screen.getByTestId("assistant-ask"));

    expect(screen.getByTestId("empty-state")).toBeTruthy();
  });
});
