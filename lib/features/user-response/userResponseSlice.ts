import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { userAnswersApiSlice } from "./userResponseApiSlice";
import { TQuestionAny, IQuestionFEMeta } from "@/app/questionnaires/types";

const notIn = (key: string, obj: Object) => !(key in obj);

export type UserResponseTextType = {
  text?: string;
};
export type UserResponseArraySelectType = {
  selectedOptions?: string[];
};

export interface AcceptedUserResponse<
  T extends UserResponseTextType | UserResponseArraySelectType
> {
  systemUserResponseId: string;
  systemAcceptTime: number;
  questionId: string;
  userResponse: T;
}

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
      userSortPosition: index, // Initialize with array index position
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
      if (notIn(action.payload.questionId, state.draftResponses)) {
        // @ts-ignore
        state.draftResponses[action.payload.questionId] = {};
      }

      if (
        notIn(
          "selectedOptions",
          state.draftResponses[action.payload.questionId]
        )
      ) {
        // @ts-ignore
        state.draftResponses[action.payload.questionId] = {
          selectedOptions: [],
        };
      }
      // @ts-ignore state.draftResponse doesn't like being 'selectedValues'
      state.draftResponses[action.payload.questionId].selectedOptions =
        action.payload.selectedOptions;

      // @ts-ignore 'text' is not a property
      delete state.draftResponses[action.payload.questionId]["text"];
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
  // Handle API states using extraReducers
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
        (state, action) => {
          state.isEditing = false;
          const question = state.questionMap[action.payload.questionId];
          question.userResponseHistory?.push(action.payload);
          // Clear draft after successful submission
          delete state.draftResponses[action.payload.questionId];
        }
      )
      .addMatcher(
        userAnswersApiSlice.endpoints.getQuestionnaire.matchFulfilled,
        (state, action) => {
          const questions = action.payload.questions || [];
          state.questionMap = questions.reduce((acc, question, index) => {
            acc[question.questionId] = initializeFEMeta(question, index);
            return acc;
          }, {} as TQuestionIdMap);
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
