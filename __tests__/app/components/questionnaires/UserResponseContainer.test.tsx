import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { UserResponseContainer } from "@/app/components/questionnaires/UserResponseContainer";
import { TQuestionAny } from "@/app/questionnaires/types";

// Mock the dependent components
jest.mock("@/app/components/questionnaires/UserResponse", () => ({
  UserResponse: () => (
    <div data-testid="mock-user-response">Mock User Response</div>
  ),
}));

jest.mock("@/app/components/questionnaires/AcceptedAnswer", () => ({
  AcceptedAnswer: ({ answer }: any) => (
    <div data-testid="mock-accepted-answer">
      Accepted Answer: {answer.userResponse.text}
    </div>
  ),
}));

jest.mock("@/app/components/questionnaires/PreviousAnswers", () => ({
  PreviousAnswers: ({ answers }: any) => (
    <div data-testid="mock-previous-answers">
      Previous Answers: {answers.length}
    </div>
  ),
}));

describe("UserResponseContainer", () => {
  const mockQuestion: TQuestionAny = {
    questionId: "123",
    userPromptType: "text",
    userPromptText: "Sample question",
    userResponseType: "one-of-4",
    choices: [
      { labelText: "Option A", value: "A" },
      { labelText: "Option B", value: "B" },
    ],
    validAnswers: [],
    userResponseHistory: [],
  } as any;

  const mockQuestionWithHistory: TQuestionAny = {
    ...mockQuestion,
    userResponseHistory: [
      {
        questionId: "123",
        userResponseType: "one-of-4",
        userResponse: { text: "Option A" },
        systemAcceptTimeUtc: "2024-03-20T10:00:00Z",
      },
      {
        questionId: "123",
        userResponseType: "one-of-4",
        userResponse: { text: "Option B" },
        systemAcceptTimeUtc: "2024-03-21T10:00:00Z",
      },
    ],
  };

  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        userResponseUI: (
          state = {
            draftResponses: {},
            isEditing: false,
          },
          action: any
        ) => {
          return state;
        },
      },
    });
  });

  it("renders UserResponse when no history exists", () => {
    render(
      <Provider store={store}>
        <UserResponseContainer question={mockQuestion} />
      </Provider>
    );

    expect(screen.getByTestId("mock-user-response")).toBeInTheDocument();
  });

  it("renders AcceptedAnswer and edit button when history exists", () => {
    render(
      <Provider store={store}>
        <UserResponseContainer question={mockQuestionWithHistory} />
      </Provider>
    );

    expect(screen.getByTestId("mock-accepted-answer")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /change answer/i })
    ).toBeInTheDocument();
  });

  it("toggles between edit mode and view mode", async () => {
    render(
      <Provider store={store}>
        <UserResponseContainer question={mockQuestionWithHistory} />
      </Provider>
    );

    // Click edit button
    const editButton = screen.getByRole("button", { name: /change answer/i });
    await act(async () => {
      fireEvent.click(editButton);
    });

    // Verify UserResponse is shown and cancel button appears
    expect(screen.getByTestId("mock-user-response")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cancel edit/i })
    ).toBeInTheDocument();

    // Click cancel button
    const cancelButton = screen.getByRole("button", { name: /cancel edit/i });
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    // Verify back to view mode
    expect(
      screen.getByRole("button", { name: /change answer/i })
    ).toBeInTheDocument();
  });

  it("shows previous answers when history has more than one entry", () => {
    render(
      <Provider store={store}>
        <UserResponseContainer question={mockQuestionWithHistory} />
      </Provider>
    );

    expect(screen.getByTestId("mock-previous-answers")).toBeInTheDocument();
  });

  it("handles undefined question", () => {
    render(
      <Provider store={store}>
        <UserResponseContainer question={undefined as any} />
      </Provider>
    );

    // Component should render nothing when question is undefined
    expect(screen.queryByTestId("mock-user-response")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("handles undefined userResponseHistory", () => {
    const questionWithUndefinedHistory: TQuestionAny = {
      ...mockQuestion,
      userResponseHistory: undefined,
    };

    render(
      <Provider store={store}>
        <UserResponseContainer question={questionWithUndefinedHistory} />
      </Provider>
    );

    expect(screen.getByTestId("mock-user-response")).toBeInTheDocument();
  });

  it("updates edit mode when history changes", async () => {
    const { rerender } = render(
      <Provider store={store}>
        <UserResponseContainer question={mockQuestion} />
      </Provider>
    );

    // Initially should show UserResponse (no history)
    expect(screen.getByTestId("mock-user-response")).toBeInTheDocument();

    // Update question with history
    await act(async () => {
      rerender(
        <Provider store={store}>
          <UserResponseContainer question={mockQuestionWithHistory} />
        </Provider>
      );
    });

    // Should now show AcceptedAnswer and not be in edit mode
    expect(screen.getByTestId("mock-accepted-answer")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /change answer/i })
    ).toBeInTheDocument();
  });
});
