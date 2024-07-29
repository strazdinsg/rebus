import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { TeamDto } from "schemas/src/team";

type TeamStore = { teams: TeamDto[] };

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
    setTeams: function (state, action: { payload: TeamDto[] }) {
      state.teams = action.payload;
    },
  },
});

export const { setTeams } = teamSlice.actions;
export default teamSlice.reducer;
