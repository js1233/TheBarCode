import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import generalSlice from "./generalSlice";
import orderSlice from "./orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    general: generalSlice,
    order: orderSlice
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
