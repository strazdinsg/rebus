import { configureStore } from "@reduxjs/toolkit";
import challengeReducer from "./challengeSlice";

/**
 * The Redux Store which will maintain our globally shared application state.
 */
export default configureStore({
  reducer: {
    challengeStore: challengeReducer,
  },
});
