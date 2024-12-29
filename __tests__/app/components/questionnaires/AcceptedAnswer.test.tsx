import { render, screen } from "@testing-library/react";
import { AcceptedAnswer } from "@/app/components/questionnaires/AcceptedAnswer";
import { TUserResponse } from "@/lib/features/user-response/types";

describe("AcceptedAnswer", () => {
  const mockDate = new Date("2024-03-20T10:00:00Z");

  const baseAnswer: TUserResponse = {
    // @ts-ignore - linting doesn't like the shape of this object (testing?)
    systemAcceptTimeUtc: mockDate.toISOString(),
    userResponseId: "123",
    questionId: "456",
    userId: "789",
  };

  it("renders one-of-4 response correctly", () => {
    const answer: TUserResponse = {
      ...baseAnswer,
      userResponseType: "one-of-4",
      userResponse: { text: "Option A" },
    };

    render(<AcceptedAnswer answer={answer} />);

    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText(/Accepted Answer/)).toBeInTheDocument();
  });

  it("renders any-of response correctly", () => {
    const answer: TUserResponse = {
      ...baseAnswer,
      userResponseType: "any-of",
      // @ts-ignore - linting doesn't like the shape of this object (testing?)
      userResponse: { selectedOptions: ["Option A", "Option B"] },
    };

    render(<AcceptedAnswer answer={answer} />);

    expect(screen.getByText("Option A, Option B")).toBeInTheDocument();
  });

  it("renders one-of-2 response correctly", () => {
    const answer: TUserResponse = {
      ...baseAnswer,
      userResponseType: "one-of-2",
      userResponse: { text: "Yes" },
    };

    render(<AcceptedAnswer answer={answer} />);

    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("renders free-text-255 response correctly", () => {
    const answer: TUserResponse = {
      ...baseAnswer,
      userResponseType: "free-text-255",
      userResponse: { text: "Some free text response" },
    };

    render(<AcceptedAnswer answer={answer} />);

    expect(screen.getByText("Some free text response")).toBeInTheDocument();
  });

  it("renders error for unknown response type", () => {
    // @ts-ignore - linting doesn't like the shape of this object (testing?)
    const answer = {
      ...baseAnswer,
      userResponseType: "unknown-type",
      userResponse: { text: "test" },
    };

    render(<AcceptedAnswer answer={answer as any} />);

    expect(screen.getByText(/Unknown response type:/)).toBeInTheDocument();
  });

  it("handles undefined systemAcceptTimeUtc", () => {
    const answer: TUserResponse = {
      ...baseAnswer,
      systemAcceptTimeUtc: undefined,
      userResponseType: "one-of-4",
      userResponse: { text: "Option A" },
    };

    render(<AcceptedAnswer answer={answer} />);

    // Should still render the answer text
    expect(screen.getByText("Option A")).toBeInTheDocument();

    // Should render the Accepted Answer text
    expect(screen.getByText(/Accepted Answer/)).toBeInTheDocument();

    // The date should fallback to epoch (Jan 1, 1970) due to the || 0
    const dateElement = screen.getByText(/submitted/);
    expect(dateElement).toBeInTheDocument();
  });
});
