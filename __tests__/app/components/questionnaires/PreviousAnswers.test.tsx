import { render, screen, fireEvent } from "@testing-library/react";
import { PreviousAnswers } from "@/app/components/questionnaires/PreviousAnswers";
// import { TUserResponse } from "@/app/questionnaires/types";
import { TUserResponse } from "@/lib/features/user-response/types";
describe("PreviousAnswers", () => {
  const mockAnswers: TUserResponse[] = [
    {
      questionId: "123",
      userResponseType: "one-of-4",
      userResponse: { text: "Option A" },
      systemAcceptTimeUtc: 1710928800000,
    },
    {
      questionId: "123",
      userResponseType: "one-of-4",
      userResponse: { text: "Option B" },
      systemAcceptTimeUtc: 1711015200000,
    },
    {
      questionId: "123",
      userResponseType: "one-of-4",
      userResponse: { text: "Option C" },
      systemAcceptTimeUtc: 1711101600000,
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
    const mixedAnswers: TUserResponse[] = [
      {
        questionId: "123",
        userResponseType: "free-text-255",
        userResponse: { text: "Text response" },
        systemAcceptTimeUtc: 1710928800000,
      },
      {
        questionId: "123",
        userResponseType: "any-of",
        // @ts-ignore - 'selectedOptions' is not {'text': string}
        userResponse: { selectedOptions: ["A", "B"] },
        systemAcceptTimeUtc: 1711015200000,
      },
      {
        questionId: "123",
        userResponseType: "one-of-4",
        userResponse: { text: "Option C" },
        systemAcceptTimeUtc: 1711101600000,
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

  it("handles undefined systemAcceptTimeUtc", () => {
    const answersWithUndefinedTime = [
      {
        questionId: "123",
        userResponseType: "one-of-4",
        userResponse: { text: "Option A" },
        systemAcceptTimeUtc: undefined,
      },
      {
        questionId: "123",
        userResponseType: "one-of-4",
        userResponse: { text: "Option B" },
        systemAcceptTimeUtc: undefined,
      },
    ];

    render(<PreviousAnswers answers={answersWithUndefinedTime as any} />);
    fireEvent.click(screen.getByText("Show"));

    expect(screen.getByText(/accepted at: 12\/31\/1969/)).toBeInTheDocument();
  });
});
