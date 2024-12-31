import "@testing-library/jest-dom";
import { render, screen } from "../test-utils";
// import Page from "../app/page";
import Page from "../../app/page";

describe("Page", () => {
  it("renders a heading", () => {
    render(<Page />);

    const appWelcomeMessage = screen.getByText("Welcome to How Do You Know"); // .getAllByRole("button");

    expect(appWelcomeMessage).toBeInTheDocument();
  });
});
