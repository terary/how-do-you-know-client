import "@testing-library/jest-dom";
import { render, screen } from "../test-utils";
// import Page from "../app/page";
import Page from "../../app/page";

describe("Page", () => {
  it("renders a heading", () => {
    render(<Page />);

    const buttons = screen.getAllByRole("button");

    expect(buttons.length).toBe(5);
    // expect(buttons).toBeInTheDocument();
  });
});
