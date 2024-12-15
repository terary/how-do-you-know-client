import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { userAnswersApiSlice } from "./userResponseApiSlice";
interface AcceptedUserResponse {
  systemUserResponseId: string;
  systemAcceptTime: number;
  questionId: string;
  userResponse: {
    text: string;
  };
}

interface UserResponseState {
  currentResponse: string;
  draftResponses: Record<string, string>;
  acceptedResponses: Record<string, AcceptedUserResponse>;
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
      state.draftResponses[action.payload.questionId] = action.payload.text;
    },
    clearDraftResponse: (state, action: PayloadAction<string>) => {
      console.log({ clearDraftResponse: { action } });
      delete state.draftResponses[action.payload];
    },
    commitDraftResponse: (
      state,
      action: PayloadAction<AcceptedUserResponse>
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
  clearDraftResponse,
  setIsEditing,
  commitDraftResponse,
} = userResponseSlice.actions;
export default userResponseSlice.reducer;
