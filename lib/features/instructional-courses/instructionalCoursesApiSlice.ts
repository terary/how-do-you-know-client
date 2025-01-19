import { EndpointBuilder } from "@reduxjs/toolkit/query/react";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { apiSlice } from "@/lib/store/api/base";
import type {
  InstructionalCourse,
  CreateInstructionalCourseDto,
  UpdateInstructionalCourseDto,
} from "./types";

type ApiTags =
  | "Users"
  | "QuestionTemplates"
  | "FodderPools"
  | "Profile"
  | "Questionnaire"
  | "UserAnswers"
  | "LearningInstitutions"
  | "InstructionalCourses";

type Builder = EndpointBuilder<
  BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    {},
    FetchBaseQueryMeta
  >,
  ApiTags,
  "api"
>;

export const instructionalCoursesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: Builder) => ({
    getInstructionalCourses: builder.query<InstructionalCourse[], void>({
      query: () => "/instructional-courses",
      providesTags: ["InstructionalCourses"],
    }),

    getInstructionalCourse: builder.query<InstructionalCourse, string>({
      query: (id) => `/instructional-courses/${id}`,
      providesTags: ["InstructionalCourses"],
    }),

    createInstructionalCourse: builder.mutation<
      InstructionalCourse,
      CreateInstructionalCourseDto
    >({
      query: (course) => ({
        url: "/instructional-courses",
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["InstructionalCourses"],
    }),

    updateInstructionalCourse: builder.mutation<
      InstructionalCourse,
      { id: string; course: UpdateInstructionalCourseDto }
    >({
      query: ({ id, course }) => ({
        url: `/instructional-courses/${id}`,
        method: "PATCH",
        body: course,
      }),
      invalidatesTags: ["InstructionalCourses"],
    }),

    deleteInstructionalCourse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/instructional-courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InstructionalCourses"],
    }),
  }),
});

export const {
  useGetInstructionalCoursesQuery,
  useGetInstructionalCourseQuery,
  useCreateInstructionalCourseMutation,
  useUpdateInstructionalCourseMutation,
  useDeleteInstructionalCourseMutation,
} = instructionalCoursesApiSlice;
