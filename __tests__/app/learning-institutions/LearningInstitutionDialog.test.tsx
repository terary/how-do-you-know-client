import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LearningInstitutionDialog } from "@/app/learning-institutions/LearningInstitutionDialog";
import { useCreateLearningInstitutionMutation } from "@/lib/features/learning-institutions/learningInstitutionsApiSlice";
import { StoreProvider } from "@/app/StoreProvider";

// Mock the API mutation hook
const mockCreateInstitution = jest.fn();

jest.mock(
  "@/lib/features/learning-institutions/learningInstitutionsApiSlice",
  () => ({
    useCreateLearningInstitutionMutation: jest.fn(() => [
      mockCreateInstitution,
      { isLoading: false },
    ]),
  })
);

describe("LearningInstitutionDialog", () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateInstitution.mockImplementation(async (data: any) => ({
      data,
      unwrap: () => Promise.resolve(data),
    }));
  });

  it("renders dialog with form fields when open", () => {
    render(
      <StoreProvider>
        <LearningInstitutionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      </StoreProvider>
    );

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Website/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(
      <StoreProvider>
        <LearningInstitutionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      </StoreProvider>
    );

    const submitButton = screen.getByText(/Create/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Must be a valid URL/i)).toBeInTheDocument();
      expect(screen.getByText(/Must be a valid email/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone is required/i)).toBeInTheDocument();
    });

    expect(mockCreateInstitution).not.toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    const validData = {
      name: "Test Institution",
      description: "A test institution",
      website: "https://test.com",
      email: "test@test.com",
      phone: "123-456-7890",
      address: "123 Test St",
    };

    render(
      <StoreProvider>
        <LearningInstitutionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      </StoreProvider>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: validData.name },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: validData.description },
    });
    fireEvent.change(screen.getByLabelText(/Website/i), {
      target: { value: validData.website },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: validData.email },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: validData.phone },
    });
    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: validData.address },
    });

    fireEvent.click(screen.getByText(/Create/i));

    await waitFor(() => {
      expect(mockCreateInstitution).toHaveBeenCalledWith(validData);
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("closes dialog when cancel is clicked", () => {
    render(
      <StoreProvider>
        <LearningInstitutionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      </StoreProvider>
    );

    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
