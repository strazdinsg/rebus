import { createSlice } from "@reduxjs/toolkit";

/**
 * Redux slice responsible for holding answer data
 * @type {Slice<{myAnswers: null}, {setMyAnswers: reducers.setMyAnswers}, string>}
 */
export const answerSlice = createSlice({
  name: "answers",
  initialState: {
    myAnswers: null,
  },
  reducers: {
    /**
     * Set answers for the current user
     * @param state
     * @param action
     */
    setMyAnswers: function (state, action) {
      state.myAnswers = action.payload;
    },
  },
});

export const { setMyAnswers } = answerSlice.actions;
export default answerSlice.reducer;
