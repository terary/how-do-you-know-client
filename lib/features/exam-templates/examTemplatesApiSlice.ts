import { EndpointBuilder } from "@reduxjs/toolkit/query/react";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { apiSlice } from "@/lib/store/api/base";

export interface CreateExamTemplateDto {
  name: string;
  description: string;
  course_id: string;
  availability_start_date: string;
  availability_end_date: string;
  examExclusivityType: "exam-only" | "practice-only" | "exam-practice-both";
}

export interface UpdateExamTemplateDto {
  name?: string;
  description?: string;
  course_id?: string;
  availability_start_date?: string;
  availability_end_date?: string;
  examExclusivityType?: "exam-only" | "practice-only" | "exam-practice-both";
}

export interface ExamTemplate {
  id: string;
  name: string;
  description: string;
  course_id: string;
  availability_start_date: string;
  availability_end_date: string;
  examExclusivityType: "exam-only" | "practice-only" | "exam-practice-both";
  created_at: string;
  updated_at: string;
}

export interface CreateExamTemplateSectionDto {
  name: string;
  instructions: string;
  position: number;
  timeLimitSeconds: number;
}

export interface UpdateExamTemplateSectionDto {
  name?: string;
  instructions?: string;
  position?: number;
  timeLimitSeconds?: number;
}

export interface ExamTemplateSection {
  id: string;
  name: string;
  instructions: string;
  position: number;
  timeLimitSeconds: number;
  exam_template_id: string;
  created_at: string;
  updated_at: string;
}

export interface PreviewTemplateDto {
  format: "html" | "pdf" | "json";
}

type ApiTags =
  | "Users"
  | "QuestionTemplates"
  | "FodderPools"
  | "Profile"
  | "Questionnaire"
  | "UserAnswers";

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

const examTemplatesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: Builder) => ({
    getExamTemplates: builder.query<ExamTemplate[], void>({
      query: () => "/exam-templates",
      providesTags: ["QuestionTemplates"],
    }),

    getExamTemplate: builder.query<ExamTemplate, string>({
      query: (id: string) => `/exam-templates/${id}`,
      providesTags: (_result: unknown, _error: unknown, id: string) => [
        { type: "QuestionTemplates", id },
      ],
    }),

    createExamTemplate: builder.mutation<ExamTemplate, CreateExamTemplateDto>({
      query: (template: CreateExamTemplateDto) => ({
        url: "/exam-templates",
        method: "POST",
        body: template,
      }),
      invalidatesTags: ["QuestionTemplates"],
    }),

    updateExamTemplate: builder.mutation<
      ExamTemplate,
      { id: string; template: UpdateExamTemplateDto }
    >({
      query: ({
        id,
        template,
      }: {
        id: string;
        template: UpdateExamTemplateDto;
      }) => ({
        url: `/exam-templates/${id}`,
        method: "PUT",
        body: template,
      }),
      invalidatesTags: (
        _result: unknown,
        _error: unknown,
        { id }: { id: string }
      ) => [{ type: "QuestionTemplates", id }, "QuestionTemplates"],
    }),

    deleteExamTemplate: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/exam-templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["QuestionTemplates"],
    }),

    validateExamTemplate: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/exam-templates/${id}/validate`,
        method: "POST",
      }),
    }),

    createNewVersion: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/exam-templates/${id}/versions`,
        method: "POST",
      }),
      invalidatesTags: (_result: unknown, _error: unknown, id: string) => [
        { type: "QuestionTemplates", id },
        "QuestionTemplates",
      ],
    }),

    getTemplateHistory: builder.query<unknown, string>({
      query: (id: string) => `/exam-templates/${id}/history`,
    }),

    previewTemplate: builder.mutation<
      unknown,
      { id: string; format: PreviewTemplateDto }
    >({
      query: ({ id, format }: { id: string; format: PreviewTemplateDto }) => ({
        url: `/exam-templates/${id}/preview`,
        method: "POST",
        body: format,
      }),
    }),

    // Section endpoints
    getExamTemplateSections: builder.query<ExamTemplateSection[], string>({
      query: (examId: string) => `/exam-templates/${examId}/sections`,
      providesTags: (_result: unknown, _error: unknown, examId: string) => [
        { type: "QuestionTemplates", id: examId },
        "QuestionTemplates",
      ],
    }),

    getExamTemplateSection: builder.query<
      ExamTemplateSection,
      { examId: string; sectionId: string }
    >({
      query: ({ examId, sectionId }: { examId: string; sectionId: string }) =>
        `/exam-templates/${examId}/sections/${sectionId}`,
      providesTags: (
        _result: unknown,
        _error: unknown,
        { examId, sectionId }: { examId: string; sectionId: string }
      ) => [
        { type: "QuestionTemplates", id: `${examId}-${sectionId}` },
        { type: "QuestionTemplates", id: examId },
        "QuestionTemplates",
      ],
    }),

    createExamTemplateSection: builder.mutation<
      ExamTemplateSection,
      { examId: string; section: CreateExamTemplateSectionDto }
    >({
      query: ({
        examId,
        section,
      }: {
        examId: string;
        section: CreateExamTemplateSectionDto;
      }) => ({
        url: `/exam-templates/${examId}/sections`,
        method: "POST",
        body: section,
      }),
      invalidatesTags: (
        _result: unknown,
        _error: unknown,
        { examId }: { examId: string }
      ) => [{ type: "QuestionTemplates", id: examId }, "QuestionTemplates"],
    }),

    updateExamTemplateSection: builder.mutation<
      ExamTemplateSection,
      {
        examId: string;
        sectionId: string;
        section: UpdateExamTemplateSectionDto;
      }
    >({
      query: ({
        examId,
        sectionId,
        section,
      }: {
        examId: string;
        sectionId: string;
        section: UpdateExamTemplateSectionDto;
      }) => ({
        url: `/exam-templates/${examId}/sections/${sectionId}`,
        method: "PATCH",
        body: section,
      }),
      invalidatesTags: (
        _result: unknown,
        _error: unknown,
        { examId, sectionId }: { examId: string; sectionId: string }
      ) => [
        { type: "QuestionTemplates", id: `${examId}-${sectionId}` },
        { type: "QuestionTemplates", id: examId },
        "QuestionTemplates",
      ],
    }),
  }),
});

export const {
  useGetExamTemplatesQuery,
  useGetExamTemplateQuery,
  useCreateExamTemplateMutation,
  useUpdateExamTemplateMutation,
  useDeleteExamTemplateMutation,
  useValidateExamTemplateMutation,
  useCreateNewVersionMutation,
  useGetTemplateHistoryQuery,
  usePreviewTemplateMutation,
  useGetExamTemplateSectionsQuery,
  useGetExamTemplateSectionQuery,
  useCreateExamTemplateSectionMutation,
  useUpdateExamTemplateSectionMutation,
} = examTemplatesApiSlice;
