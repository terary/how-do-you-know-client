import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { userResponseSlice } from "@/lib/features/user-response/userResponseSlice";
import { questionFilterSlice } from "@/lib/features/question-filter/questionFilterSlice";

const userResponseUIReducer = (
  state = {
    questionMap: {},
    draftResponses: {},
    isEditing: false,
  },
  action: any
) => {
  switch (action.type) {
    default:
      return state;
  }
};

const testReducer = {
  userResponseUI: userResponseUIReducer,
  questionFilter: (
    state = questionFilterSlice.getInitialState(),
    action: any
  ) => questionFilterSlice.reducer(state, action),
};

interface ExtendedRenderOptions {
  preloadedState?: Partial<{
    userResponseUI: ReturnType<typeof userResponseUIReducer>;
    questionFilter: ReturnType<typeof questionFilterSlice.reducer>;
  }>;
  store?: ReturnType<typeof configureStore>;
}

function render(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: testReducer,
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
