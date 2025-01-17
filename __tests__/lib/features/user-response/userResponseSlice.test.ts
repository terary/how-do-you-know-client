import userResponseReducer, {
  setDraftResponse,
  setArrayValueDraftResponse,
  clearDraftResponse,
  commitDraftResponse,
  commitArrayValueDraftResponse,
  setIsEditing,
  updateQuestionFEMeta,
  unSkipAllQuestions,
  resetAllFEMeta,
} from "../../../../lib/features/user-response/userResponseSlice";
import { userAnswersApiSlice } from "../../../../lib/features/user-response/userResponseApiSlice";
import type { TQuestionUserResponseText } from "../../../../app/questionnaires/types";

describe("userResponseSlice", () => {
  const initialState = {
    draftResponses: {},
    questionMap: {},
    isEditing: false,
  };

  describe("reducers", () => {
    it("should handle initial state", () => {
      expect(userResponseReducer(undefined, { type: "unknown" })).toEqual(
        initialState
      );
    });

    it("should handle setDraftResponse", () => {
      const actual = userResponseReducer(
        initialState,
        setDraftResponse({ questionId: "q1", text: "test answer" })
      );
      expect(actual.draftResponses).toEqual({
        q1: { text: "test answer" },
      });
    });

    it("should handle setArrayValueDraftResponse", () => {
      const actual = userResponseReducer(
        initialState,
        setArrayValueDraftResponse({
          questionId: "q1",
          selectedOptions: ["option1", "option2"],
        })
      );
      expect(actual.draftResponses).toEqual({
        q1: { selectedOptions: ["option1", "option2"] },
      });
    });

    it("should handle clearDraftResponse", () => {
      const stateWithDraft = {
        ...initialState,
        draftResponses: { q1: { text: "test" } },
      };
      const actual = userResponseReducer(
        stateWithDraft,
        clearDraftResponse("q1")
      );
      expect(actual.draftResponses).toEqual({});
    });

    it("should handle commitDraftResponse", () => {
      const stateWithDraft = {
        ...initialState,
        draftResponses: { q1: { text: "test" } },
      };
      const actual = userResponseReducer(
        stateWithDraft,
        commitDraftResponse({
          systemUserResponseId: "sys1",
          systemAcceptTime: 123456789,
          questionId: "q1",
          userResponse: { text: "test" },
        })
      );
      expect(actual.draftResponses).toEqual({});
    });

    it("should handle commitArrayValueDraftResponse", () => {
      const stateWithDraft = {
        ...initialState,
        draftResponses: { q1: { selectedOptions: ["option1"] } },
      };
      const actual = userResponseReducer(
        stateWithDraft,
        commitArrayValueDraftResponse({
          systemUserResponseId: "sys1",
          systemAcceptTime: 123456789,
          questionId: "q1",
          userResponse: { selectedOptions: ["option1"] },
        })
      );
      expect(actual.draftResponses).toEqual({});
    });

    it("should handle setIsEditing", () => {
      const actual = userResponseReducer(initialState, setIsEditing(true));
      expect(actual.isEditing).toBe(true);
    });
  });

  describe("extraReducers", () => {
    it("should set isEditing to true when setUserResponse is pending", () => {
      const actual = userResponseReducer(initialState, {
        type: `${userAnswersApiSlice.reducerPath}/executeMutation/pending`,
        meta: {
          arg: {
            endpointName: "setUserResponse",
          },
        },
      });
      expect(actual.isEditing).toBe(true);
    });

    it("should handle setUserResponse fulfilled with existing question", () => {
      const mockQuestion: TQuestionUserResponseText = {
        questionId: "q1",
        userPromptType: "text",
        userPromptText: "test question",
        userResponseType: "free-text-255",
        userResponseHistory: [],
        userResponse: { text: null },
      };

      const stateWithQuestion = {
        ...initialState,
        questionMap: {
          q1: mockQuestion,
        },
        draftResponses: { q1: { text: "draft" } },
      };

      const actual = userResponseReducer(stateWithQuestion, {
        type: `${userAnswersApiSlice.reducerPath}/executeMutation/fulfilled`,
        meta: {
          arg: {
            endpointName: "setUserResponse",
          },
        },
        payload: {
          questionId: "q1",
          userResponse: { text: "submitted" },
          systemUserResponseId: "sys1",
          systemAcceptTimeUtc: "2024-03-21T10:00:00Z",
        },
      });
      expect(actual.isEditing).toBe(false);
      expect(actual.questionMap.q1.userResponseHistory).toContainEqual({
        questionId: "q1",
        userResponse: { text: "submitted" },
        systemUserResponseId: "sys1",
        systemAcceptTime: new Date("2024-03-21T10:00:00Z").getTime(),
      });
      expect(actual.draftResponses.q1).toBeUndefined();
    });

    it("should handle getQuestionnaire fulfilled with empty questions", () => {
      const actual = userResponseReducer(initialState, {
        type: `${userAnswersApiSlice.reducerPath}/executeQuery/fulfilled`,
        meta: {
          arg: {
            endpointName: "getQuestionnaire",
          },
        },
        payload: {
          questions: [],
        },
      });
      expect(actual.questionMap).toEqual({});
    });

    it("should handle getQuestionnaire fulfilled with multiple questions", () => {
      const mockQuestions: TQuestionUserResponseText[] = [
        {
          questionId: "q1",
          userPromptType: "text",
          userPromptText: "question 1",
          userResponseType: "free-text-255",
          userResponseHistory: [],
          userResponse: { text: null },
          feMeta: {
            isSkipped: false,
            userFlags: "",
            userSortPosition: 0,
          },
        },
        {
          questionId: "q2",
          userPromptType: "text",
          userPromptText: "question 2",
          userResponseType: "free-text-255",
          userResponseHistory: [],
          userResponse: { text: null },
          feMeta: {
            isSkipped: false,
            userFlags: "",
            userSortPosition: 1,
          },
        },
      ];

      const actual = userResponseReducer(initialState, {
        type: `${userAnswersApiSlice.reducerPath}/executeQuery/fulfilled`,
        meta: {
          arg: {
            endpointName: "getQuestionnaire",
          },
        },
        payload: {
          questions: mockQuestions,
        },
      });

      expect(actual.questionMap).toEqual({
        q1: mockQuestions[0],
        q2: mockQuestions[1],
      });
    });

    it("should handle getQuestionnaire fulfilled with undefined questions", () => {
      const actual = userResponseReducer(initialState, {
        type: `${userAnswersApiSlice.reducerPath}/executeQuery/fulfilled`,
        meta: {
          arg: {
            endpointName: "getQuestionnaire",
          },
        },
        payload: {},
      });
      expect(actual.questionMap).toEqual({});
    });
  });

  describe("updateQuestionFEMeta", () => {
    it("should handle updateQuestionFEMeta when question exists", () => {
      const initialQuestionState = {
        ...initialState,
        questionMap: {
          q1: {
            questionId: "q1",
            userPromptType: "text",
            userPromptText: "test question",
            userResponseType: "free-text-255",
            userResponse: { text: null },
            feMeta: {
              isSkipped: false,
              userFlags: "",
              userSortPosition: 0,
            },
          } as TQuestionUserResponseText,
        },
      };

      const actual = userResponseReducer(
        initialQuestionState,
        updateQuestionFEMeta({
          questionId: "q1",
          feMeta: {
            isSkipped: true,
            userFlags: "flag1",
            userSortPosition: 1,
          },
        })
      );

      expect(actual.questionMap.q1.feMeta).toEqual({
        isSkipped: true,
        userFlags: "flag1",
        userSortPosition: 1,
      });
    });

    it("should not modify state when question does not exist", () => {
      const actual = userResponseReducer(
        initialState,
        updateQuestionFEMeta({
          questionId: "nonexistent",
          feMeta: {
            isSkipped: true,
            userFlags: "flag1",
            userSortPosition: 1,
          },
        })
      );

      expect(actual).toEqual(initialState);
    });
  });

  describe("unSkipAllQuestions", () => {
    it("should set isSkipped to false for all questions", () => {
      const stateWithSkippedQuestions = {
        ...initialState,
        questionMap: {
          q1: {
            questionId: "q1",
            userPromptType: "text",
            userPromptText: "test question",
            userResponseType: "free-text-255",
            userResponse: { text: null },
            feMeta: {
              isSkipped: true,
              userFlags: "",
              userSortPosition: 0,
            },
          } as TQuestionUserResponseText,
          q2: {
            questionId: "q2",
            userPromptType: "text",
            userPromptText: "test question",
            userResponseType: "free-text-255",
            userResponse: { text: null },
            feMeta: {
              isSkipped: true,
              userFlags: "",
              userSortPosition: 1,
            },
          } as TQuestionUserResponseText,
        },
      };

      const actual = userResponseReducer(
        stateWithSkippedQuestions,
        unSkipAllQuestions()
      );

      const q1FeMeta = actual.questionMap.q1?.feMeta;
      const q2FeMeta = actual.questionMap.q2?.feMeta;

      expect(q1FeMeta).toBeDefined();
      expect(q2FeMeta).toBeDefined();

      if (q1FeMeta && q2FeMeta) {
        expect(q1FeMeta.isSkipped).toBe(false);
        expect(q2FeMeta.isSkipped).toBe(false);
      }
    });
  });

  describe("resetAllFEMeta", () => {
    it("should reset all feMeta to initial values", () => {
      const stateWithModifiedFEMeta = {
        ...initialState,
        questionMap: {
          q1: {
            questionId: "q1",
            userPromptType: "text",
            userPromptText: "test question",
            userResponseType: "free-text-255",
            userResponse: { text: null },
            feMeta: {
              isSkipped: true,
              userFlags: "flag1",
              userSortPosition: 5,
            },
          } as TQuestionUserResponseText,
          q2: {
            questionId: "q2",
            userPromptType: "text",
            userPromptText: "test question",
            userResponseType: "free-text-255",
            userResponse: { text: null },
            feMeta: {
              isSkipped: true,
              userFlags: "flag2",
              userSortPosition: 3,
            },
          } as TQuestionUserResponseText,
        },
      };

      const actual = userResponseReducer(
        stateWithModifiedFEMeta,
        resetAllFEMeta()
      );

      const q1FeMeta = actual.questionMap.q1?.feMeta;
      const q2FeMeta = actual.questionMap.q2?.feMeta;

      expect(q1FeMeta).toBeDefined();
      expect(q2FeMeta).toBeDefined();

      if (q1FeMeta && q2FeMeta) {
        expect(q1FeMeta).toEqual({
          isSkipped: false,
          userFlags: "",
          userSortPosition: 0,
        });
        expect(q2FeMeta).toEqual({
          isSkipped: false,
          userFlags: "",
          userSortPosition: 1,
        });
      }
    });
  });
});
