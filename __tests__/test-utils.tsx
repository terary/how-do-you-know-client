import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import type { PreloadedState } from "@reduxjs/toolkit";
import { counterSlice } from "@/app/redux/features/counterSlice";

// Create a userResponseUI reducer specifically for testing
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

// Create a test store with just the reducers we need
const testReducer = {
  userResponseUI: userResponseUIReducer,
  counter: counterSlice.reducer,
};

interface ExtendedRenderOptions {
  preloadedState?: PreloadedState<any>;
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
