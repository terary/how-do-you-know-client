import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  IGetQuestionnaireRequestParameters,
  IGetQuestionnaireResponse,
  ISetUserResponseRequest,
  ISetUserResponseResponse,
} from "./types";

export const userAnswersApiSlice = createApi({
  reducerPath: "userAnswersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001",
  }),
  tagTypes: ["Questionnaire"],
  endpoints: (builder) => ({
    getQuestionnaire: builder.query<
      IGetQuestionnaireResponse,
      IGetQuestionnaireRequestParameters
    >({
      query: ({ questionnaireId }: IGetQuestionnaireRequestParameters) => ({
        url: questionnaireId
          ? `/dev-debug/user-answers/questionnaire?questionnaireId=${questionnaireId}`
          : "/dev-debug/user-answers/questionnaire",
        method: "GET",
        credentials: "same-origin",
      }),
      providesTags: ["Questionnaire"],
    }),
    setUserResponse: builder.mutation<
      ISetUserResponseResponse,
      ISetUserResponseRequest
    >({
      query: (body: ISetUserResponseRequest) => ({
        url: "/dev-debug/user-answers",
        method: "POST",
        body,
        credentials: "same-origin",
      }),
      invalidatesTags: ["Questionnaire"],
    }),
  }),
});

export const { useGetQuestionnaireQuery, useSetUserResponseMutation } =
  userAnswersApiSlice;

// Export the endpoint matchers for use in other slices
export const {
  endpoints: { getQuestionnaire, setUserResponse },
} = userAnswersApiSlice;
