import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { TQuestionAny, IQuestionFEMeta } from "@/app/questionnaires/types";
import type {
  ISetUserResponseResponse,
  IGetQuestionnaireResponse,
  UserResponseTextType,
  UserResponseArraySelectType,
  AcceptedUserResponse,
} from "./types";
import { userAnswersApiSlice } from "./userResponseApiSlice";

const notIn = (key: string, obj: Object) => !(key in obj);

type TQuestionIdMap = { [questionId: string]: TQuestionAny };

interface UserResponseState {
  draftResponses: Record<
    string,
    UserResponseArraySelectType | UserResponseTextType
  >;
  questionMap: TQuestionIdMap;
  isEditing: boolean;
}

const initialState: UserResponseState = {
  draftResponses: {},
  isEditing: false,
  questionMap: {},
};

const initializeFEMeta = (
  question: TQuestionAny,
  index: number
): TQuestionAny => {
  return {
    ...question,
    feMeta: {
      isSkipped: false,
      userFlags: "",
      userSortPosition: index,
    },
  };
};

export const userResponseSlice = createSlice({
  name: "userResponseUI",
  initialState,
  reducers: {
    setDraftResponse: (
      state,
      action: PayloadAction<{ questionId: string; text: string }>
    ) => {
      const { text } = action.payload;
      state.draftResponses[action.payload.questionId] = { text };
    },
    setArrayValueDraftResponse: (
      state,
      action: PayloadAction<{
        questionId: string;
        selectedOptions: string[];
      }>
    ) => {
      const draftResponse = state.draftResponses[
        action.payload.questionId
      ] as UserResponseArraySelectType;
      if (!draftResponse) {
        state.draftResponses[action.payload.questionId] = {
          selectedOptions: action.payload.selectedOptions,
        };
      } else {
        draftResponse.selectedOptions = action.payload.selectedOptions;
      }
    },
    clearDraftResponse: (state, action: PayloadAction<string>) => {
      delete state.draftResponses[action.payload];
    },
    commitDraftResponse: (
      state,
      action: PayloadAction<AcceptedUserResponse<UserResponseTextType>>
    ) => {
      delete state.draftResponses[action.payload.questionId];
    },
    commitArrayValueDraftResponse: (
      state,
      action: PayloadAction<AcceptedUserResponse<UserResponseArraySelectType>>
    ) => {
      delete state.draftResponses[action.payload.questionId];
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    updateQuestionFEMeta: (
      state,
      action: PayloadAction<{
        questionId: string;
        feMeta: IQuestionFEMeta;
      }>
    ) => {
      const question = state.questionMap[action.payload.questionId];
      if (question) {
        question.feMeta = action.payload.feMeta;
      }
    },
    unSkipAllQuestions: (state) => {
      Object.values(state.questionMap).forEach((question) => {
        if (question.feMeta) {
          question.feMeta.isSkipped = false;
        }
      });
    },
    resetAllFEMeta: (state) => {
      Object.values(state.questionMap).forEach((question, index) => {
        question.feMeta = {
          isSkipped: false,
          userFlags: "",
          userSortPosition: index,
        };
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        userAnswersApiSlice.endpoints.setUserResponse.matchPending,
        (state) => {
          state.isEditing = true;
        }
      )
      .addMatcher(
        userAnswersApiSlice.endpoints.setUserResponse.matchFulfilled,
        (state, action: PayloadAction<ISetUserResponseResponse>) => {
          state.isEditing = false;
          const question = state.questionMap[action.payload.questionId];
          if (question) {
            if (!question.userResponseHistory) {
              question.userResponseHistory = [];
            }
            question.userResponseHistory.push({
              questionId: action.payload.questionId,
              userResponse: action.payload.userResponse,
              systemUserResponseId: action.payload.systemUserResponseId,
              systemAcceptTime: new Date(
                action.payload.systemAcceptTimeUtc
              ).getTime(),
            });
          }
          delete state.draftResponses[action.payload.questionId];
        }
      )
      .addMatcher(
        userAnswersApiSlice.endpoints.getQuestionnaire.matchFulfilled,
        (state, action: PayloadAction<IGetQuestionnaireResponse>) => {
          const questions = action.payload.questions || [];
          state.questionMap = questions.reduce(
            (acc: TQuestionIdMap, question: TQuestionAny, index: number) => {
              acc[question.questionId] = initializeFEMeta(question, index);
              return acc;
            },
            {} as TQuestionIdMap
          );
        }
      );
  },
});

export const {
  setDraftResponse,
  setArrayValueDraftResponse,
  clearDraftResponse,
  setIsEditing,
  commitDraftResponse,
  commitArrayValueDraftResponse,
  updateQuestionFEMeta,
  unSkipAllQuestions,
  resetAllFEMeta,
} = userResponseSlice.actions;

export default userResponseSlice.reducer;
