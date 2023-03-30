import { configureStore } from "@reduxjs/toolkit";
import challengeReducer from "./challengeSlice";
import answerReducer from "./answerSlice";
import pictureSlice from "./pictureSlice";
import teamSlice from "./teamSlice";

/**
 * The Redux Store which will maintain our globally shared application state.
 */
export default configureStore({
  reducer: {
    challengeStore: challengeReducer,
    answerStore: answerReducer,
    pictureStore: pictureSlice,
    teamStore: teamSlice,
  },
});
