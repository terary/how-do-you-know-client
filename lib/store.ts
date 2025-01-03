import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { userAnswersApiSlice } from "./features/user-response/userResponseApiSlice";
import { userResponseSlice } from "./features/user-response/userResponseSlice";
import { authApiSlice } from "./features/auth/authApiSlice";
import { questionFilterSlice } from "./features/question-filter/questionFilterSlice";
import { usersApiSlice } from "./features/users/usersApiSlice";
import { fodderPoolsApiSlice } from "./features/fodder-pools/fodderPoolsApiSlice";
import { apiSlice } from "./features/api/apiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      userResponseUI: userResponseSlice.reducer,
      [userAnswersApiSlice.reducerPath]: userAnswersApiSlice.reducer,
      [authApiSlice.reducerPath]: authApiSlice.reducer,
      [usersApiSlice.reducerPath]: usersApiSlice.reducer,
      [fodderPoolsApiSlice.reducerPath]: fodderPoolsApiSlice.reducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
      questionFilter: questionFilterSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(
        userAnswersApiSlice.middleware,
        authApiSlice.middleware,
        usersApiSlice.middleware,
        fodderPoolsApiSlice.middleware,
        apiSlice.middleware
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
