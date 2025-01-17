import { render, screen, fireEvent, act } from "../../../test-utils";
import { UserResponse1Of4 } from "@/app/components/questionnaires/UserResponse1Of4";
import type { TQuestionUserResponseOneOf4 } from "@/app/questionnaires/types";

// Get the mock function from the mocked module
const { useSetUserResponseMutation } = jest.requireMock(
  "@/lib/features/user-response/userResponseApiSlice"
);

const initialUserResponseState = {
  questionMap: {},
  draftResponses: {},
  isEditing: false,
};

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

  const mockSetUserResponse = jest.fn(() =>
    Promise.resolve({ data: { questionId: "123" } })
  );
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    useSetUserResponseMutation.mockReturnValue([
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
    const preloadedState = {
      userResponseUI: initialUserResponseState,
    };

    render(<UserResponse1Of4 question={mockQuestion} />, { preloadedState });

    const radioA = screen.getByLabelText("Option A");
    await act(async () => {
      fireEvent.click(radioA);
    });

    expect(screen.getByLabelText("Option A")).toBeChecked();
  });

  it("renders save button", () => {
    render(<UserResponse1Of4 question={mockQuestion} />);
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("handles save button click", async () => {
    const preloadedState = {
      userResponseUI: {
        ...initialUserResponseState,
        draftResponses: {
          "123": { text: "A" },
        },
      },
    };

    render(<UserResponse1Of4 question={mockQuestion} />, { preloadedState });

    // First select an option
    const radioA = screen.getByLabelText("Option A");
    await act(async () => {
      fireEvent.click(radioA);
    });

    // Verify the radio is checked
    expect(radioA).toBeChecked();

    // Click the save button
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
        ...initialUserResponseState,
        isEditing: true,
      },
    };

    render(<UserResponse1Of4 question={mockQuestion} />, { preloadedState });
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("handles setUserResponse error", async () => {
    mockSetUserResponse.mockRejectedValueOnce(new Error("API Error"));

    const preloadedState = {
      userResponseUI: {
        ...initialUserResponseState,
        draftResponses: {
          "123": { text: "A" },
        },
      },
    };

    render(<UserResponse1Of4 question={mockQuestion} />, { preloadedState });

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
    const preloadedState = {
      userResponseUI: initialUserResponseState,
    };

    render(<UserResponse1Of4 question={mockQuestion} />, { preloadedState });

    // Click save button without selecting an option
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
