import { userAnswersApiSlice } from "../../../../lib/features/user-response/userResponseApiSlice";
import { configureStore } from "@reduxjs/toolkit";
import type { AppDispatch } from "@/lib/store";
import { TUserResponseType } from "@/app/questionnaires/types";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import type { Api } from "@reduxjs/toolkit/query";

// Define the API state type
type ApiState = ReturnType<typeof userAnswersApiSlice.reducer>;

// Define the store type
type StoreType = ReturnType<
  typeof configureStore<{
    [userAnswersApiSlice.reducerPath]: ApiState;
  }>
>;

// Mock fetch
const originalFetch = global.fetch;
beforeAll(() => {
  global.fetch = jest.fn();
});

afterAll(() => {
  global.fetch = originalFetch;
});

describe("userResponseApiSlice", () => {
  let store: StoreType;
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
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockQuestionnaireResponse),
        text: () => Promise.resolve(JSON.stringify(mockQuestionnaireResponse)),
        status: 200,
        clone: function () {
          return this;
        },
        headers: new Headers({ "content-type": "application/json" }),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await dispatch(
        userAnswersApiSlice.endpoints.getQuestionnaire.initiate({})
      ).unwrap();

      expect(global.fetch).toHaveBeenCalled();
      const request = (global.fetch as jest.Mock).mock.calls[0][0] as Request;
      expect(request.url).toBe(
        "http://localhost:3001/dev-debug/user-answers/questionnaire"
      );
      expect(result).toEqual(mockQuestionnaireResponse);
    });

    it("fetches questionnaire with ID", async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockQuestionnaireResponse),
        text: () => Promise.resolve(JSON.stringify(mockQuestionnaireResponse)),
        status: 200,
        clone: function () {
          return this;
        },
        headers: new Headers({ "content-type": "application/json" }),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await dispatch(
        userAnswersApiSlice.endpoints.getQuestionnaire.initiate({
          questionnaireId: "123",
        })
      ).unwrap();

      expect(global.fetch).toHaveBeenCalled();
      const request = (global.fetch as jest.Mock).mock.calls[0][0] as Request;
      expect(request.url).toBe(
        "http://localhost:3001/dev-debug/user-answers/questionnaire?questionnaireId=123"
      );
      expect(result).toEqual(mockQuestionnaireResponse);
    });

    it("handles error response", async () => {
      const mockErrorResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: () => Promise.resolve({ message: "Not found" }),
        text: () => Promise.resolve(JSON.stringify({ message: "Not found" })),
        clone: function () {
          return this;
        },
        headers: new Headers({ "content-type": "application/json" }),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce(mockErrorResponse);

      const result = await dispatch(
        userAnswersApiSlice.endpoints.getQuestionnaire.initiate({})
      );

      expect(result.error).toBeDefined();
      if (result.error) {
        const error = result.error as FetchBaseQueryError;
        if ("status" in error) {
          expect(error.status).toBe(404);
        }
      }
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

      const mockFetchResponse = {
        ok: true,
        json: () => Promise.resolve(mockResponse),
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
        status: 200,
        clone: function () {
          return this;
        },
        headers: new Headers({ "content-type": "application/json" }),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce(mockFetchResponse);

      const result = await dispatch(
        userAnswersApiSlice.endpoints.setUserResponse.initiate(mockUserResponse)
      ).unwrap();

      expect(global.fetch).toHaveBeenCalled();
      const request = (global.fetch as jest.Mock).mock.calls[0][0] as Request;
      expect(request.url).toBe("http://localhost:3001/dev-debug/user-answers");
      expect(result).toEqual(mockResponse);
    });

    it("handles error when sending user response", async () => {
      const mockErrorResponse = {
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: () => Promise.resolve({ message: "Invalid request" }),
        text: () =>
          Promise.resolve(JSON.stringify({ message: "Invalid request" })),
        clone: function () {
          return this;
        },
        headers: new Headers({ "content-type": "application/json" }),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce(mockErrorResponse);

      const result = await dispatch(
        userAnswersApiSlice.endpoints.setUserResponse.initiate(mockUserResponse)
      );

      expect(result.error).toBeDefined();
      if (result.error) {
        const error = result.error as FetchBaseQueryError;
        if ("status" in error) {
          expect(error.status).toBe(400);
        }
      }
    });
  });

  describe("cache invalidation", () => {
    it("invalidates Questionnaire tag after setUserResponse", async () => {
      // First, set up a mock questionnaire response to populate the cache
      const mockQuestionnaireResponse = {
        questions: [
          {
            questionId: "q1",
            userPromptType: "text",
            userPromptText: "Sample question",
            userResponseType: "free-text-255",
          },
        ],
      };

      const mockQuestionnaireResponseFetch = {
        ok: true,
        json: () => Promise.resolve(mockQuestionnaireResponse),
        text: () => Promise.resolve(JSON.stringify(mockQuestionnaireResponse)),
        status: 200,
        clone: function () {
          return this;
        },
        headers: new Headers({ "content-type": "application/json" }),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockQuestionnaireResponseFetch
      );

      // Fetch questionnaire to populate cache
      await dispatch(
        userAnswersApiSlice.endpoints.getQuestionnaire.initiate({})
      ).unwrap();

      // Now set up the user response mock
      const mockResponse = {
        questionId: "q1",
        userResponseType: "free-text-255" as TUserResponseType,
        userResponse: { text: "answer" },
        systemAcceptTimeUtc: "2024-03-21T10:00:00Z",
      };

      const mockFetchResponse = {
        ok: true,
        json: () => Promise.resolve(mockResponse),
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
        status: 200,
        clone: function () {
          return this;
        },
        headers: new Headers({ "content-type": "application/json" }),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce(mockFetchResponse);

      // Make the setUserResponse call
      const result = await dispatch(
        userAnswersApiSlice.endpoints.setUserResponse.initiate(mockResponse)
      ).unwrap();

      expect(result).toEqual(mockResponse);

      // Verify that the cache was invalidated
      const state = store.getState();
      const apiState = state[userAnswersApiSlice.reducerPath];

      // The tag should be present in the provided object
      expect(apiState.provided).toBeDefined();
      expect(Object.keys(apiState.provided)).toContain("Questionnaire");
    });
  });
});
