import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";

export type Team = {
  id: number;
  name: string;
};

type TeamStore = { teams: Team[] };

/**
 * The Redux slice responsible for all teams.
 */
export const teamSlice = createSlice<
  TeamStore,
  SliceCaseReducers<TeamStore>,
  string
>({
  name: "teams",
  initialState: {
    teams: [],
  },
  reducers: {
    /**
     * Set the teams in the store.
     *
     * @param state The old state
     * @param action The action containing teams as the payload property
     */
    setTeams: function (state, action: { payload: Team[] }) {
      state.teams = action.payload;
    },
  },
});

export const { setTeams } = teamSlice.actions;
export default teamSlice.reducer;
