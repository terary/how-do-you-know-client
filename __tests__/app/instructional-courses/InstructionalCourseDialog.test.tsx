import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { InstructionalCourseDialog } from "@/app/instructional-courses/InstructionalCourseDialog";
import { StoreProvider } from "@/app/StoreProvider";
import { useCreateInstructionalCourseMutation } from "@/lib/features/instructional-courses/instructionalCoursesApiSlice";
import { useGetLearningInstitutionsQuery } from "@/lib/features/learning-institutions/learningInstitutionsApiSlice";
import { useAuth } from "@/lib/hooks/useAuth";

// Mock the hooks
jest.mock("@/lib/features/instructional-courses/instructionalCoursesApiSlice");
jest.mock("@/lib/features/learning-institutions/learningInstitutionsApiSlice");
jest.mock("@/lib/hooks/useAuth");

const mockCreateCourse = jest.fn();
const mockUser = { id: "test-user-id" };
const mockInstitutions = [
  { id: "1", name: "Test Institution 1" },
  { id: "2", name: "Test Institution 2" },
];

describe("InstructionalCourseDialog", () => {
  beforeEach(() => {
    (useCreateInstructionalCourseMutation as jest.Mock).mockReturnValue([
      mockCreateCourse,
      { isLoading: false },
    ]);
    (useGetLearningInstitutionsQuery as jest.Mock).mockReturnValue({
      data: mockInstitutions,
    });
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    mockCreateCourse.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dialog when open", () => {
    render(
      <StoreProvider>
        <InstructionalCourseDialog open={true} onOpenChange={() => {}} />
      </StoreProvider>
    );

    expect(screen.getByText("Add Instructional Course")).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(
      <StoreProvider>
        <InstructionalCourseDialog open={true} onOpenChange={() => {}} />
      </StoreProvider>
    );

    const submitButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/start date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/finish date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/start time is required/i)).toBeInTheDocument();
      expect(screen.getByText(/institution is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/at least one day must be selected/i)
      ).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const mockOnOpenChange = jest.fn();
    render(
      <StoreProvider>
        <InstructionalCourseDialog
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      </StoreProvider>
    );

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test Course" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/finish date/i), {
      target: { value: "2024-12-31" },
    });
    fireEvent.change(screen.getByLabelText(/start time/i), {
      target: { value: "09:00" },
    });
    fireEvent.change(screen.getByLabelText(/duration/i), {
      target: { value: "60" },
    });

    // Click the select field to open the dropdown
    const institutionSelect = screen.getByRole("combobox", {
      name: /institution/i,
    });
    fireEvent.mouseDown(institutionSelect);

    // Wait for the option to appear and select it
    await waitFor(() => {
      const option = screen.getByText("Test Institution 1");
      fireEvent.click(option);
    });

    // Select a day
    const mondayCheckbox = screen.getByLabelText(/monday/i);
    fireEvent.click(mondayCheckbox);

    // Submit form
    const submitButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateCourse).toHaveBeenCalledWith({
        name: "Test Course",
        description: "Test Description",
        start_date: "2024-01-01",
        finish_date: "2024-12-31",
        start_time_utc: "09:00",
        duration_minutes: 60,
        days_of_week: ["MONDAY"],
        institution_id: "1",
        instructor_id: "test-user-id",
        proctor_ids: [],
      });
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("handles API errors", async () => {
    mockCreateCourse.mockRejectedValueOnce(new Error("API Error"));
    render(
      <StoreProvider>
        <InstructionalCourseDialog open={true} onOpenChange={() => {}} />
      </StoreProvider>
    );

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test Course" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/finish date/i), {
      target: { value: "2024-12-31" },
    });
    fireEvent.change(screen.getByLabelText(/start time/i), {
      target: { value: "09:00" },
    });
    fireEvent.change(screen.getByLabelText(/duration/i), {
      target: { value: "60" },
    });

    // Click the select field to open the dropdown
    const institutionSelect = screen.getByRole("combobox", {
      name: /institution/i,
    });
    fireEvent.mouseDown(institutionSelect);

    // Wait for the option to appear and select it
    await waitFor(() => {
      const option = screen.getByText("Test Institution 1");
      fireEvent.click(option);
    });

    // Select a day
    const mondayCheckbox = screen.getByLabelText(/monday/i);
    fireEvent.click(mondayCheckbox);

    const submitButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to create course")).toBeInTheDocument();
    });
  });
});
