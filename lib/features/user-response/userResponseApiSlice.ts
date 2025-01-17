import { apiSlice } from "@/lib/store/api/base";
import type {
  TQuestionAny,
  TUserResponseType,
} from "@/app/questionnaires/types";

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

export const userAnswersApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getQuestionnaire: build.query<
      IGetQuestionnaireResponse,
      IGetQuestionnaireRequestParameters
    >({
      query: (params) => {
        const END_POINT = "/dev-debug/user-answers/questionnaire";
        if (params.questionnaireId) {
          return END_POINT + "?questionnaireId=" + params.questionnaireId;
        }
        return END_POINT;
      },
      providesTags: (result, error, id) => {
        return [
          { type: "Questionnaire", id: id.questionnaireId, error, result },
        ];
      },
    }),

    setUserResponse: build.mutation<TUserResponse, SetUserResponseRequest>({
      query: (userResponse) => ({
        url: "/dev-debug/user-answers",
        method: "POST",
        body: userResponse,
      }),
      invalidatesTags: ["UserAnswers"],
    }),
  }),
});
