import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";

type NullableNumber = number | null;
type NullableString = string | null;

type ScoreUpdateAction = {
  payload: {
    challengeId: number;
    userId: number;
    score: number | null;
  };
};

export type Answer = {
  challengeId: number;
  answer: string;
  score: number | null;
};

export type ShortTeamAnswers = {
  teamId: number;
  answers: NullableString[];
  scores: NullableNumber[];
};

export type AnswerStore = {
  myAnswers: Answer[];
  allAnswers: ShortTeamAnswers[];
};

/**
 * Redux slice responsible for holding answer data
 */
export const answerSlice = createSlice<
  AnswerStore,
  SliceCaseReducers<AnswerStore>,
  string
>({
  name: "answers",
  initialState: {
    myAnswers: [],
    allAnswers: [],
  },
  reducers: {
    /**
     * Set answers for the current user
     * @param state
     * @param action
     */
    setMyAnswers: function (state, action: { payload: Answer[] }) {
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
    setAllAnswers: function (state, action: { payload: ShortTeamAnswers[] }) {
      state.allAnswers = action.payload;
    },
    /**
     * Set (or update) score for one answer for a specific user and challenge
     * @param state
     * @param action Must contain payload in the format {challengeId, userId, score}
     */
    updateScore: function (state, action: ScoreUpdateAction) {
      const scoresToUpdate = findOrCreateScores(
        state.allAnswers,
        action.payload.userId
      );
      scoresToUpdate[action.payload.challengeId - 1] = action.payload.score;
    },
  },
});

function findOrCreateAnswer(myAnswers: Answer[], challengeId: number) {
  const answerIndex = myAnswers.findIndex(
    (answer) => answer.challengeId === challengeId
  );
  let answerToUpdate: Answer;
  if (answerIndex >= 0) {
    answerToUpdate = myAnswers[answerIndex];
  } else {
    answerToUpdate = { challengeId: challengeId, answer: "", score: null };
    myAnswers.push(answerToUpdate);
  }
  return answerToUpdate;
}

function findOrCreateScores(allAnswers: ShortTeamAnswers[], userId: number) {
  let teamAnswers = allAnswers.find(
    (allTeamAnswers) => allTeamAnswers.teamId === userId
  );
  if (teamAnswers) {
    return teamAnswers.scores;
  } else {
    const challengeCount = getChallengeCount(allAnswers);
    teamAnswers = createEmptyTeamAnswers(userId, challengeCount);
    allAnswers.push(teamAnswers);
  }
  return teamAnswers.scores;
}

function createEmptyTeamAnswers(
  userId: number,
  challengeCount: number
): ShortTeamAnswers {
  return {
    teamId: userId,
    answers: createNullArray(challengeCount),
    scores: createNullArray(challengeCount),
  };
}

function getChallengeCount(allAnswers: ShortTeamAnswers[]) {
  return allAnswers[0].answers.length;
}

function createNullArray(length: number): null[] {
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
