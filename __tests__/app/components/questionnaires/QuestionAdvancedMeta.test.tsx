import { render, screen, fireEvent, act } from "../../../test-utils";
import { QuestionAdvancedMeta } from "@/app/components/questionnaires/QuestionAdvancedMeta";
import { TQuestionAny } from "@/app/questionnaires/types";
import { updateQuestionFEMeta } from "@/lib/features/user-response/userResponseSlice";

// Mock the redux dispatch
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

describe("QuestionAdvancedMeta", () => {
  const mockQuestion: TQuestionAny = {
    questionId: "123",
    userPromptType: "text",
    userPromptText: "Sample question",
    userResponseType: "free-text-255",
    feMeta: {
      isSkipped: false,
      isUserFlagged: false,
      userFlags: "",
      userSortPosition: 0,
    },
  } as TQuestionAny;

  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it("renders advanced section with expand/collapse functionality", async () => {
    render(<QuestionAdvancedMeta question={mockQuestion} />);

    // Initially collapsed
    expect(screen.getByTestId("ExpandMoreIcon")).toBeInTheDocument();
    expect(document.querySelector(".MuiCollapse-hidden")).toBeInTheDocument();

    // Expand section
    const expandButton = screen.getByRole("button");
    await act(async () => {
      fireEvent.click(expandButton);
    });

    // Verify expanded
    expect(screen.getByTestId("ExpandLessIcon")).toBeInTheDocument();
  });

  it("handles checkbox changes correctly", async () => {
    render(<QuestionAdvancedMeta question={mockQuestion} />);

    // Expand section
    const expandButton = screen.getByRole("button");
    await act(async () => {
      fireEvent.click(expandButton);
    });

    // Toggle Skip Question checkbox
    const skipCheckbox = screen.getByLabelText("Skip Question");
    await act(async () => {
      fireEvent.click(skipCheckbox);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      updateQuestionFEMeta({
        questionId: "123",
        feMeta: {
          isSkipped: true,
          isUserFlagged: false,
          userFlags: "",
          userSortPosition: 0,
        },
      })
    );
  });

  it("handles text input changes", async () => {
    render(<QuestionAdvancedMeta question={mockQuestion} />);

    // Expand section
    const expandButton = screen.getByRole("button");
    await act(async () => {
      fireEvent.click(expandButton);
    });

    // Change User Notes
    const userNotesInput = screen.getByLabelText("User Notes");
    await act(async () => {
      fireEvent.change(userNotesInput, { target: { value: "Test note" } });
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      updateQuestionFEMeta({
        questionId: "123",
        feMeta: {
          isSkipped: false,
          isUserFlagged: false,
          userFlags: "Test note",
          userSortPosition: 0,
        },
      })
    );
  });

  it("handles sort position changes", async () => {
    render(<QuestionAdvancedMeta question={mockQuestion} />);

    // Expand section
    const expandButton = screen.getByRole("button");
    await act(async () => {
      fireEvent.click(expandButton);
    });

    // Change Sort Position
    const sortPositionInput = screen.getByLabelText("Sort Position");
    await act(async () => {
      fireEvent.change(sortPositionInput, { target: { value: "5" } });
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      updateQuestionFEMeta({
        questionId: "123",
        feMeta: {
          isSkipped: false,
          isUserFlagged: false,
          userFlags: "",
          userSortPosition: 5,
        },
      })
    );
  });

  it("handles undefined feMeta", () => {
    const questionWithoutMeta = {
      ...mockQuestion,
      feMeta: undefined,
    };

    render(<QuestionAdvancedMeta question={questionWithoutMeta} />);

    // Verify default values are used
    const expandButton = screen.getByRole("button");
    fireEvent.click(expandButton);

    const skipCheckbox = screen.getByLabelText("Skip Question");
    const flagCheckbox = screen.getByLabelText("Flag Question");

    expect(skipCheckbox).not.toBeChecked();
    expect(flagCheckbox).not.toBeChecked();
    expect(screen.getByLabelText("User Notes")).toHaveValue("");
    expect(screen.getByLabelText("Sort Position")).toHaveValue(0);
  });

  it("maintains expanded state between renders", async () => {
    const { rerender } = render(
      <QuestionAdvancedMeta question={mockQuestion} />
    );

    // Initially collapsed
    expect(screen.getByTestId("ExpandMoreIcon")).toBeInTheDocument();
    expect(document.querySelector(".MuiCollapse-hidden")).toBeInTheDocument();

    // Expand section
    const expandButton = screen.getByRole("button");
    await act(async () => {
      fireEvent.click(expandButton);
    });

    // Rerender with new props
    rerender(<QuestionAdvancedMeta question={{ ...mockQuestion }} />);

    // Should still be expanded
    expect(screen.getByTestId("ExpandLessIcon")).toBeInTheDocument();
  });
});