import { createSlice } from "@reduxjs/toolkit";

const yourSlice = createSlice({
  name: "yourSlice",
  initialState: {
    someValue: null,
  },
  reducers: {
    setSomeValue: (state, action) => {
      state.someValue = action.payload;
    },
  },
});

export const { setSomeValue } = yourSlice.actions;
export default yourSlice.reducer;
