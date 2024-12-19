import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { userAnswersApiSlice } from "./userResponseApiSlice";

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

interface UserResponseState {
  currentResponse: string;
  //  draftResponses: Record<string, string>;
  draftResponses: Record<
    string,
    UserResponseArraySelectType | UserResponseTextType
  >;
  //
  acceptedResponses: Record<
    string,
    AcceptedUserResponse<UserResponseTextType | UserResponseArraySelectType>
  >;
  isEditing: boolean;
}

const initialState: UserResponseState = {
  currentResponse: "",
  draftResponses: {},
  acceptedResponses: {},
  isEditing: false,
};

export const userResponseSlice = createSlice({
  name: "userResponse",
  initialState,
  reducers: {
    setDraftResponse: (
      state,
      action: PayloadAction<{ questionId: string; text: string }>
    ) => {
      console.log({
        stateKeys: Object.keys(state),
        currentResponseKeys: Object.keys(state.currentResponse),
      });
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
      console.log({ clearDraftResponse: { action } });
      delete state.draftResponses[action.payload];
    },
    commitDraftResponse: (
      state,
      action: PayloadAction<AcceptedUserResponse<UserResponseTextType>>
    ) => {
      console.log({
        commitDraftResponse: { action },
        stateKeys: Object.keys(state),
        acceptedResponses: state.acceptedResponses,
        acceptedResponsesKeys: Object.keys(state.acceptedResponses),
      });
      state.acceptedResponses[action.payload.questionId] = action.payload;
      delete state.draftResponses[action.payload.questionId];
    },
    commitArrayValueDraftResponse: (
      state,
      action: PayloadAction<AcceptedUserResponse<UserResponseArraySelectType>>
    ) => {
      console.log({
        commitDraftResponse: { action },
        stateKeys: Object.keys(state),
        acceptedResponses: state.acceptedResponses,
        acceptedResponsesKeys: Object.keys(state.acceptedResponses),
      });
      state.acceptedResponses[action.payload.questionId] = action.payload;
      delete state.draftResponses[action.payload.questionId];
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
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
          // Clear draft after successful submission
          delete state.draftResponses[action.payload.questionId];
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
} = userResponseSlice.actions;
export default userResponseSlice.reducer;
