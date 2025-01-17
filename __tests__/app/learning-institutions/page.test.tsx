import { render, screen, fireEvent } from "@testing-library/react";
import LearningInstitutionsPage from "@/app/learning-institutions/page";
import {
  useGetLearningInstitutionsQuery,
  useDeleteLearningInstitutionMutation,
  useCreateLearningInstitutionMutation,
} from "@/lib/features/learning-institutions/learningInstitutionsApiSlice";
import { StoreProvider } from "@/app/StoreProvider";

// Mock the API hooks
jest.mock(
  "@/lib/features/learning-institutions/learningInstitutionsApiSlice",
  () => ({
    useGetLearningInstitutionsQuery: jest.fn(),
    useDeleteLearningInstitutionMutation: jest.fn(),
    useCreateLearningInstitutionMutation: jest.fn(() => {
      const mockCreateInstitution = jest.fn().mockResolvedValue({ data: {} });
      return [mockCreateInstitution, { isLoading: false }];
    }),
  })
);

const mockInstitutions = [
  {
    id: "1",
    name: "Test Institution 1",
    description: "Description 1",
    website: "https://test1.com",
    email: "test1@test.com",
    phone: "123-456-7890",
    address: "123 Test St",
    created_by: "user1",
    created_at: "2024-03-14T00:00:00.000Z",
    updated_at: "2024-03-14T00:00:00.000Z",
    courses: [],
  },
  {
    id: "2",
    name: "Test Institution 2",
    description: "Description 2",
    website: "https://test2.com",
    email: "test2@test.com",
    phone: "098-765-4321",
    address: "456 Test Ave",
    created_by: "user1",
    created_at: "2024-03-14T00:00:00.000Z",
    updated_at: "2024-03-14T00:00:00.000Z",
    courses: [],
  },
];

describe("LearningInstitutionsPage", () => {
  const mockDeleteInstitution = jest.fn();

  beforeEach(() => {
    (useGetLearningInstitutionsQuery as jest.Mock).mockReturnValue({
      data: mockInstitutions,
      isLoading: false,
      error: null,
    });
    (useDeleteLearningInstitutionMutation as jest.Mock).mockReturnValue([
      mockDeleteInstitution,
      { isLoading: false },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    (useGetLearningInstitutionsQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <StoreProvider>
        <LearningInstitutionsPage />
      </StoreProvider>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useGetLearningInstitutionsQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { status: 500, data: "Error message" },
    });

    render(
      <StoreProvider>
        <LearningInstitutionsPage />
      </StoreProvider>
    );

    expect(screen.getByText(/Error loading institutions/i)).toBeInTheDocument();
  });

  it("renders list of institutions", () => {
    render(
      <StoreProvider>
        <LearningInstitutionsPage />
      </StoreProvider>
    );

    expect(screen.getByText("Test Institution 1")).toBeInTheDocument();
    expect(screen.getByText("Test Institution 2")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
  });

  it("opens dialog when add button is clicked", () => {
    render(
      <StoreProvider>
        <LearningInstitutionsPage />
      </StoreProvider>
    );

    fireEvent.click(screen.getByText(/Add Institution/i));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls delete mutation when delete button is clicked", () => {
    mockDeleteInstitution.mockResolvedValueOnce({});

    render(
      <StoreProvider>
        <LearningInstitutionsPage />
      </StoreProvider>
    );

    const deleteButtons = screen.getAllByTestId("DeleteIcon");
    fireEvent.click(deleteButtons[0].closest("button")!);

    expect(mockDeleteInstitution).toHaveBeenCalledWith("1");
  });
});
