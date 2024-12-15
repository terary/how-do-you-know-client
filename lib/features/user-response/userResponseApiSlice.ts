// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  TQuestionAny,
  TUserResponseType,
} from "../../../app/questionnaires/types";
import { UserResponse } from "@/app/components/questionnaires/UserResponse";

type SetUserResponseRequest = {
  questionId: string;
  userResponseType: TUserResponseType;
  userResponse: {
    text: string;
  };
};

type TUserResponse = {
  questionId: string;
  userResponseType: TUserResponseType;
  userResponse: {
    text: string;
  };
};

interface UserAnswersApiResponse {
  UserResponses: TUserResponse[];
  total: number;
  skip: number;
  limit: number;
}

const initialState = { UserResponses: [], total: 0, skip: 0, limit: 0 };
// Define a service using a base URL and expected endpoints
export const userAnswersApiSlice = createApi({
  // baseQuery: fetchBaseQuery({ baseUrl: "https://dummyjson.com/quotes" }),
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://predicatetree.com/questionnaires/questions.json",
    baseUrl: "http://localhost:3001/dev-debug/user-answers",

    isJsonContentType: () => true,
  }),

  // initialState: initialState,
  reducerPath: "userAnswersApi",
  // Tag types are used for caching and invalidation.
  tagTypes: ["UserAnswers"],
  endpoints: (build) => ({
    // Supply generics for the return type (in this case `QuotesApiResponse`)
    // and the expected query argument. If there is no argument, use `void`
    // for the argument type instead.
    getUserAnswers: build.query<UserAnswersApiResponse, number>({
      query: (limit = 10) => `?limit=${limit}`,

      // `providesTags` determines which 'tag' is attached to the
      // cached data returned by the query.
      providesTags: (result, error, id) => [{ type: "UserAnswers", id, error }],
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
    }),
  }),
});

// Hooks are auto-generated by RTK-Query
// Same as `quotesApiSlice.endpoints.getQuotes.useQuery`
//export const { useGetQuestionsQuery } = UserAnswersApiSlice;
export const { useGetUserAnswersQuery, useSetUserResponseMutation } =
  userAnswersApiSlice;
