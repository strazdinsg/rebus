import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { ChallengeDto } from "schemas/src/challenge";

type ChallengeStore = { challenges: ChallengeDto[] };

/**
 * The Redux slice responsible for challenge data.
 */
export const challengeSlice = createSlice<
  ChallengeStore,
  SliceCaseReducers<ChallengeStore>,
  string
>({
  name: "challenges",
  initialState: {
    challenges: [],
  },
  reducers: {
    /**
     * Set the challenges in the store.
     *
     * @param state The old state
     * @param action The action containing new challenges as the payload property
     */
    setChallenges: function (state, action: { payload: ChallengeDto[] }) {
      state.challenges = action.payload;
    },
  },
});

export const { setChallenges } = challengeSlice.actions;
export default challengeSlice.reducer;
