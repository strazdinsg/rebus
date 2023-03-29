import { createSlice } from "@reduxjs/toolkit";

/**
 * Redux slice responsible for holding answer data
 * @type {Slice<{myAnswers: null}, {setMyAnswerForChallenge: reducers.setMyAnswerForChallenge,
 * setMyAnswers: reducers.setMyAnswers}, string>}
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
    /**
     * Set (or update) one answer for the current user
     * @param state
     * @param action Must contain payload in the format {challengeId, answer}
     */
    setMyAnswerForChallenge: function (state, action) {
      const challengeId = parseInt(action.payload.challengeId);
      const answerToUpdate = findOrCreateAnswer(state.myAnswers, challengeId);
      answerToUpdate.answer = action.payload.answer;
    },
  },
});

function findOrCreateAnswer(myAnswers, challengeId) {
  const answerIndex = myAnswers.findIndex(
    (answer) => answer.challengeId === challengeId
  );
  let answerToUpdate;
  if (answerIndex >= 0) {
    answerToUpdate = myAnswers[answerIndex];
  } else {
    answerToUpdate = { challengeId: challengeId };
    myAnswers.push(answerToUpdate);
  }
  return answerToUpdate;
}

export const { setMyAnswers, setMyAnswerForChallenge } = answerSlice.actions;
export default answerSlice.reducer;
