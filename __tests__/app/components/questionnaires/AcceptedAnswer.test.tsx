import { render, screen } from "@testing-library/react";
import { AcceptedAnswer } from "@/app/components/questionnaires/AcceptedAnswer";
import {
  AcceptedUserResponse,
  UserResponseTextType,
  UserResponseArraySelectType,
} from "@/lib/features/user-response/types";

describe("AcceptedAnswer", () => {
  const mockDate = new Date("2024-03-20T10:00:00Z");

  it("renders text response correctly", () => {
    const answer: AcceptedUserResponse<UserResponseTextType> = {
      questionId: "456",
      systemAcceptTime: mockDate.getTime(),
      systemUserResponseId: "123",
      userResponse: { text: "Option A" },
    };

    render(<AcceptedAnswer answer={answer} />);

    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText(/Accepted Answer/)).toBeInTheDocument();
  });

  it("renders array select response correctly", () => {
    const answer: AcceptedUserResponse<UserResponseArraySelectType> = {
      questionId: "456",
      systemAcceptTime: mockDate.getTime(),
      systemUserResponseId: "123",
      userResponse: { selectedOptions: ["Option A", "Option B"] },
    };

    render(<AcceptedAnswer answer={answer} />);

    expect(screen.getByText("Option A, Option B")).toBeInTheDocument();
  });

  it("renders error for unknown response type", () => {
    const answer = {
      questionId: "456",
      systemAcceptTime: mockDate.getTime(),
      systemUserResponseId: "123",
      userResponse: { unknown: "test" },
    };

    render(<AcceptedAnswer answer={answer as any} />);

    // Use a regex to match the text that includes JSON
    expect(screen.getByText(/Unknown response type/)).toBeInTheDocument();
    expect(screen.getByText(/JSON/)).toBeInTheDocument();
  });

  it("handles undefined systemAcceptTime", () => {
    const answer: Partial<AcceptedUserResponse<UserResponseTextType>> = {
      questionId: "456",
      systemAcceptTime: undefined,
      systemUserResponseId: "123",
      userResponse: { text: "Option A" },
    };

    render(
      <AcceptedAnswer
        answer={answer as AcceptedUserResponse<UserResponseTextType>}
      />
    );

    // Should still render the answer text
    expect(screen.getByText("Option A")).toBeInTheDocument();

    // Should render the Accepted Answer text
    expect(screen.getByText(/Accepted Answer/)).toBeInTheDocument();

    // The date should fallback to epoch (Dec 31, 1969)
    expect(screen.getByText(/Accepted at: 12\/31\/1969/)).toBeInTheDocument();
  });
});
