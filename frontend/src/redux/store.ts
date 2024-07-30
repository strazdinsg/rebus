import { configureStore } from "@reduxjs/toolkit";
import answerReducer from "./answerSlice";
import pictureSlice from "./pictureSlice";
import teamSlice from "./teamSlice";

export type RootState = {
  answerStore: ReturnType<typeof answerReducer>;
  pictureStore: ReturnType<typeof pictureSlice>;
  teamStore: ReturnType<typeof teamSlice>;
};

/**
 * The Redux Store which will maintain our globally shared application state.
 */
export default configureStore<RootState>({
  reducer: {
    answerStore: answerReducer,
    pictureStore: pictureSlice,
    teamStore: teamSlice,
  },
});
