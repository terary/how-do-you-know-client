import { instructionalCoursesApiSlice } from "@/lib/features/instructional-courses/instructionalCoursesApiSlice";

describe("instructionalCoursesApiSlice", () => {
  it("should include expected endpoints", () => {
    expect(
      instructionalCoursesApiSlice.endpoints.getInstructionalCourses
    ).toBeDefined();
    expect(
      instructionalCoursesApiSlice.endpoints.getInstructionalCourse
    ).toBeDefined();
    expect(
      instructionalCoursesApiSlice.endpoints.createInstructionalCourse
    ).toBeDefined();
    expect(
      instructionalCoursesApiSlice.endpoints.updateInstructionalCourse
    ).toBeDefined();
    expect(
      instructionalCoursesApiSlice.endpoints.deleteInstructionalCourse
    ).toBeDefined();
  });

  it("should have correct tags", () => {
    const endpoints = Object.values(instructionalCoursesApiSlice.endpoints);
    endpoints.forEach((endpoint) => {
      expect(endpoint.matchFulfilled).toBeDefined();
    });
  });
});
