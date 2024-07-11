import { combineReducers } from "@reduxjs/toolkit";
import yourSliceReducer from "./yourSlice";
import connectionReducer from "./connectionReducer";
import gameidreducer from "./connection";
const rootReducer = combineReducers({
  yourSlice: yourSliceReducer,
  connection: connectionReducer,
  gameid: gameidreducer,
});

export default rootReducer;
