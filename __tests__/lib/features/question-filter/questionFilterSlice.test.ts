import {
  questionFilterSlice,
  setShowSkipped,
  setTagFilter,
  clearFilters,
  selectFilteredQuestions,
} from "../../../../lib/features/question-filter/questionFilterSlice";
import { TQuestionAny } from "../../../../app/questionnaires/types";

describe("questionFilterSlice", () => {
  const initialState = {
    showSkipped: false,
    tagFilter: "",
  };

  describe("reducers", () => {
    it("should handle initial state", () => {
      expect(
        questionFilterSlice.reducer(undefined, { type: "unknown" })
      ).toEqual(initialState);
    });

    it("should handle setShowSkipped", () => {
      const actual = questionFilterSlice.reducer(
        initialState,
        setShowSkipped(true)
      );
      expect(actual.showSkipped).toBe(true);
    });

    it("should handle setTagFilter", () => {
      const actual = questionFilterSlice.reducer(
        initialState,
        setTagFilter("important")
      );
      expect(actual.tagFilter).toBe("important");
    });

    it("should handle clearFilters", () => {
      const stateWithFilters = {
        showSkipped: true,
        tagFilter: "important",
      };
      const actual = questionFilterSlice.reducer(
        stateWithFilters,
        clearFilters()
      );
      expect(actual).toEqual(initialState);
    });
  });

  describe("selectors", () => {
    const mockQuestions: Record<string, TQuestionAny> = {
      q1: {
        questionId: "q1",
        userPromptType: "text",
        userPromptText: "Question 1",
        userResponseType: "free-text-255",
        userResponse: { text: null },
        feMeta: {
          isSkipped: false,
          isUserFlagged: false,
          userFlags: "important",
          userSortPosition: 0,
        },
      },
      q2: {
        questionId: "q2",
        userPromptType: "text",
        userPromptText: "Question 2",
        userResponseType: "free-text-255",
        userResponse: { text: null },
        feMeta: {
          isSkipped: true,
          isUserFlagged: false,
          userFlags: "important",
          userSortPosition: 1,
        },
      },
      q3: {
        questionId: "q3",
        userPromptType: "text",
        userPromptText: "Question 3",
        userResponseType: "free-text-255",
        userResponse: { text: null },
        feMeta: {
          isSkipped: false,
          isUserFlagged: false,
          userFlags: "urgent",
          userSortPosition: 2,
        },
      },
    };

    it("should filter skipped questions when showSkipped is false", () => {
      const state = {
        questionFilter: {
          showSkipped: false,
          tagFilter: "",
        },
        userResponseUI: {
          questionMap: mockQuestions,
        },
      };

      const filtered = selectFilteredQuestions(state as any);
      expect(filtered).toHaveLength(2);
      expect(filtered.map((q) => q.questionId)).toEqual(["q1", "q3"]);
    });

    it("should show all questions when showSkipped is true", () => {
      const state = {
        questionFilter: {
          showSkipped: true,
          tagFilter: "",
        },
        userResponseUI: {
          questionMap: mockQuestions,
        },
      };

      const filtered = selectFilteredQuestions(state as any);
      expect(filtered).toHaveLength(3);
    });

    it("should filter by tag when tagFilter is set", () => {
      const state = {
        questionFilter: {
          showSkipped: true,
          tagFilter: "important",
        },
        userResponseUI: {
          questionMap: mockQuestions,
        },
      };

      const filtered = selectFilteredQuestions(state as any);
      expect(filtered).toHaveLength(2);
      expect(filtered.map((q) => q.questionId)).toEqual(["q1", "q2"]);
    });

    it("should apply both filters when showSkipped is false and tagFilter is set", () => {
      const state = {
        questionFilter: {
          showSkipped: false,
          tagFilter: "important",
        },
        userResponseUI: {
          questionMap: mockQuestions,
        },
      };

      const filtered = selectFilteredQuestions(state as any);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].questionId).toBe("q1");
    });
  });
});
