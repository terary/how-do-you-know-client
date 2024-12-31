import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { UserResponseAnyOf } from "@/app/components/questionnaires/UserResponseAnyOf";
import { useSetUserResponseMutation } from "@/lib/features/user-response/userResponseApiSlice";

// Mock the RTK Query hook
jest.mock("@/lib/features/user-response/userResponseApiSlice", () => ({
  useSetUserResponseMutation: jest.fn(),
}));

describe("UserResponseAnyOf", () => {
  const mockQuestion = {
    questionId: "123",
    userPromptType: "text",
    userPromptText: "Sample question",
    userResponseType: "any-of",
    choices: [
      { labelText: "Option A", value: "A" },
      { labelText: "Option B", value: "B" },
      { labelText: "Option C", value: "C" },
      { labelText: "Option D", value: "D" },
    ],
    validAnswers: [],
    answerFodderId: "456",
    userResponse: { values: null },
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
          if (action.type === "userResponseUI/setArrayValueDraftResponse") {
            return {
              ...state,
              draftResponses: {
                ...state.draftResponses,
                [action.payload.questionId]: {
                  selectedOptions: action.payload.selectedOptions,
                },
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

  it("renders all checkbox options", () => {
    render(
      <Provider store={store}>
        <UserResponseAnyOf question={mockQuestion as any} />
      </Provider>
    );

    expect(screen.getByLabelText("Option A")).toBeInTheDocument();
    expect(screen.getByLabelText("Option B")).toBeInTheDocument();
    expect(screen.getByLabelText("Option C")).toBeInTheDocument();
    expect(screen.getByLabelText("Option D")).toBeInTheDocument();
  });

  it("handles checkbox selection", async () => {
    render(
      <Provider store={store}>
        <UserResponseAnyOf question={mockQuestion as any} />
      </Provider>
    );

    const checkboxA = screen.getByLabelText("Option A");
    const checkboxB = screen.getByLabelText("Option B");

    await act(async () => {
      fireEvent.click(checkboxA);
    });

    expect(checkboxA).toBeChecked();
    expect(checkboxB).not.toBeChecked();
    expect(store.getState().userResponseUI.draftResponses["123"]).toEqual({
      selectedOptions: ["A"],
    });

    // Select second option
    await act(async () => {
      fireEvent.click(checkboxB);
    });

    expect(checkboxA).toBeChecked();
    expect(checkboxB).toBeChecked();
    expect(store.getState().userResponseUI.draftResponses["123"]).toEqual({
      selectedOptions: ["A", "B"],
    });
  });

  it("handles save button click", async () => {
    render(
      <Provider store={store}>
        <UserResponseAnyOf question={mockQuestion} />
      </Provider>
    );

    // Select two options
    const checkboxA = screen.getByLabelText("Option A");
    const checkboxB = screen.getByLabelText("Option B");

    await act(async () => {
      fireEvent.click(checkboxA);
      fireEvent.click(checkboxB);
    });

    // Click save button
    const saveButton = screen.getByRole("button", { name: /save/i });
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(mockSetUserResponse).toHaveBeenCalledWith({
      questionId: "123",
      userResponseType: "any-of",
      userResponse: {
        selectedOptions: ["A", "B"],
      },
    });
  });

  it("handles save with no selections", async () => {
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
          if (action.type === "userResponseUI/setArrayValueDraftResponse") {
            return {
              ...state,
              draftResponses: {
                ...state.draftResponses,
                [action.payload.questionId]: {
                  selectedOptions: action.payload.selectedOptions,
                },
              },
            };
          }
          return state;
        },
      },
    });

    render(
      <Provider store={store}>
        <UserResponseAnyOf question={mockQuestion} />
      </Provider>
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(mockSetUserResponse).toHaveBeenCalledWith({
      questionId: "123",
      userResponseType: "any-of",
      userResponse: {
        selectedOptions: [],
      },
    });
  });

  it("handles setUserResponse error", async () => {
    mockSetUserResponse.mockRejectedValueOnce(new Error("API Error"));

    render(
      <Provider store={store}>
        <UserResponseAnyOf question={mockQuestion} />
      </Provider>
    );

    // Select an option
    const checkboxA = screen.getByLabelText("Option A");
    await act(async () => {
      fireEvent.click(checkboxA);
    });

    // Click save button
    const saveButton = screen.getByRole("button", { name: /save/i });
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to submit response:",
      expect.any(Error)
    );
  });

  it("handles checkbox selection with undefined draft options", async () => {
    // Configure store with undefined draft options
    store = configureStore({
      reducer: {
        userResponseUI: (
          state = {
            draftResponses: {
              "123": { selectedOptions: undefined }, // explicitly set selectedOptions to undefined
            },
            isEditing: false,
          },
          action: any
        ) => {
          if (action.type === "userResponseUI/setArrayValueDraftResponse") {
            return {
              ...state,
              draftResponses: {
                ...state.draftResponses,
                [action.payload.questionId]: {
                  selectedOptions: action.payload.selectedOptions,
                },
              },
            };
          }
          return state;
        },
      },
    });

    render(
      <Provider store={store}>
        <UserResponseAnyOf question={mockQuestion} />
      </Provider>
    );

    // Select an option when draftOptions is undefined
    const checkboxA = screen.getByLabelText("Option A");
    await act(async () => {
      fireEvent.click(checkboxA);
    });

    expect(checkboxA).toBeChecked();
    expect(store.getState().userResponseUI.draftResponses["123"]).toEqual({
      selectedOptions: ["A"],
    });
  });

  it("handles checkbox deselection with undefined draft options", async () => {
    // Configure store to simulate a situation where draftOptions becomes undefined
    store = configureStore({
      reducer: {
        userResponseUI: (
          state = {
            draftResponses: {
              "123": { selectedOptions: undefined },
            },
            isEditing: false,
          },
          action: any
        ) => {
          if (action.type === "userResponseUI/setArrayValueDraftResponse") {
            return {
              ...state,
              draftResponses: {
                ...state.draftResponses,
                [action.payload.questionId]: {
                  selectedOptions: action.payload.selectedOptions,
                },
              },
            };
          }
          return state;
        },
      },
    });

    render(
      <Provider store={store}>
        <UserResponseAnyOf question={mockQuestion} />
      </Provider>
    );

    const checkboxA = screen.getByLabelText("Option A");

    // First select the checkbox
    await act(async () => {
      fireEvent.click(checkboxA);
    });

    // Then deselect it
    await act(async () => {
      fireEvent.click(checkboxA);
    });

    expect(checkboxA).not.toBeChecked();
    expect(store.getState().userResponseUI.draftResponses["123"]).toEqual({
      selectedOptions: [],
    });
  });

  it("handles all branch conditions for checkbox selection logic", async () => {
    // Initial state with null draftOptions
    store = configureStore({
      reducer: {
        userResponseUI: (
          state = {
            draftResponses: {
              "123": null,
            },
            isEditing: false,
          },
          action: any
        ) => {
          if (action.type === "userResponseUI/setArrayValueDraftResponse") {
            return {
              ...state,
              draftResponses: {
                ...state.draftResponses,
                [action.payload.questionId]: {
                  selectedOptions: action.payload.selectedOptions,
                },
              },
            };
          }
          return state;
        },
      },
    });

    const { rerender } = render(
      <Provider store={store}>
        <UserResponseAnyOf question={mockQuestion} />
      </Provider>
    );

    // Branch 1: isChecked = true, draftOptions = null/undefined
    const checkboxA = screen.getByLabelText("Option A");
    await act(async () => {
      fireEvent.click(checkboxA);
    });

    // Branch 2: isChecked = false, draftOptions = null/undefined
    await act(async () => {
      fireEvent.click(checkboxA);
    });

    // Update store to have existing selections
    store = configureStore({
      reducer: {
        userResponseUI: (
          state = {
            draftResponses: {
              "123": { selectedOptions: ["B"] },
            },
            isEditing: false,
          },
          action: any
        ) => {
          if (action.type === "userResponseUI/setArrayValueDraftResponse") {
            return {
              ...state,
              draftResponses: {
                ...state.draftResponses,
                [action.payload.questionId]: {
                  selectedOptions: action.payload.selectedOptions,
                },
              },
            };
          }
          return state;
        },
      },
    });

    rerender(
      <Provider store={store}>
        <UserResponseAnyOf question={mockQuestion} />
      </Provider>
    );

    // Branch 3: isChecked = true, draftOptions = ["B"]
    await act(async () => {
      fireEvent.click(checkboxA);
    });

    // Branch 4: isChecked = false, draftOptions = ["B", "A"]
    await act(async () => {
      fireEvent.click(checkboxA);
    });

    // Verify final state
    expect(store.getState().userResponseUI.draftResponses["123"]).toEqual({
      selectedOptions: ["B"],
    });
  });
});
