import { render, screen } from "../../../test-utils";
import { Questionnaires } from "@/app/components/questionnaires/Questionnaires";
import { useGetQuestionnaireQuery } from "@/lib/features/user-response/userResponseApiSlice";
import { QuestionList } from "@/app/components/questionnaires/QuestionList";

// Mock the RTK Query hook
jest.mock("@/lib/features/user-response/userResponseApiSlice");
// Mock the QuestionList component
jest.mock("@/app/components/questionnaires/QuestionList", () => ({
  QuestionList: jest.fn(() => (
    <div data-testid="question-list">Question List Component</div>
  )),
}));

describe("Questionnaires", () => {
  beforeEach(() => {
    (useGetQuestionnaireQuery as jest.Mock).mockReset();
  });

  it("renders loading state", () => {
    (useGetQuestionnaireQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      isError: false,
      isSuccess: false,
    });

    render(<Questionnaires />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useGetQuestionnaireQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: true,
      error: "Test error",
      isSuccess: false,
    });

    render(<Questionnaires />);
    expect(screen.getByText("There was an error!")).toBeInTheDocument();
  });

  it("renders success state with questions and QuestionList", () => {
    const mockData = {
      questions: [
        { id: 1, text: "Question 1" },
        { id: 2, text: "Question 2" },
      ],
    };

    (useGetQuestionnaireQuery as jest.Mock).mockReturnValue({
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
    const mockData = {
      // questions array is intentionally undefined
    };

    (useGetQuestionnaireQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: mockData,
    });

    render(<Questionnaires />);

    // Should show 0 total questions due to the || [] fallback
    expect(screen.getByText("Total Questions: 0")).toBeInTheDocument();

    // QuestionList should still be rendered
    expect(screen.getByTestId("question-list")).toBeInTheDocument();
  });

  it("renders nothing when no conditions are met", () => {
    (useGetQuestionnaireQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: false,
      data: null,
    });

    const { container } = render(<Questionnaires />);
    expect(container.firstChild).toBeNull();
  });
});
