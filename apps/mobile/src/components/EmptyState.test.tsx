import { render, screen, userEvent } from "@testing-library/react-native";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title and description", async () => {
    await render(<EmptyState title="No requirements yet" description="Check back later." />);
    expect(screen.getByText("No requirements yet")).toBeTruthy();
    expect(screen.getByText("Check back later.")).toBeTruthy();
  });

  it("omits the action when no handler is given", async () => {
    await render(<EmptyState title="No requirements yet" />);
    expect(screen.queryByText("Scan a document")).toBeNull();
  });

  it("fires onAction when the action is pressed", async () => {
    const user = userEvent.setup();
    const onAction = jest.fn();
    await render(
      <EmptyState title="No documents" actionLabel="Scan a document" onAction={onAction} />,
    );

    await user.press(screen.getByText("Scan a document"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
