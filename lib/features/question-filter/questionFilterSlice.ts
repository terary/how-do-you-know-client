import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { TQuestionAny } from "@/app/questionnaires/types";

interface QuestionFilterState {
  showSkipped: boolean;
  tagFilter: string;
}

export const questionFilterSlice = createSlice({
  name: "questionFilter",
  initialState: {
    showSkipped: false,
    tagFilter: "",
  } as QuestionFilterState,
  reducers: {
    setShowSkipped: (state, action: PayloadAction<boolean>) => {
      state.showSkipped = action.payload;
    },
    setTagFilter: (state, action: PayloadAction<string>) => {
      state.tagFilter = action.payload;
    },
    clearFilters: (state) => {
      state.showSkipped = false;
      state.tagFilter = "";
    },
  },
});

// Export actions
export const { setShowSkipped, setTagFilter, clearFilters } =
  questionFilterSlice.actions;

// Memoized base selectors
const selectQuestionMap = (state: RootState) =>
  state.userResponseUI.questionMap || {};
const selectShowSkipped = (state: RootState) =>
  state.questionFilter.showSkipped;
const selectTagFilter = (state: RootState) => state.questionFilter.tagFilter;

// Memoized filtered questions selector
export const selectFilteredQuestions = createSelector(
  [selectQuestionMap, selectShowSkipped, selectTagFilter],
  (questionMap, showSkipped, tagFilter) => {
    return Object.values(questionMap).filter((question) => {
      if (!showSkipped && question.feMeta?.isSkipped) {
        return false;
      }

      if (tagFilter && !question.feMeta?.userFlags?.includes(tagFilter)) {
        return false;
      }

      return true;
    });
  }
);
