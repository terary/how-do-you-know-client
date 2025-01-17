import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InstructionalCoursesPage from "@/app/instructional-courses/page";
import { StoreProvider } from "@/app/StoreProvider";
import {
  useGetInstructionalCoursesQuery,
  useDeleteInstructionalCourseMutation,
  useCreateInstructionalCourseMutation,
} from "@/lib/features/instructional-courses/instructionalCoursesApiSlice";
import { useGetLearningInstitutionsQuery } from "@/lib/features/learning-institutions/learningInstitutionsApiSlice";
import { useAuth } from "@/lib/hooks/useAuth";

// Mock the hooks
jest.mock("@/lib/features/instructional-courses/instructionalCoursesApiSlice");
jest.mock("@/lib/features/learning-institutions/learningInstitutionsApiSlice");
jest.mock("@/lib/hooks/useAuth");

const mockCourses = [
  {
    id: "1",
    name: "Test Course 1",
    description: "Description 1",
    start_date: "2024-01-01",
    finish_date: "2024-12-31",
    start_time_utc: "09:00",
    duration_minutes: 60,
    days_of_week: ["MONDAY"],
    institution_id: "1",
    instructor_id: "1",
    proctor_ids: [],
  },
];

const mockDeleteCourse = jest.fn();
const mockCreateCourse = jest.fn();
const mockUser = { id: "test-user-id" };
const mockInstitutions = [
  { id: "1", name: "Test Institution 1" },
  { id: "2", name: "Test Institution 2" },
];

describe("InstructionalCoursesPage", () => {
  beforeEach(() => {
    (useGetInstructionalCoursesQuery as jest.Mock).mockReturnValue({
      data: mockCourses,
      isLoading: false,
      error: null,
    });
    (useDeleteInstructionalCourseMutation as jest.Mock).mockReturnValue([
      mockDeleteCourse,
      { isLoading: false },
    ]);
    (useCreateInstructionalCourseMutation as jest.Mock).mockReturnValue([
      mockCreateCourse,
      { isLoading: false },
    ]);
    (useGetLearningInstitutionsQuery as jest.Mock).mockReturnValue({
      data: mockInstitutions,
    });
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    (useGetInstructionalCoursesQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <StoreProvider>
        <InstructionalCoursesPage />
      </StoreProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useGetInstructionalCoursesQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { status: 500, data: "Server Error" },
    });

    render(
      <StoreProvider>
        <InstructionalCoursesPage />
      </StoreProvider>
    );

    expect(screen.getByText(/error loading courses/i)).toBeInTheDocument();
  });

  it("renders list of courses", () => {
    render(
      <StoreProvider>
        <InstructionalCoursesPage />
      </StoreProvider>
    );

    expect(screen.getByText("Test Course 1")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
  });

  it("opens dialog when add button is clicked", () => {
    render(
      <StoreProvider>
        <InstructionalCoursesPage />
      </StoreProvider>
    );

    const addButton = screen.getByRole("button", { name: /add course/i });
    fireEvent.click(addButton);

    expect(screen.getByText(/add instructional course/i)).toBeInTheDocument();
  });

  it("calls delete mutation when delete button is clicked", async () => {
    render(
      <StoreProvider>
        <InstructionalCoursesPage />
      </StoreProvider>
    );

    const deleteButton = screen.getByTestId("delete-course-button");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteCourse).toHaveBeenCalledWith("1");
    });
  });
});
