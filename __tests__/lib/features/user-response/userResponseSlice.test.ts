import userResponseReducer, {
  setDraftResponse,
  setArrayValueDraftResponse,
  clearDraftResponse,
  commitDraftResponse,
  commitArrayValueDraftResponse,
  setIsEditing,
  updateQuestionFEMeta,
} from "@/lib/features/user-response/userResponseSlice";
import { userAnswersApiSlice } from "@/lib/features/user-response/userResponseApiSlice";
import { TQuestionAny } from "@/app/questionnaires/types";

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
        type: "userResponseApi/executeMutation/pending",
        meta: {
          arg: {
            type: "mutation",
            endpointName: "setUserResponse",
            originalArgs: {},
          },
        },
      });
      expect(actual.isEditing).toBe(true);
    });

    it("should handle setUserResponse fulfilled with existing question", () => {
      const mockQuestion: TQuestionAny = {
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
        type: "userResponseApi/executeMutation/fulfilled",
        meta: {
          arg: {
            type: "mutation",
            endpointName: "setUserResponse",
            originalArgs: {},
          },
        },
        payload: {
          questionId: "q1",
          userResponse: { text: "submitted" },
        },
      });
      expect(actual.isEditing).toBe(false);
      expect(actual.questionMap.q1.userResponseHistory).toContainEqual({
        questionId: "q1",
        userResponse: { text: "submitted" },
      });
      expect(actual.draftResponses.q1).toBeUndefined();
    });

    it("should handle getQuestionnaire fulfilled with empty questions", () => {
      const actual = userResponseReducer(initialState, {
        type: `${userAnswersApiSlice.reducerPath}/executeQuery/fulfilled`,
        meta: {
          arg: {
            type: "query",
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
      const mockQuestions: TQuestionAny[] = [
        {
          questionId: "q1",
          userPromptType: "text",
          userPromptText: "question 1",
          userResponseType: "free-text-255",
          userResponseHistory: [],
          userResponse: { text: null },
          feMeta: {
            isSkipped: false,
            isUserFlagged: false,
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
            isUserFlagged: false,
            userFlags: "",
            userSortPosition: 1,
          },
        },
      ];

      const actual = userResponseReducer(initialState, {
        type: `${userAnswersApiSlice.reducerPath}/executeQuery/fulfilled`,
        meta: {
          arg: {
            type: "query",
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
            type: "query",
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
            feMeta: {
              isSkipped: false,
              userFlags: "",
              userSortPosition: 0,
            },
          },
        },
      };

      const actual = userResponseReducer(
        initialQuestionState as any,
        updateQuestionFEMeta({
          questionId: "q1",
          feMeta: {
            isSkipped: true,
            userFlags: "test flag",
            userSortPosition: 1,
          },
        })
      );

      expect(actual.questionMap.q1.feMeta).toEqual({
        isSkipped: true,
        userFlags: "test flag",
        userSortPosition: 1,
      });
    });

    it("should handle updateQuestionFEMeta when question does not exist", () => {
      const actual = userResponseReducer(
        initialState,
        updateQuestionFEMeta({
          questionId: "nonexistent",
          feMeta: {
            isSkipped: true,
            userFlags: "test flag",
            userSortPosition: 1,
          },
        })
      );

      // State should remain unchanged when question doesn't exist
      expect(actual).toEqual(initialState);
    });
  });
});
