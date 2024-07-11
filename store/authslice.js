import { createSlice } from "@reduxjs/toolkit";

const authslice = createSlice({
  name: "authslice",
  initialState: {
    playerdata: null,
    players: [],
    selectedTime: 60,
    playername: null,
    id: null,
  },
  reducers: {
    setPlayerData: (state, action) => {
      state.playerdata = action.payload;
    },
    setgameid: (state, action) => {
      state.id = action.payload;
    },
    setTimer: (state, action) => {
      console.log("action", action);
      state.selectedTime = action.payload;
    },
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    setPlayername: (state, action) => {
      state.playername = action.payload;
    },
  },
});

export const { setTimer, setgameid, setPlayername, setPlayers, setPlayerData } =
  authslice.actions;
export default authslice.reducer;
