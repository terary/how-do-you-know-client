import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { apiSlice } from "@/lib/store/api/base";

export type UserPromptType = "text" | "multimedia";
export type UserResponseType =
  | "free-text-255"
  | "multiple-choice-4"
  | "true-false";
export type ExclusivityType =
  | "exam-only"
  | "practice-only"
  | "exam-practice-both";

export interface MediaDto {
  mediaContentType:
    | "application/octet-stream"
    | "image/jpeg"
    | "image/png"
    | "image/gif"
    | "image/webp"
    | "image/svg+xml"
    | "image/*"
    | "audio/mpeg"
    | "audio/wav"
    | "audio/ogg"
    | "audio/aac"
    | "audio/webm"
    | "audio/*"
    | "video/mp4"
    | "video/webm"
    | "video/ogg"
    | "video/avi"
    | "video/quicktime"
    | "video/*";
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

export interface QuestionTemplate {
  id: string;
  userPromptType: UserPromptType;
  userResponseType: UserResponseType;
  exclusivityType: ExclusivityType;
  userPromptText: string;
  instructionText: string;
  validAnswers: ValidAnswerDto[];
  media?: MediaDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateDto {
  userPromptType: UserPromptType;
  userResponseType: UserResponseType;
  exclusivityType: ExclusivityType;
  userPromptText: string;
  instructionText: string;
  validAnswers: ValidAnswerDto[];
  media?: MediaDto[];
}

export interface UpdateTemplateDto extends Partial<CreateTemplateDto> {}

type Builder = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  "QuestionTemplates",
  "api"
>;

const questionTemplatesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: Builder) => ({
    getQuestionTemplates: builder.query<QuestionTemplate[], void>({
      query: () => "/questions/templates",
      providesTags: ["QuestionTemplates"],
    }),

    getQuestionTemplate: builder.query<QuestionTemplate, string>({
      query: (id: string) => `/questions/templates/${id}`,
      providesTags: (_result: unknown, _error: unknown, id: string) => [
        { type: "QuestionTemplates", id },
      ],
    }),

    createQuestionTemplate: builder.mutation<
      QuestionTemplate,
      CreateTemplateDto
    >({
      query: (template: CreateTemplateDto) => ({
        url: "/questions/templates",
        method: "POST",
        body: template,
      }),
      invalidatesTags: ["QuestionTemplates"],
    }),

    updateQuestionTemplate: builder.mutation<
      QuestionTemplate,
      { id: string; template: UpdateTemplateDto }
    >({
      query: ({
        id,
        template,
      }: {
        id: string;
        template: UpdateTemplateDto;
      }) => ({
        url: `/questions/templates/${id}`,
        method: "PATCH",
        body: template,
      }),
      invalidatesTags: (
        _result: unknown,
        _error: unknown,
        { id }: { id: string }
      ) => [{ type: "QuestionTemplates", id }, "QuestionTemplates"],
    }),

    deleteQuestionTemplate: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/questions/templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["QuestionTemplates"],
    }),
  }),
});

export const {
  useGetQuestionTemplatesQuery,
  useGetQuestionTemplateQuery,
  useCreateQuestionTemplateMutation,
  useUpdateQuestionTemplateMutation,
  useDeleteQuestionTemplateMutation,
} = questionTemplatesApiSlice;
