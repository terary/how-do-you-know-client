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
  title: string;
  instructions: string;
  position: number;
  timeLimitSeconds: number;
}

export interface UpdateExamTemplateSectionDto {
  title?: string;
  instructions?: string;
  position?: number;
  timeLimitSeconds?: number;
}

export interface ExamTemplateSection {
  id: string;
  title: string;
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

export interface QuestionMedia {
  type: "image" | "audio" | "video";
  url: string;
  alt?: string;
  mimeType?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  userPromptType: "text" | "multimedia";
  userResponseType: "free-text-255" | "multiple-choice-4" | "true-false";
  exclusivityType: "exam-only" | "practice-only" | "exam-practice-both";
  userPromptText: string;
  instructionText?: string;
  media?: MediaDto[];
  validAnswers: ValidAnswerDto[];
  created_at: string;
  updated_at: string;
}

export interface MediaDto {
  mediaContentType: string;
  height: number;
  width: number;
  url: string;
  specialInstructionText?: string;
  duration?: number;
  fileSize?: number;
  thumbnailUrl?: string;
}

export interface ValidAnswerDto {
  text?: string;
  booleanValue?: boolean;
  fodderPoolId?: string;
}

export interface GetQuestionsParams {
  search?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface BulkAddQuestionsDto {
  questionIds: string[];
}

export interface ReorderQuestionsDto {
  questionIds: string[];
}

type ApiTags =
  | "Users"
  | "QuestionTemplates"
  | "FodderPools"
  | "Profile"
  | "Questionnaire"
  | "UserAnswers"
  | "LearningInstitutions"
  | "InstructionalCourses"
  | "ExamTemplates"
  | "ExamTemplateSections"
  | "Questions";

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

export const examTemplatesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: Builder) => ({
    getExamTemplates: builder.query<ExamTemplate[], void>({
      query: () => "/exam-templates",
      providesTags: ["ExamTemplates"],
    }),

    getExamTemplate: builder.query<ExamTemplate, string>({
      query: (id: string) => `/exam-templates/${id}`,
      providesTags: (_result: unknown, _error: unknown, id: string) => [
        { type: "ExamTemplates", id },
      ],
    }),

    createExamTemplate: builder.mutation<ExamTemplate, CreateExamTemplateDto>({
      query: (template: CreateExamTemplateDto) => ({
        url: "/exam-templates",
        method: "POST",
        body: template,
      }),
      invalidatesTags: ["ExamTemplates"],
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
      ) => [{ type: "ExamTemplates", id }, "ExamTemplates"],
    }),

    deleteExamTemplate: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/exam-templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ExamTemplates"],
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
        { type: "ExamTemplates", id },
        "ExamTemplates",
      ],
    }),

    getTemplateHistory: builder.query<unknown, string>({
      query: (id: string) => `/exam-templates/${id}/history`,
    }),

    previewTemplate: builder.mutation<
      unknown,
      { id: string; format: { format: "html" | "pdf" | "json" } }
    >({
      query: ({
        id,
        format,
      }: {
        id: string;
        format: { format: "html" | "pdf" | "json" };
      }) => ({
        url: `/exam-templates/${id}/preview`,
        method: "POST",
        body: { format: format.format },
      }),
    }),

    // Section endpoints
    getExamTemplateSections: builder.query<ExamTemplateSection[], string>({
      query: (examId: string) => `/exam-templates/${examId}/sections`,
      providesTags: (_result: unknown, _error: unknown, examId: string) => [
        { type: "ExamTemplates", id: examId },
        "ExamTemplates",
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
        { type: "ExamTemplates", id: `${examId}-${sectionId}` },
        { type: "ExamTemplates", id: examId },
        "ExamTemplates",
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
      ) => [{ type: "ExamTemplates", id: examId }, "ExamTemplates"],
    }),

    updateExamTemplateSection: builder.mutation<
      void,
      {
        examId: string;
        sectionId: string;
        section: UpdateExamTemplateSectionDto;
      }
    >({
      query: ({ examId, sectionId, section }) => ({
        url: `/exam-templates/${examId}/sections/${sectionId}`,
        method: "PATCH",
        body: section,
      }),
      invalidatesTags: (_result, _error, { examId }) => [
        { type: "ExamTemplates", id: examId },
        "ExamTemplates",
      ],
      async onQueryStarted(
        { examId, sectionId, section },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to update section:", error);
        }
      },
    }),

    // Question endpoints
    getQuestions: builder.query<Question[], GetQuestionsParams>({
      query: (params: GetQuestionsParams) => ({
        url: "/questions/templates",
        params,
      }),
      providesTags: ["Questions"],
    }),

    bulkAddQuestions: builder.mutation<
      void,
      { examId: string; sectionId: string; questionIds: string[] }
    >({
      query: ({
        examId,
        sectionId,
        questionIds,
      }: {
        examId: string;
        sectionId: string;
        questionIds: string[];
      }) => ({
        url: `/exam-templates/${examId}/sections/${sectionId}/questions/bulk`,
        method: "POST",
        body: { questionIds },
      }),
      invalidatesTags: (
        _result: unknown,
        _error: unknown,
        { examId, sectionId }: { examId: string; sectionId: string }
      ) => [
        { type: "Questions", id: `section-${sectionId}-questions` },
        { type: "Questions", id: `${examId}-${sectionId}` },
        "Questions",
      ],
    }),

    deleteQuestionFromSection: builder.mutation<
      void,
      { examId: string; sectionId: string; questionId: string }
    >({
      query: ({ examId, sectionId, questionId }) => ({
        url: `/exam-templates/${examId}/sections/${sectionId}/questions/${questionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (
        _result: unknown,
        _error: unknown,
        { sectionId }: { examId: string; sectionId: string }
      ) => [
        { type: "Questions", id: `section-${sectionId}-questions` },
        "Questions",
      ],
    }),

    deleteExamTemplateSection: builder.mutation<
      void,
      { examId: string; sectionId: string }
    >({
      query: ({
        examId,
        sectionId,
      }: {
        examId: string;
        sectionId: string;
      }) => ({
        url: `/exam-templates/${examId}/sections/${sectionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (
        _result: unknown,
        _error: unknown,
        { examId, sectionId }: { examId: string; sectionId: string }
      ) => [
        { type: "ExamTemplates", id: `${examId}-${sectionId}` },
        { type: "ExamTemplates", id: examId },
        "ExamTemplates",
      ],
    }),

    reorderSectionQuestions: builder.mutation<
      void,
      { examId: string; sectionId: string; questionIds: string[] }
    >({
      query: ({
        examId,
        sectionId,
        questionIds,
      }: {
        examId: string;
        sectionId: string;
        questionIds: string[];
      }) => ({
        url: `/exam-templates/${examId}/sections/${sectionId}/questions/reorder`,
        method: "PUT",
        body: { questionIds },
      }),
      invalidatesTags: (
        _result: unknown,
        _error: unknown,
        { examId, sectionId }: { examId: string; sectionId: string }
      ) => [
        { type: "ExamTemplates", id: `${examId}-${sectionId}` },
        { type: "ExamTemplates", id: examId },
        "ExamTemplates",
      ],
    }),

    getSectionQuestions: builder.query<
      Question[],
      { examId: string; sectionId: string }
    >({
      query: ({ examId, sectionId }) =>
        `/exam-templates/${examId}/sections/${sectionId}/questions`,
      providesTags: (_result: unknown, _error: unknown, { sectionId }) => [
        { type: "ExamTemplates", id: `section-${sectionId}-questions` },
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
  useGetQuestionsQuery,
  useGetSectionQuestionsQuery,
  useBulkAddQuestionsMutation,
  useDeleteExamTemplateSectionMutation,
  useReorderSectionQuestionsMutation,
  useDeleteQuestionFromSectionMutation,
} = examTemplatesApiSlice;
