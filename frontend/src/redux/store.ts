import { configureStore } from "@reduxjs/toolkit";
import challengeReducer from "./challengeSlice";
import answerReducer from "./answerSlice";
import pictureSlice from "./pictureSlice";
import teamSlice from "./teamSlice";

export type RootState = {
  challengeStore: ReturnType<typeof challengeReducer>;
  answerStore: ReturnType<typeof answerReducer>;
  pictureStore: ReturnType<typeof pictureSlice>;
  teamStore: ReturnType<typeof teamSlice>;
};

/**
 * The Redux Store which will maintain our globally shared application state.
 */
export default configureStore<RootState>({
  reducer: {
    challengeStore: challengeReducer,
    answerStore: answerReducer,
    pictureStore: pictureSlice,
    teamStore: teamSlice,
  },
});
