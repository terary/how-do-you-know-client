import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LearningInstitutionsPage from "@/app/learning-institutions/page";
import {
  useGetLearningInstitutionsQuery,
  useDeleteLearningInstitutionMutation,
  useCreateLearningInstitutionMutation,
} from "@/lib/features/learning-institutions/learningInstitutionsApiSlice";
import { StoreProvider } from "@/app/StoreProvider";

// Mock the API hooks
const mockDeleteInstitution = jest.fn();
const mockCreateInstitution = jest.fn();

jest.mock(
  "@/lib/features/learning-institutions/learningInstitutionsApiSlice",
  () => ({
    useGetLearningInstitutionsQuery: jest.fn(),
    useDeleteLearningInstitutionMutation: jest.fn(() => [
      mockDeleteInstitution,
      { isLoading: false },
    ]),
    useCreateLearningInstitutionMutation: jest.fn(() => [
      mockCreateInstitution,
      { isLoading: false },
    ]),
  })
);

describe("LearningInstitutionsPage", () => {
  const mockInstitutions = [
    {
      id: "1",
      name: "Test Institution 1",
      description: "Description 1",
      website: "https://test1.com",
      email: "test1@test.com",
      phone: "123-456-7890",
      address: "123 Test St",
    },
    {
      id: "2",
      name: "Test Institution 2",
      description: "Description 2",
      website: "https://test2.com",
      email: "test2@test.com",
      phone: "987-654-3210",
      address: "456 Test Ave",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteInstitution.mockImplementation(async (id: string) => ({
      data: { id },
      unwrap: () => Promise.resolve({ id }),
    }));
    mockCreateInstitution.mockImplementation(async (data: any) => ({
      data,
      unwrap: () => Promise.resolve(data),
    }));
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

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useGetLearningInstitutionsQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: "Failed to fetch institutions" },
    });

    render(
      <StoreProvider>
        <LearningInstitutionsPage />
      </StoreProvider>
    );

    expect(screen.getByText(/Error loading institutions/i)).toBeInTheDocument();
  });

  it("renders list of institutions", () => {
    (useGetLearningInstitutionsQuery as jest.Mock).mockReturnValue({
      data: mockInstitutions,
      isLoading: false,
      error: null,
    });

    render(
      <StoreProvider>
        <LearningInstitutionsPage />
      </StoreProvider>
    );

    mockInstitutions.forEach((institution) => {
      expect(screen.getByText(institution.name)).toBeInTheDocument();
      expect(screen.getByText(institution.description)).toBeInTheDocument();
      expect(screen.getByText(institution.website)).toBeInTheDocument();
      expect(screen.getByText(institution.email)).toBeInTheDocument();
      expect(screen.getByText(institution.phone)).toBeInTheDocument();
      expect(screen.getByText(institution.address)).toBeInTheDocument();
    });
  });

  it("opens dialog when add button is clicked", () => {
    (useGetLearningInstitutionsQuery as jest.Mock).mockReturnValue({
      data: mockInstitutions,
      isLoading: false,
      error: null,
    });

    render(
      <StoreProvider>
        <LearningInstitutionsPage />
      </StoreProvider>
    );

    fireEvent.click(screen.getByText(/Add Institution/i));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls delete mutation when delete button is clicked", async () => {
    (useGetLearningInstitutionsQuery as jest.Mock).mockReturnValue({
      data: mockInstitutions,
      isLoading: false,
      error: null,
    });

    render(
      <StoreProvider>
        <LearningInstitutionsPage />
      </StoreProvider>
    );

    const deleteButtons = screen.getAllByTestId("delete-institution-button");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteInstitution).toHaveBeenCalledWith(
        mockInstitutions[0].id
      );
    });
  });
});
