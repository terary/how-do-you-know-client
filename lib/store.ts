import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { userAnswersApiSlice } from "./features/user-response/userResponseApiSlice";
import { userResponseSlice } from "./features/user-response/userResponseSlice";
import { authApiSlice } from "./features/auth/authApiSlice";

const rootReducer = combineSlices(
  userAnswersApiSlice,
  userResponseSlice,
  authApiSlice
);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(
        userAnswersApiSlice.middleware,
        authApiSlice.middleware
      );
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
`
  This branch is ready to be merged into the main branch.

  You will want to note on the login page
   the quarky behavior with storage cookies vs local storage
   also explain that the auth token is handled by nestjs so it always goes with the requests 
   (I think, or authenticated root request)

   You DONT want to figure it out again



`;
