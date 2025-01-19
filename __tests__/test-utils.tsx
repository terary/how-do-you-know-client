import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import { questionFilterSlice } from "@/lib/features/question-filter/questionFilterSlice";
import { authSlice } from "@/lib/features/auth/authSlice";
import { ReactNode } from "react";
import { StoreProvider } from "@/app/StoreProvider";

// First, mock the API slice module
jest.mock("@/lib/features/user-response/userResponseApiSlice", () => {
  const useGetQuestionnaireQuery = jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  }));

  const useSetUserResponseMutation = jest.fn(() => [
    jest.fn(() => Promise.resolve({ data: null })),
    { isLoading: false, error: null },
  ]);

  return {
    userAnswersApiSlice: {
      reducerPath: "userAnswersApi" as const,
      reducer: () => ({}),
      middleware: () => (next: any) => (action: any) => next(action),
      endpoints: {
        setUserResponse: {
          matchPending: () => false,
          matchFulfilled: () => false,
        },
        getQuestionnaire: {
          matchFulfilled: () => false,
        },
      },
      injectEndpoints: () => ({}),
      util: {},
    },
    useGetQuestionnaireQuery,
    useSetUserResponseMutation,
  };
});

// Now we can safely import the slice that depends on the mocked module
import { userResponseSlice } from "@/lib/features/user-response/userResponseSlice";

// Create initial states
const initialUserResponseState = {
  questionMap: {},
  draftResponses: {},
  isEditing: false,
};

// Create a root reducer
const rootReducer = combineReducers({
  auth: authSlice.reducer,
  userResponseUI: userResponseSlice.reducer,
  questionFilter: questionFilterSlice.reducer,
  userAnswersApi: () => ({}),
});

interface ExtendedRenderOptions {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof configureStore>;
}

function render(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
      preloadedState: {
        userResponseUI: initialUserResponseState,
        ...preloadedState,
      } as any,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
  };
}

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: "/",
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

interface WrapperProps {
  children: ReactNode;
}

export const TestWrapper = ({ children }: WrapperProps) => {
  return <StoreProvider>{children}</StoreProvider>;
};

export const renderWithProviders = (ui: ReactNode) => {
  return render(ui, { wrapper: TestWrapper });
};

export * from "@testing-library/react";
export { render };
