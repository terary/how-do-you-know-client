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

      if (tagFilter) {
        const searchText = tagFilter.toLowerCase().trim();
        const questionTags =
          question.feMeta?.userFlags?.toLowerCase().trim().split(/\s+/) || [];

        // If no tags in question, don't match
        if (questionTags.length === 0) return false;

        // Check if any question tag contains the search text
        return questionTags.some((tag) => tag.includes(searchText));
      }

      return true;
    });
  }
);
