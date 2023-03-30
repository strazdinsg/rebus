import { createSlice } from "@reduxjs/toolkit";

/**
 * The Redux slice responsible for all teams.
 * @type {Slice<{teams: *[]}, {setTeams: reducers.setTeams}, string>}
 */
export const teamSlice = createSlice({
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
    setTeams: function (state, action) {
      state.teams = action.payload;
    },
  },
});

export const { setTeams } = teamSlice.actions;
export default teamSlice.reducer;
