import { render, screen, fireEvent, act } from "../../../test-utils";
import { UserResponse1Of4 } from "@/app/components/questionnaires/UserResponse1Of4";
import { useSetUserResponseMutation } from "@/lib/features/user-response/userResponseApiSlice";
import { TQuestionUserResponseOneOf4 } from "@/app/questionnaires/types";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

// Mock the RTK Query hook
jest.mock("@/lib/features/user-response/userResponseApiSlice", () => ({
  useSetUserResponseMutation: jest.fn(),
}));

describe("UserResponse1Of4", () => {
  const mockQuestion: TQuestionUserResponseOneOf4 = {
    questionId: "123",
    userPromptType: "text",
    userPromptText: "Sample question",
    userResponseType: "one-of-4",
    choices: [
      { labelText: "Option A", value: "A" },
      { labelText: "Option B", value: "B" },
      { labelText: "Option C", value: "C" },
      { labelText: "Option D", value: "D" },
    ],
    validAnswers: [],
    answerFodderId: "456",
    userResponse: { value: null },
  };

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

  it("renders all radio options", () => {
    render(<UserResponse1Of4 question={mockQuestion} />);

    expect(screen.getByLabelText("Option A")).toBeInTheDocument();
    expect(screen.getByLabelText("Option B")).toBeInTheDocument();
    expect(screen.getByLabelText("Option C")).toBeInTheDocument();
    expect(screen.getByLabelText("Option D")).toBeInTheDocument();
  });

  it("handles radio selection", async () => {
    render(
      <Provider store={store}>
        <UserResponse1Of4 question={mockQuestion} />
      </Provider>
    );

    const radioA = screen.getByLabelText("Option A");
    await act(async () => {
      fireEvent.click(radioA);
    });

    expect(screen.getByLabelText("Option A")).toBeChecked();
    expect(store.getState().userResponseUI.draftResponses["123"]).toEqual({
      text: "A",
    });
  });

  it("renders save button", () => {
    render(<UserResponse1Of4 question={mockQuestion} />);

    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("handles save button click", async () => {
    render(
      <Provider store={store}>
        <UserResponse1Of4 question={mockQuestion} />
      </Provider>
    );

    // First select an option
    const radioA = screen.getByLabelText("Option A");
    await act(async () => {
      fireEvent.click(radioA);
    });

    // Verify the radio is checked and state is updated
    expect(radioA).toBeChecked();
    expect(store.getState().userResponseUI.draftResponses["123"]).toEqual({
      text: "A",
    });

    // Click the save button
    // const saveButton = screen.getByText("singleword.save");
    const saveButton = screen.getByText("Save");
    await act(async () => {
      fireEvent.click(saveButton);
    });

    // Verify the mutation was called with correct data
    expect(mockSetUserResponse).toHaveBeenCalledWith({
      questionId: "123",
      userResponseType: "one-of-4",
      userResponse: {
        text: "A",
      },
    });
  });

  it("disables save button when isEditing is true", () => {
    const preloadedState = {
      userResponseUI: {
        isEditing: true,
        draftResponses: {},
      },
    };

    render(<UserResponse1Of4 question={mockQuestion} />, { preloadedState });

    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("handles setUserResponse error", async () => {
    mockSetUserResponse.mockRejectedValueOnce(new Error("API Error"));

    render(
      <Provider store={store}>
        <UserResponse1Of4 question={mockQuestion} />
      </Provider>
    );

    // Select an option
    const radioA = screen.getByLabelText("Option A");
    await act(async () => {
      fireEvent.click(radioA);
    });

    // Click save button
    const saveButton = screen.getByRole("button", { name: /save/i });
    await act(async () => {
      fireEvent.click(saveButton);
    });

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to submit response:",
      expect.any(Error)
    );
  });

  it("handles save with undefined draft text", async () => {
    // Configure store with undefined draft response
    store = configureStore({
      reducer: {
        userResponseUI: (
          state = {
            draftResponses: {
              "123": undefined, // explicitly set draft response to undefined
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
        <UserResponse1Of4 question={mockQuestion} />
      </Provider>
    );

    // Click save button without selecting any option
    const saveButton = screen.getByRole("button", { name: /save/i });
    await act(async () => {
      fireEvent.click(saveButton);
    });

    // Verify the mutation was called with empty string
    expect(mockSetUserResponse).toHaveBeenCalledWith({
      questionId: "123",
      userResponseType: "one-of-4",
      userResponse: {
        text: "",
      },
    });
  });
});
