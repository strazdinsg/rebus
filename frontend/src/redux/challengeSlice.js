// Here we manage the Redux store slice responsible for holding challenge data

import { createSlice } from "@reduxjs/toolkit";

export const challengeSlice = createSlice({
  name: "challenges",
  initialState: {
    challenges: [],
    answers: [],
  },
  reducers: {
    /**
     * Add a single item from the shopping cart
     * @param state
     * @param action action.payload must contain the product to add
     */
    setChallenges: function (state, action) {
      state.challenges = action.payload;
    },
  },
});

export const { setChallenges } = challengeSlice.actions;
export default challengeSlice.reducer;
