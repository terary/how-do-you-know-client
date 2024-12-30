import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { UserResponseHistory } from "@/app/components/questionnaires/UserResponseHistory";
import { TQuestionAny } from "@/app/questionnaires/types";

describe("UserResponseHistory", () => {
  const mockQuestion: TQuestionAny = {
    questionId: "123",
    userPromptType: "text",
    userPromptText: "Sample question",
    userResponseType: "one-of-4",
    choices: [
      { labelText: "Option A", value: "A" },
      { labelText: "Option B", value: "B" },
    ],
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
    validAnswers: [],
  } as any;

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

  it("renders history count correctly", () => {
    render(
      <Provider store={store}>
        <UserResponseHistory question={mockQuestion} />
      </Provider>
    );

    // Check for separate elements
    expect(screen.getByText("Response History")).toBeInTheDocument();
    expect(screen.getByText("(2)")).toBeInTheDocument();
  });

  it("toggles history visibility when clicked", async () => {
    render(
      <Provider store={store}>
        <UserResponseHistory question={mockQuestion} />
      </Provider>
    );

    // Initially history should be hidden
    expect(screen.queryByText("Response #2")).not.toBeInTheDocument();

    // Click to expand
    const expandLink = screen.getByText(/\(\d+\)/); // Match any number in parentheses
    await act(async () => {
      fireEvent.click(expandLink);
    });

    // History should now be visible
    expect(screen.getByText("Response #2")).toBeInTheDocument();
    expect(screen.getByText("Response #1")).toBeInTheDocument();

    // Click again to collapse
    await act(async () => {
      fireEvent.click(expandLink);
    });

    // History should be hidden again
    expect(screen.queryByText("Response #2")).not.toBeInTheDocument();
  });

  it("handles single history item", () => {
    const questionWithSingleHistory = {
      ...mockQuestion,
      userResponseHistory: [mockQuestion?.userResponseHistory?.[0]],
    };

    render(
      <Provider store={store}>
        <UserResponseHistory question={questionWithSingleHistory} />
      </Provider>
    );

    // Check for separate elements
    expect(screen.getByText("Response History")).toBeInTheDocument();
    expect(screen.getByText("(1)")).toBeInTheDocument();

    // Click to expand
    const expandLink = screen.getByText(/\(1\)/);
    fireEvent.click(expandLink);

    // Should not show multiple history items for single response
    expect(screen.queryByText("Response #1")).not.toBeInTheDocument();
  });

  it("handles undefined userResponseHistory", () => {
    const questionWithNoHistory = {
      ...mockQuestion,
      userResponseHistory: undefined,
    };

    render(
      <Provider store={store}>
        <UserResponseHistory question={questionWithNoHistory} />
      </Provider>
    );

    // Check for separate elements
    expect(screen.getByText("Response History")).toBeInTheDocument();
    expect(screen.getByText("(0)")).toBeInTheDocument();
  });

  it("displays response details when expanded", async () => {
    render(
      <Provider store={store}>
        <UserResponseHistory question={mockQuestion} />
      </Provider>
    );

    // Click to expand
    const expandLink = screen.getByText(/\(\d+\)/);
    await act(async () => {
      fireEvent.click(expandLink);
    });

    // Get all responses
    const responses = screen.getAllByText(/Response #\d/);
    expect(responses).toHaveLength(2);

    // Verify response details are shown
    // Using container to get the first response section
    const responseDetails = screen.getByText(/Response #2/).closest("div");
    expect(responseDetails).toHaveTextContent("Question ID: 123");
    expect(responseDetails).toHaveTextContent("Type: one-of-4");
    expect(responseDetails).toHaveTextContent(
      "systemAcceptTimeUtc: 2024-03-21T10:00:00Z"
    );
    expect(responseDetails).toHaveTextContent(/Response: {"text":"Option B"}/);
  });

  it("handles empty userResponseHistory array", () => {
    const questionWithEmptyHistory = {
      ...mockQuestion,
      userResponseHistory: [],
    };

    render(
      <Provider store={store}>
        <UserResponseHistory question={questionWithEmptyHistory} />
      </Provider>
    );

    // Check for separate elements
    expect(screen.getByText("Response History")).toBeInTheDocument();
    expect(screen.getByText("(0)")).toBeInTheDocument();

    // Click to expand
    const expandLink = screen.getByText("(0)");
    fireEvent.click(expandLink);

    // Should not show any history items
    expect(screen.queryByText(/Response #/)).not.toBeInTheDocument();
  });

  it("handles undefined question prop", () => {
    render(
      <Provider store={store}>
        {/* @ts-ignore - intentionally passing undefined for testing */}
        <UserResponseHistory question={undefined} />
      </Provider>
    );

    // Should still render the basic structure with zero count
    expect(screen.getByText("Response History")).toBeInTheDocument();
    expect(screen.getByText("(0)")).toBeInTheDocument();
  });

  it("handles undefined userResponseHistory in question", () => {
    const questionWithUndefinedHistory = {
      ...mockQuestion,
      userResponseHistory: undefined,
    };

    render(
      <Provider store={store}>
        <UserResponseHistory question={questionWithUndefinedHistory} />
      </Provider>
    );

    // Should render with zero count
    expect(screen.getByText("Response History")).toBeInTheDocument();
    expect(screen.getByText("(0)")).toBeInTheDocument();

    // Verify the click behavior still works
    const expandLink = screen.getByText("(0)");
    fireEvent.click(expandLink);

    // Should not show any history items
    expect(screen.queryByText(/Response #/)).not.toBeInTheDocument();
  });
});
