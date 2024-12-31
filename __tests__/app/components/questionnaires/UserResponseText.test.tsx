import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { UserResponseText } from "@/app/components/questionnaires/UserResponseText";
import { useSetUserResponseMutation } from "@/lib/features/user-response/userResponseApiSlice";

// Mock the RTK Query hook
jest.mock("@/lib/features/user-response/userResponseApiSlice", () => ({
  useSetUserResponseMutation: jest.fn(),
}));

describe("UserResponseText", () => {
  const mockQuestion = {
    questionId: "123",
    userPromptType: "text",
    userPromptText: "Sample question",
    userResponseType: "free-text-255",
    validAnswers: [],
    userResponse: { text: null },
  } as any;

  const mockSetUserResponse = jest.fn();
  let store: any;
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

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
          if (action.type === "userResponseUI/setDraftResponse") {
            return {
              ...state,
              draftResponses: {
                ...state.draftResponses,
                [action.payload.questionId]: { text: action.payload.text },
              },
            };
          }
          return state;
        },
      },
    });

    (useSetUserResponseMutation as jest.Mock).mockReturnValue([
      mockSetUserResponse,
      { isLoading: false },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockClear();
  });

  it("renders text input field", () => {
    render(
      <Provider store={store}>
        <UserResponseText question={mockQuestion} />
      </Provider>
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("handles text input changes", async () => {
    render(
      <Provider store={store}>
        <UserResponseText question={mockQuestion} />
      </Provider>
    );

    const input = screen.getByRole("textbox");
    await act(async () => {
      fireEvent.change(input, { target: { value: "test response" } });
    });

    expect(input).toHaveValue("test response");
    expect(store.getState().userResponseUI.draftResponses["123"]).toEqual({
      text: "test response",
    });
  });

  it("handles save button click", async () => {
    render(
      <Provider store={store}>
        <UserResponseText question={mockQuestion} />
      </Provider>
    );

    // Type in the input
    const input = screen.getByRole("textbox");
    await act(async () => {
      fireEvent.change(input, { target: { value: "test response" } });
    });

    // Click save button
    const saveButton = screen.getByRole("button", { name: /save/i });
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(mockSetUserResponse).toHaveBeenCalledWith({
      questionId: "123",
      userResponseType: "free-text-255",
      userResponse: {
        text: "test response",
      },
    });
  });

  it("handles save with empty text", async () => {
    render(
      <Provider store={store}>
        <UserResponseText question={mockQuestion} />
      </Provider>
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(mockSetUserResponse).toHaveBeenCalledWith({
      questionId: "123",
      userResponseType: "free-text-255",
      userResponse: {},
    });
  });

  it("handles setUserResponse error", async () => {
    mockSetUserResponse.mockRejectedValueOnce(new Error("API Error"));

    render(
      <Provider store={store}>
        <UserResponseText question={mockQuestion} />
      </Provider>
    );

    const input = screen.getByRole("textbox");
    await act(async () => {
      fireEvent.change(input, { target: { value: "test response" } });
    });

    const saveButton = screen.getByRole("button", { name: /save/i });
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to submit response:",
      expect.any(Error)
    );
  });

  it("handles undefined question", () => {
    render(
      <Provider store={store}>
        <UserResponseText question={undefined as any} />
      </Provider>
    );

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("handles undefined draftResponses", async () => {
    store = configureStore({
      reducer: {
        userResponseUI: (
          state = {
            draftResponses: {
              "123": undefined,
            },
            isEditing: false,
          },
          action: any
        ) => {
          if (action.type === "userResponseUI/setDraftResponse") {
            return {
              ...state,
              draftResponses: {
                ...state.draftResponses,
                [action.payload.questionId]: { text: action.payload.text },
              },
            };
          }
          return state;
        },
      },
    });

    render(
      <Provider store={store}>
        <UserResponseText question={mockQuestion} />
      </Provider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");

    await act(async () => {
      fireEvent.change(input, { target: { value: "new response" } });
    });

    expect(input).toHaveValue("new response");
  });
});
