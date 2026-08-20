import { render, screen } from "@testing-library/react-native";
import { TallyBox } from "./TallyBox";

describe("TallyBox", () => {
  it("renders empty with no check or dot", async () => {
    await render(<TallyBox state="empty" />);
    expect(screen.queryByTestId("tally-box-check")).toBeNull();
    expect(screen.queryByTestId("tally-box-dot")).toBeNull();
  });

  it("renders a dot for the dotted state", async () => {
    await render(<TallyBox state="dotted" />);
    expect(screen.getByTestId("tally-box-dot")).toBeTruthy();
    expect(screen.queryByTestId("tally-box-check")).toBeNull();
  });

  it("renders a check for the checked state", async () => {
    await render(<TallyBox state="checked" />);
    expect(screen.getByTestId("tally-box-check")).toBeTruthy();
    expect(screen.queryByTestId("tally-box-dot")).toBeNull();
  });
});
