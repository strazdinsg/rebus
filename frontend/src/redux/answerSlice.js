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
    allAnswers: null,
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
    /**
     * Set all answers for the all users (teams)
     * @param state
     * @param action
     */
    setAllAnswers: function (state, action) {
      state.allAnswers = action.payload;
    },
    /**
     * Set (or update) score for one answer for a specific user and challenge
     * @param state
     * @param action Must contain payload in the format {challengeId, userId, score}
     */
    updateScore: function (state, action) {
      const challengeId = parseInt(action.payload.challengeId);
      const userId = parseInt(action.payload.userId);
      const score = parseInt(action.payload.score);
      const scoresToUpdate = findOrCreateScores(state.allAnswers, userId);
      scoresToUpdate[challengeId - 1] = score;
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

function findOrCreateScores(allAnswers, userId) {
  let teamAnswers = allAnswers.find(
    (allTeamAnswers) => allTeamAnswers.teamId === userId
  );
  if (teamAnswers) {
    return teamAnswers.scores;
  } else {
    const challengeCount = getChallengeCount(allAnswers);
    teamAnswers = createTeamAnswers(userId, challengeCount);
    allAnswers.push(teamAnswers);
  }
  return teamAnswers.scores;
}

function createTeamAnswers(userId, challengeCount) {
  return {
    teamId: userId,
    answers: createNullArray(challengeCount),
    scores: createNullArray(challengeCount),
  };
}

function getChallengeCount(allAnswers) {
  return allAnswers[0].answers.length;
}

function createNullArray(length) {
  const a = [];
  for (let i = 0; i < length; ++i) {
    a.push(null);
  }
  return a;
}

export const {
  setMyAnswers,
  setMyAnswerForChallenge,
  setAllAnswers,
  updateScore,
} = answerSlice.actions;
export default answerSlice.reducer;
