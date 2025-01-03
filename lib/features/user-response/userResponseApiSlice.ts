import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  TQuestionAny,
  TUserResponseType,
} from "../../../app/questionnaires/types";
import { fetch } from "cross-fetch";

type SetUserResponseRequest = {
  questionId: string;
  userResponseType: TUserResponseType;
  userResponse: {
    text?: string;
    selectedOptions?: string[];
  };
};

type TUserResponse = {
  questionId: string;
  userResponseType: TUserResponseType;
  userResponse: {
    text?: string;
    selectedOptions?: string[];
  };
};

interface UserAnswersApiResponse {
  UserResponseHistory: TUserResponse[];
  total: number;
  skip: number;
  limit: number;
}

interface IGetQuestionnaireResponse {
  questionnaireId: string;
  questions: TQuestionAny[];
  examMetaData?: {
    examId?: string;
    proctorIds?: string[];
  };
}

interface IGetQuestionnaireRequestParameters {
  questionnaireId?: string;
}

// Define a service using a base URL and expected endpoints
export const userAnswersApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/dev-debug/user-answers",
    fetchFn: fetch,
  }),

  // initialState: initialState,
  reducerPath: "userResponseApi",

  // Tag types are used for caching and invalidation.
  tagTypes: ["UserAnswers", "questionnaire"],
  endpoints: (build) => ({
    // Supply generics for the return type (in this case `QuotesApiResponse`)
    // and the expected query argument. If there is no argument, use `void`
    // for the argument type instead.
    getQuestionnaire: build.query<
      IGetQuestionnaireResponse,
      // number
      IGetQuestionnaireRequestParameters
    >({
      query: (params) => {
        const END_POINT = "/questionnaire";
        if (params.questionnaireId) {
          return END_POINT + "?questionnaireId=" + params.questionnaireId;
        }
        return END_POINT;
      },

      // `providesTags` determines which 'tag' is attached to the
      // cached data returned by the query.
      providesTags: (result, error, id) => {
        return [
          { type: "questionnaire", id: id.questionnaireId, error, result },
        ];
      },
    }),

    // Add new mutation endpoint
    setUserResponse: build.mutation<TUserResponse, SetUserResponseRequest>({
      query: (userResponse) => ({
        url: "", // Empty string means use the baseUrl
        method: "POST",
        body: userResponse,
      }),
      // Invalidate the UserAnswers cache when a new response is added
      invalidatesTags: ["UserAnswers"],
      // transformResponse(baseQueryReturnValue, meta, arg) {
      //   console.log({ transformResponse: { baseQueryReturnValue, meta, arg } });
      //   return baseQueryReturnValue as unknown as TUserResponse;
      // },
    }),
  }),
});

// Hooks are auto-generated by RTK-Query
// Same as `quotesApiSlice.endpoints.getQuotes.useQuery`
export const { useSetUserResponseMutation, useGetQuestionnaireQuery } =
  userAnswersApiSlice;
