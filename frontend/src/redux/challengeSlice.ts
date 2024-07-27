import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";

export type Challenge = {
  id: number;
  question: string;
  maxScore: number;
};

type ChallengeStore = { challenges: Challenge[] };

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
    setChallenges: function (state, action: { payload: Challenge[] }) {
      state.challenges = action.payload;
    },
  },
});

export const { setChallenges } = challengeSlice.actions;
export default challengeSlice.reducer;
