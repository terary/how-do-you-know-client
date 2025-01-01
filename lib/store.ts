import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { userAnswersApiSlice } from "./features/user-response/userResponseApiSlice";
import { userResponseSlice } from "./features/user-response/userResponseSlice";
import { authApiSlice } from "./features/auth/authApiSlice";
import { questionFilterSlice } from "./features/question-filter/questionFilterSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      userResponseUI: userResponseSlice.reducer,
      [userAnswersApiSlice.reducerPath]: userAnswersApiSlice.reducer,
      [authApiSlice.reducerPath]: authApiSlice.reducer,
      questionFilter: questionFilterSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(
        userAnswersApiSlice.middleware,
        authApiSlice.middleware
      );
    },
  });
};

const store = makeStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppStore = ReturnType<typeof makeStore>;
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
