import { render, screen, userEvent } from "@testing-library/react-native";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("renders default title and description", async () => {
    await render(<ErrorState />);
    expect(screen.getByText("Something went wrong")).toBeTruthy();
  });

  it("renders custom title and description", async () => {
    await render(
      <ErrorState title="Couldn't load requirements" description="Try again shortly." />,
    );
    expect(screen.getByText("Couldn't load requirements")).toBeTruthy();
    expect(screen.getByText("Try again shortly.")).toBeTruthy();
  });

  it("fires onRetry when Try again is pressed", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    await render(<ErrorState onRetry={onRetry} />);

    await user.press(screen.getByText("Try again"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("omits the retry button when no handler is given", async () => {
    await render(<ErrorState />);
    expect(screen.queryByText("Try again")).toBeNull();
  });
});
