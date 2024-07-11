import { createSlice } from "@reduxjs/toolkit";

const gameid = createSlice({
  name: "gameid",
  initialState: {
    id: null,
  },
  reducers: {
    setgameid: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { setgameid } = gameid.actions;
export default gameid.reducer;
