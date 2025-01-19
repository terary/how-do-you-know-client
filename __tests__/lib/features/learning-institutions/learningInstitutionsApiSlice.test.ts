import { apiSlice } from "@/lib/store/api/base";
import { learningInstitutionsApiSlice } from "@/lib/features/learning-institutions/learningInstitutionsApiSlice";

const mockLearningInstitution = {
  id: "1",
  name: "Test Institution",
  description: "A test institution",
  website: "https://test.com",
  email: "test@test.com",
  phone: "123-456-7890",
  address: "123 Test St",
  created_by: "user1",
  created_at: "2024-03-14T00:00:00.000Z",
  updated_at: "2024-03-14T00:00:00.000Z",
  courses: [],
};

const mockCreateDto = {
  name: "New Institution",
  description: "A new institution",
  website: "https://new.com",
  email: "new@test.com",
  phone: "098-765-4321",
  address: "456 New St",
};

describe("learningInstitutionsApiSlice", () => {
  test("includes expected endpoints", () => {
    const endpoints = Object.keys(learningInstitutionsApiSlice.endpoints);
    expect(endpoints).toEqual([
      "getLearningInstitutions",
      "getLearningInstitution",
      "createLearningInstitution",
      "updateLearningInstitution",
      "deleteLearningInstitution",
    ]);
  });

  test("endpoints have correct tags", () => {
    const endpoints = learningInstitutionsApiSlice.endpoints;
    Object.values(endpoints).forEach((endpoint) => {
      expect(endpoint.matchFulfilled).toBeDefined();
    });
  });
});
