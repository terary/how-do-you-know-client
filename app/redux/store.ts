import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import counterReducer from "./features/counterSlice";

const rootReducer = combineReducers({
  counter: counterReducer,
});

// Export the rootReducer separately
export { rootReducer };

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
