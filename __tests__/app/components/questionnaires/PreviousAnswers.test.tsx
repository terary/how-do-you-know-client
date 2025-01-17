import { render, screen, fireEvent } from "@testing-library/react";
import { PreviousAnswers } from "@/app/components/questionnaires/PreviousAnswers";
import {
  AcceptedUserResponse,
  UserResponseTextType,
  UserResponseArraySelectType,
} from "@/lib/features/user-response/types";

describe("PreviousAnswers", () => {
  const mockAnswers: AcceptedUserResponse<UserResponseTextType>[] = [
    {
      questionId: "123",
      userResponse: { text: "Option A" },
      systemAcceptTime: 1710928800000,
      systemUserResponseId: "1",
    },
    {
      questionId: "123",
      userResponse: { text: "Option B" },
      systemAcceptTime: 1711015200000,
      systemUserResponseId: "2",
    },
    {
      questionId: "123",
      userResponse: { text: "Option C" },
      systemAcceptTime: 1711101600000,
      systemUserResponseId: "3",
    },
  ];

  it("renders previous answers header", () => {
    render(<PreviousAnswers answers={mockAnswers} />);
    expect(screen.getByText("Previous Answers")).toBeInTheDocument();
  });

  it("renders all answers except the most recent", () => {
    render(<PreviousAnswers answers={mockAnswers} />);

    // Click show button
    fireEvent.click(screen.getByText("Show"));

    // Should show only previous answers (excluding most recent)
    const answers = screen.getAllByText(/accepted at:/);
    expect(answers).toHaveLength(2);
  });

  it("handles single answer", () => {
    const singleAnswer = [mockAnswers[0]];
    render(<PreviousAnswers answers={singleAnswer} />);

    // Click show button
    fireEvent.click(screen.getByText("Show"));

    // Should show no answers since the only answer is the most recent
    expect(screen.queryByText(/accepted at:/)).not.toBeInTheDocument();
  });

  it("handles empty answers array", () => {
    render(<PreviousAnswers answers={[]} />);

    // Click show button
    fireEvent.click(screen.getByText("Show"));

    // Should show no answers
    expect(screen.queryByText(/accepted at:/)).not.toBeInTheDocument();
  });

  it("handles undefined answers prop", () => {
    // @ts-ignore - intentionally passing undefined for testing
    render(<PreviousAnswers answers={undefined} />);

    // Click show button
    fireEvent.click(screen.getByText("Show"));

    // Should show no answers
    expect(screen.queryByText(/accepted at:/)).not.toBeInTheDocument();
  });

  it("displays formatted dates", () => {
    render(<PreviousAnswers answers={mockAnswers} />);

    // Click show button
    fireEvent.click(screen.getByText("Show"));

    // Check for formatted dates
    expect(screen.getByText(/3\/20\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/3\/21\/2024/)).toBeInTheDocument();
  });

  it("displays answers in reverse chronological order", () => {
    render(<PreviousAnswers answers={mockAnswers} />);

    fireEvent.click(screen.getByText("Show"));

    const answerElements = screen.getAllByText(/{"text":"Option [AB]"}/);
    expect(answerElements[0]).toHaveTextContent('{"text":"Option B"}');
    expect(answerElements[1]).toHaveTextContent('{"text":"Option A"}');
  });

  it("handles different response types", () => {
    const mixedAnswers: AcceptedUserResponse<
      UserResponseTextType | UserResponseArraySelectType
    >[] = [
      {
        questionId: "123",
        userResponse: { text: "Text response" },
        systemAcceptTime: 1710928800000,
        systemUserResponseId: "1",
      },
      {
        questionId: "123",
        userResponse: { selectedOptions: ["A", "B"] },
        systemAcceptTime: 1711015200000,
        systemUserResponseId: "2",
      },
      {
        questionId: "123",
        userResponse: { text: "Option C" },
        systemAcceptTime: 1711101600000,
        systemUserResponseId: "3",
      },
    ];

    render(<PreviousAnswers answers={mixedAnswers} />);

    fireEvent.click(screen.getByText("Show"));

    // Should show the two older answers with different types
    expect(screen.getByText(/{"text":"Text response"}/)).toBeInTheDocument();
    expect(
      screen.getByText(/{"selectedOptions":\["A","B"\]}/)
    ).toBeInTheDocument();
    // Should not show the most recent answer
    expect(screen.queryByText(/{"text":"Option C"}/)).not.toBeInTheDocument();
  });

  it("handles undefined systemAcceptTime", () => {
    const answersWithUndefinedTime: AcceptedUserResponse<UserResponseTextType>[] =
      [
        {
          questionId: "123",
          userResponse: { text: "Option A" },
          systemAcceptTime: 0,
          systemUserResponseId: "1",
        },
        {
          questionId: "123",
          userResponse: { text: "Option B" },
          systemAcceptTime: 0,
          systemUserResponseId: "2",
        },
      ];

    render(<PreviousAnswers answers={answersWithUndefinedTime} />);
    fireEvent.click(screen.getByText("Show"));

    expect(screen.getByText(/accepted at: 12\/31\/1969/)).toBeInTheDocument();
  });
});
