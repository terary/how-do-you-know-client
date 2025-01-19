import { screen, fireEvent, waitFor } from "@testing-library/react";
import { InstructionalCourseDialog } from "@/app/instructional-courses/InstructionalCourseDialog";
import { useCreateInstructionalCourseMutation } from "@/lib/features/instructional-courses/instructionalCoursesApiSlice";
import { useGetLearningInstitutionsQuery } from "@/lib/features/learning-institutions/learningInstitutionsApiSlice";
import { renderWithProviders } from "../../test-utils/render";
import { useAuth } from "@/lib/hooks/useAuth";

// Mock the hooks
const mockCreateCourse = jest.fn();
jest.mock(
  "@/lib/features/instructional-courses/instructionalCoursesApiSlice",
  () => ({
    useCreateInstructionalCourseMutation: jest.fn(() => [
      mockCreateCourse,
      { isLoading: false },
    ]),
  })
);

jest.mock(
  "@/lib/features/learning-institutions/learningInstitutionsApiSlice",
  () => ({
    useGetLearningInstitutionsQuery: jest.fn(() => ({
      data: [
        {
          id: "1",
          name: "Test Institution 1",
        },
      ],
    })),
  })
);

jest.mock("@/lib/hooks/useAuth", () => ({
  useAuth: jest.fn(() => ({
    user: { id: "user1" },
  })),
}));

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("InstructionalCourseDialog", () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("validates required fields", async () => {
    renderWithProviders(
      <InstructionalCourseDialog open={true} onOpenChange={mockOnOpenChange} />
    );

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/start date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/finish date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/start time is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/at least one day must be selected/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/institution is required/i)).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    renderWithProviders(
      <InstructionalCourseDialog open={true} onOpenChange={mockOnOpenChange} />
    );

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test Course" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2024-03-20" },
    });
    fireEvent.change(screen.getByLabelText(/finish date/i), {
      target: { value: "2024-03-21" },
    });
    fireEvent.change(screen.getByLabelText(/start time/i), {
      target: { value: "09:00" },
    });
    fireEvent.change(screen.getByLabelText(/duration/i), {
      target: { value: "60" },
    });

    // Select institution
    const institutionSelect = screen.getByLabelText(/institution/i);
    fireEvent.mouseDown(institutionSelect);
    fireEvent.click(screen.getByText("Test Institution 1"));

    // Select days
    fireEvent.click(screen.getByLabelText(/monday/i));

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockCreateCourse).toHaveBeenCalledWith({
        name: "Test Course",
        description: "Test Description",
        start_date: "2024-03-20",
        finish_date: "2024-03-21",
        start_time_utc: "09:00",
        duration_minutes: 60,
        days_of_week: ["MONDAY"],
        institution_id: "1",
        instructor_id: "user1",
        proctor_ids: [],
      });
    });

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("handles API errors", async () => {
    mockCreateCourse.mockRejectedValueOnce(new Error("API Error"));

    renderWithProviders(
      <InstructionalCourseDialog open={true} onOpenChange={mockOnOpenChange} />
    );

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test Course" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2024-03-20" },
    });
    fireEvent.change(screen.getByLabelText(/finish date/i), {
      target: { value: "2024-03-21" },
    });
    fireEvent.change(screen.getByLabelText(/start time/i), {
      target: { value: "09:00" },
    });
    fireEvent.change(screen.getByLabelText(/duration/i), {
      target: { value: "60" },
    });

    // Select institution
    const institutionSelect = screen.getByLabelText(/institution/i);
    fireEvent.mouseDown(institutionSelect);
    fireEvent.click(screen.getByText("Test Institution 1"));

    // Select days
    fireEvent.click(screen.getByLabelText(/monday/i));

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to create course/i)).toBeInTheDocument();
    });
  });
});
