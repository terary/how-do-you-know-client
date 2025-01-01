import {
  questionFilterSlice,
  setShowSkipped,
  setTagFilter,
  selectFilteredQuestions,
} from "@/lib/features/question-filter/questionFilterSlice";
import type { TQuestionAny } from "@/app/questionnaires/types";

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

    it("should not match questions with empty or undefined tags when filtering by tag", () => {
      const questionsWithEmptyTags = {
        ...mockQuestions,
        q4: {
          questionId: "q4",
          userPromptType: "text",
          userPromptText: "Question 4",
          userResponseType: "free-text-255",
          userResponse: { text: null },
          feMeta: {
            isSkipped: false,
            userFlags: "", // empty string
            userSortPosition: 3,
          },
        },
        q5: {
          questionId: "q5",
          userPromptType: "text",
          userPromptText: "Question 5",
          userResponseType: "free-text-255",
          userResponse: { text: null },
          feMeta: {
            isSkipped: false,
            userFlags: "   ", // whitespace only
            userSortPosition: 4,
          },
        },
        q6: {
          questionId: "q6",
          userPromptType: "text",
          userPromptText: "Question 6",
          userResponseType: "free-text-255",
          userResponse: { text: null },
          feMeta: {
            isSkipped: false,
            // userFlags undefined
            userSortPosition: 5,
          },
        },
      };

      const state = {
        questionFilter: {
          showSkipped: true,
          tagFilter: "important",
        },
        userResponseUI: {
          questionMap: questionsWithEmptyTags,
        },
      };

      const filtered = selectFilteredQuestions(state as any);
      expect(filtered).toHaveLength(2);
      expect(filtered.map((q) => q.questionId)).toEqual(["q1", "q2"]);
    });
  });
});
