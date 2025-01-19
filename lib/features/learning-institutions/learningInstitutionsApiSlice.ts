import { EndpointBuilder } from "@reduxjs/toolkit/query/react";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { apiSlice } from "@/lib/store/api/base";
import type { InstructionalCourse } from "../instructional-courses/types";

export interface CreateLearningInstitutionDto {
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  address?: string;
}

export interface UpdateLearningInstitutionDto {
  name?: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface LearningInstitution {
  id: string;
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  address?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  courses: InstructionalCourse[];
}

type ApiTags =
  | "Users"
  | "QuestionTemplates"
  | "FodderPools"
  | "Profile"
  | "Questionnaire"
  | "UserAnswers"
  | "LearningInstitutions";

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

export const learningInstitutionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: Builder) => ({
    getLearningInstitutions: builder.query<LearningInstitution[], void>({
      query: () => "/learning-institutions",
      providesTags: ["LearningInstitutions"],
    }),

    getLearningInstitution: builder.query<LearningInstitution, string>({
      query: (id: string) => `/learning-institutions/${id}`,
      providesTags: (_result: unknown, _error: unknown, id: string) => [
        { type: "LearningInstitutions", id },
      ],
    }),

    createLearningInstitution: builder.mutation<
      LearningInstitution,
      CreateLearningInstitutionDto
    >({
      query: (institution: CreateLearningInstitutionDto) => ({
        url: "/learning-institutions",
        method: "POST",
        body: institution,
      }),
      invalidatesTags: ["LearningInstitutions"],
    }),

    updateLearningInstitution: builder.mutation<
      LearningInstitution,
      { id: string; institution: UpdateLearningInstitutionDto }
    >({
      query: ({
        id,
        institution,
      }: {
        id: string;
        institution: UpdateLearningInstitutionDto;
      }) => ({
        url: `/learning-institutions/${id}`,
        method: "PATCH",
        body: institution,
      }),
      invalidatesTags: (
        _result: unknown,
        _error: unknown,
        { id }: { id: string }
      ) => ["LearningInstitutions", { type: "LearningInstitutions", id }],
    }),

    deleteLearningInstitution: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/learning-institutions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LearningInstitutions"],
    }),
  }),
});

export const {
  useGetLearningInstitutionsQuery,
  useGetLearningInstitutionQuery,
  useCreateLearningInstitutionMutation,
  useUpdateLearningInstitutionMutation,
  useDeleteLearningInstitutionMutation,
} = learningInstitutionsApiSlice;
