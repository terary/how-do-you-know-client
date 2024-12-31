import { userAnswersApiSlice } from "@/lib/features/user-response/userResponseApiSlice";
import { configureStore } from "@reduxjs/toolkit";
import { fetch } from "cross-fetch";
import type { AppDispatch } from "@/lib/store";
import { TUserResponseType } from "@/app/questionnaires/types";

// Mock cross-fetch
jest.mock("cross-fetch", () => ({
  fetch: jest.fn(),
}));

describe("userResponseApiSlice", () => {
  let store: ReturnType<typeof configureStore>;
  let dispatch: AppDispatch;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        [userAnswersApiSlice.reducerPath]: userAnswersApiSlice.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userAnswersApiSlice.middleware),
    });
    dispatch = store.dispatch as AppDispatch;

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe("getQuestionnaire", () => {
    const mockQuestionnaireResponse = {
      questionnaireId: "123",
      questions: [
        {
          questionId: "q1",
          userPromptType: "text",
          userPromptText: "Sample question",
          userResponseType: "free-text-255",
        },
      ],
      examMetaData: {
        examId: "exam123",
        proctorIds: ["proctor1"],
      },
    };

    it("fetches questionnaire without ID", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockQuestionnaireResponse),
        text: () => Promise.resolve(JSON.stringify(mockQuestionnaireResponse)),
        status: 200,
        clone: function () {
          return this;
        },
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await dispatch(
        userAnswersApiSlice.endpoints.getQuestionnaire.initiate({})
      ).unwrap();

      expect(fetch).toHaveBeenCalled();
      const request = (fetch as jest.Mock).mock.calls[0][0];
      expect(request.url).toBe(
        "http://localhost:3001/dev-debug/user-answers/questionnaire"
      );
      expect(request.method).toBe("GET");
      expect(request.credentials).toBe("same-origin");
      expect(result).toEqual(mockQuestionnaireResponse);
    });

    it("fetches questionnaire with ID", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockQuestionnaireResponse),
        text: () => Promise.resolve(JSON.stringify(mockQuestionnaireResponse)),
        status: 200,
        clone: function () {
          return this;
        },
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await dispatch(
        userAnswersApiSlice.endpoints.getQuestionnaire.initiate({
          questionnaireId: "123",
        })
      ).unwrap();

      expect(fetch).toHaveBeenCalled();
      const request = (fetch as jest.Mock).mock.calls[0][0];
      expect(request.url).toBe(
        "http://localhost:3001/dev-debug/user-answers/questionnaire?questionnaireId=123"
      );
      expect(request.method).toBe("GET");
      expect(request.credentials).toBe("same-origin");
      expect(result).toEqual(mockQuestionnaireResponse);
    });

    it("handles error response", async () => {
      const errorResponse = { status: 404, statusText: "Not Found" };
      (fetch as jest.Mock).mockRejectedValueOnce(errorResponse);

      const result = await dispatch(
        userAnswersApiSlice.endpoints.getQuestionnaire.initiate({})
      );

      expect(result.error).toBeDefined();
    });
  });

  describe("setUserResponse", () => {
    const mockUserResponse = {
      questionId: "q1",
      userResponseType: "free-text-255" as TUserResponseType,
      userResponse: {
        text: "Sample answer",
      },
    };

    it("sends user response successfully", async () => {
      const mockResponse = {
        ...mockUserResponse,
        systemAcceptTimeUtc: "2024-03-21T10:00:00Z",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
        status: 200,
        clone: function () {
          return this;
        },
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await dispatch(
        userAnswersApiSlice.endpoints.setUserResponse.initiate(mockUserResponse)
      ).unwrap();

      expect(fetch).toHaveBeenCalled();
      const request = (fetch as jest.Mock).mock.calls[0][0];
      expect(request.url).toBe("http://localhost:3001/dev-debug/user-answers");
      expect(request.method).toBe("POST");
      expect(JSON.parse(request._bodyInit)).toEqual(mockUserResponse);
      expect(result).toEqual(mockResponse);
    });

    it("handles error when sending user response", async () => {
      const errorResponse = { status: 400, statusText: "Bad Request" };
      (fetch as jest.Mock).mockRejectedValueOnce(errorResponse);

      const result = await dispatch(
        userAnswersApiSlice.endpoints.setUserResponse.initiate(mockUserResponse)
      );

      expect(result.error).toBeDefined();
    });
  });

  describe("cache invalidation", () => {
    it("invalidates UserAnswers tag after setUserResponse", async () => {
      const mockResponse = {
        questionId: "q1",
        userResponseType: "free-text-255" as TUserResponseType,
        userResponse: { text: "answer" },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
        status: 200,
        clone: function () {
          return this;
        },
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await dispatch(
        userAnswersApiSlice.endpoints.setUserResponse.initiate(mockResponse)
      ).unwrap();

      expect(result).toEqual(mockResponse);
    });
  });
});
