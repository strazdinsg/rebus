import { createSlice } from "@reduxjs/toolkit";

/**
 * The Redux slice responsible for challenge data.
 *
 * @type {Slice<{challenges: *[]}, {setChallenges: reducers.setChallenges}, string>}
 */
export const challengeSlice = createSlice({
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
    setChallenges: function (state, action) {
      state.challenges = action.payload;
    },
  },
});

export const { setChallenges } = challengeSlice.actions;
export default challengeSlice.reducer;
