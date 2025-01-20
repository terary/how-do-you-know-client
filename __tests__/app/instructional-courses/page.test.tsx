import { screen, fireEvent } from "@testing-library/react";
import InstructionalCoursesPage from "@/app/instructional-courses/page";
import {
  useGetInstructionalCoursesQuery,
  useDeleteInstructionalCourseMutation,
  useCreateInstructionalCourseMutation,
} from "@/lib/features/instructional-courses/instructionalCoursesApiSlice";
import { renderWithProviders } from "../../test-utils/render";

// Mock the API hooks
const mockDeleteCourse = jest.fn();
const mockCreateCourse = jest.fn();

// Mock RoleProtectedRoute
jest.mock("@/lib/features/auth/components/RoleProtectedRoute", () => ({
  RoleProtectedRoute: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock(
  "@/lib/features/instructional-courses/instructionalCoursesApiSlice",
  () => ({
    useGetInstructionalCoursesQuery: jest.fn(),
    useDeleteInstructionalCourseMutation: jest.fn(() => [
      mockDeleteCourse,
      { isLoading: false },
    ]),
    useCreateInstructionalCourseMutation: jest.fn(() => [
      mockCreateCourse,
      { isLoading: false },
    ]),
  })
);

describe("InstructionalCoursesPage", () => {
  const mockCourses = [
    {
      id: "1",
      name: "Test Course 1",
      description: "Description 1",
      start_date: "2024-03-20",
      finish_date: "2024-03-21",
      start_time_utc: "09:00",
      duration_minutes: 60,
      days_of_week: ["MONDAY", "WEDNESDAY"],
      institution: {
        id: "1",
        name: "Test Institution 1",
      },
      instructor: {
        id: "1",
        firstName: "John",
        lastName: "Doe",
      },
    },
    {
      id: "2",
      name: "Test Course 2",
      description: "Description 2",
      start_date: "2024-03-22",
      finish_date: "2024-03-23",
      start_time_utc: "14:00",
      duration_minutes: 90,
      days_of_week: ["TUESDAY", "THURSDAY"],
      institution: {
        id: "2",
        name: "Test Institution 2",
      },
      instructor: {
        id: "2",
        firstName: "Jane",
        lastName: "Smith",
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteCourse.mockImplementation(async (id: string) => ({
      data: { id },
      unwrap: () => Promise.resolve({ id }),
    }));
    mockCreateCourse.mockImplementation(async (data: any) => ({
      data,
      unwrap: () => Promise.resolve(data),
    }));
  });

  it("renders loading state", () => {
    (useGetInstructionalCoursesQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderWithProviders(<InstructionalCoursesPage />);

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useGetInstructionalCoursesQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: "Failed to fetch courses" },
    });

    renderWithProviders(<InstructionalCoursesPage />);

    expect(screen.getByText(/Error loading courses/i)).toBeInTheDocument();
  });

  it("renders list of courses", () => {
    (useGetInstructionalCoursesQuery as jest.Mock).mockReturnValue({
      data: mockCourses,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<InstructionalCoursesPage />);

    mockCourses.forEach((course) => {
      expect(screen.getByText(course.name)).toBeInTheDocument();
      expect(screen.getByText(course.description)).toBeInTheDocument();
      expect(
        screen.getByText((content) => {
          return content.includes(course.institution.name);
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) => {
          return content.includes(
            `${course.instructor.firstName} ${course.instructor.lastName}`
          );
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) => {
          return content.includes(course.days_of_week.join(", "));
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) => {
          return content.includes(course.start_time_utc);
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) => {
          return content.includes(String(course.duration_minutes));
        })
      ).toBeInTheDocument();
    });
  });

  it("opens dialog when add button is clicked", () => {
    (useGetInstructionalCoursesQuery as jest.Mock).mockReturnValue({
      data: mockCourses,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<InstructionalCoursesPage />);

    fireEvent.click(screen.getByRole("button", { name: /add course/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls delete mutation when delete button is clicked", () => {
    (useGetInstructionalCoursesQuery as jest.Mock).mockReturnValue({
      data: mockCourses,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<InstructionalCoursesPage />);

    const deleteButtons = screen.getAllByTestId("delete-course-button");
    fireEvent.click(deleteButtons[0]);

    expect(mockDeleteCourse).toHaveBeenCalledWith("1");
  });
});
