import { configureStore } from "@reduxjs/toolkit";
import answerReducer from "./answerSlice";
import pictureSlice from "./pictureSlice";

export type RootState = {
  answerStore: ReturnType<typeof answerReducer>;
  pictureStore: ReturnType<typeof pictureSlice>;
};

/**
 * The Redux Store which will maintain our globally shared application state.
 */
export default configureStore<RootState>({
  reducer: {
    answerStore: answerReducer,
    pictureStore: pictureSlice,
  },
});
