import { render, screen } from "../../../test-utils";
import { Questionnaires } from "@/app/components/questionnaires/Questionnaires";

// Mock the QuestionList component
jest.mock("@/app/components/questionnaires/QuestionList", () => ({
  QuestionList: jest.fn(() => (
    <div data-testid="question-list">Question List Component</div>
  )),
}));

// Get the mock function from the mocked module
const { useGetQuestionnaireQuery } = jest.requireMock(
  "@/lib/features/user-response/userResponseApiSlice"
);

describe("Questionnaires", () => {
  beforeEach(() => {
    useGetQuestionnaireQuery.mockReset();
  });

  it("renders loading state", () => {
    useGetQuestionnaireQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      isSuccess: false,
      data: null,
    });

    render(<Questionnaires />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    useGetQuestionnaireQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
      error: new Error("Test error"),
      data: null,
    });

    render(<Questionnaires />);
    expect(screen.getByText("There was an error!")).toBeInTheDocument();
  });

  it("renders success state with questions and QuestionList", () => {
    const mockData = {
      questions: [
        { questionId: "1", text: "Question 1" },
        { questionId: "2", text: "Question 2" },
      ],
    };

    useGetQuestionnaireQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: mockData,
    });

    render(<Questionnaires />);

    // Test that the total questions count is displayed
    expect(screen.getByText("Total Questions: 2")).toBeInTheDocument();

    // Test that the QuestionList component is rendered
    expect(screen.getByTestId("question-list")).toBeInTheDocument();
  });

  it("renders success state with undefined questions array", () => {
    useGetQuestionnaireQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: { questions: undefined },
    });

    render(<Questionnaires />);

    // Should show 0 total questions due to the || [] fallback
    expect(screen.getByText("Total Questions: 0")).toBeInTheDocument();

    // QuestionList should still be rendered
    expect(screen.getByTestId("question-list")).toBeInTheDocument();
  });
});
